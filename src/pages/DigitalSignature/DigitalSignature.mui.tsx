import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import Swal from "sweetalert2";

const DigitalSignatureMui: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (userId) {
      fetchData(parseInt(userId));
    }
  }, [userId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);

      // Obtener usuario
      const userData = await userService.getUserById(id);
      if (!userData) {
        Swal.fire("Error", "Usuario no encontrado", "error");
        navigate("/user/list");
        return;
      }
      setUser(userData);

      // Obtener firma digital
      const signatureData = await digitalSignatureService.getSignatureByUserId(id);
      setSignature(signatureData);
      
      if (signatureData?.photo) {
        setPreviewUrl(digitalSignatureService.getImageUrl(signatureData.photo));
      }

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Por favor selecciona una imagen válida", "error");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "La imagen no debe superar los 5MB", "error");
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedFile) {
      Swal.fire("Error", "Debes seleccionar una imagen para la firma", "error");
      return;
    }

    const result = await Swal.fire({
      title: signature ? "Actualizar firma" : "Crear firma",
      text: signature 
        ? "¿Estás seguro de actualizar la firma digital?" 
        : "¿Estás seguro de crear la firma digital?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setUploading(true);
      const id = parseInt(userId!);

      let success;
      if (signature?.id) {
        // Actualizar firma existente
        success = await digitalSignatureService.updateSignature(signature.id, selectedFile);
      } else {
        // Crear nueva firma
        success = await digitalSignatureService.createSignature(id, selectedFile);
      }

      setUploading(false);

      if (success) {
        await Swal.fire(
          "Éxito", 
          signature ? "Firma actualizada correctamente" : "Firma creada correctamente", 
          "success"
        );
        setIsEditing(false);
        setSelectedFile(null);
        fetchData(id);
      } else {
        Swal.fire("Error", "No se pudo guardar la firma digital", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploading(false);
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  const handleDelete = async () => {
    if (!signature?.id) return;

    const result = await Swal.fire({
      title: "Eliminar firma",
      text: "¿Estás seguro de eliminar la firma digital? Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setUploading(true);
      const success = await digitalSignatureService.deleteSignature(signature.id);
      setUploading(false);

      if (success) {
        await Swal.fire("Eliminada", "La firma digital ha sido eliminada", "success");
        setSignature(null);
        setPreviewUrl("");
        setIsEditing(false);
      } else {
        Swal.fire("Error", "No se pudo eliminar la firma digital", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploading(false);
      Swal.fire("Error", "Ocurrió un error al eliminar", "error");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    if (signature?.photo) {
      setPreviewUrl(digitalSignatureService.getImageUrl(signature.photo));
    } else {
      setPreviewUrl("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    navigate("/user/list");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{user?.name} - Signature</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
          {!isEditing && signature && (
            <>
              <button className="btn btn-warning" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={uploading}>
                <i className="bi bi-trash me-2"></i>
                Eliminar
              </button>
            </>
          )}
          {!isEditing && !signature && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <i className="bi bi-plus-lg me-2"></i>
              Crear Firma
            </button>
          )}
        </div>
      </div>

      {/* Card principal */}
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="row">
            {/* Columna izquierda - Firma */}
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center border-end">
              <h5 className="text-muted mb-3">Signature</h5>

              {/* Vista/Edición de firma */}
              <div
                className="border border-2 rounded d-flex align-items-center justify-content-center position-relative"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "300px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Digital Signature"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="text-center text-muted">
                    <i className="bi bi-image fs-1 mb-2 d-block"></i>
                    <p className="mb-0">
                      {isEditing ? "Selecciona una imagen" : "No hay firma digital registrada"}
                    </p>
                  </div>
                )}
              </div>

              {/* Input de archivo en modo edición */}
              {isEditing && (
                <div className="mt-3 w-100" style={{ maxWidth: "400px" }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <small className="text-muted d-block mt-2">
                    Formatos: JPG, PNG, GIF. Máximo: 5MB
                  </small>
                </div>
              )}

              {/* Botones de acción en modo edición */}
              {isEditing && (
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Columna derecha - Información del usuario */}
            <div className="col-md-6 d-flex flex-column justify-content-center ps-md-5">
              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">Name:</label>
                <p className="fs-5 mb-0">{user?.name || "N/A"}</p>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">Email:</label>
                <p className="fs-6 mb-0 text-break">{user?.email || "N/A"}</p>
              </div>

              {signature && (
                <>
                  <div className="mb-4">
                    <label className="form-label text-muted fw-semibold">Estado:</label>
                    <p className="fs-6 mb-0">
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Firma Registrada
                      </span>
                    </p>
                  </div>

                  {signature.created_at && (
                    <div className="mb-4">
                      <label className="form-label text-muted fw-semibold">Fecha de creación:</label>
                      <p className="fs-6 mb-0">
                        {new Date(signature.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {signature.updated_at && (
                    <div className="mb-4">
                      <label className="form-label text-muted fw-semibold">Última actualización:</label>
                      <p className="fs-6 mb-0">
                        {new Date(signature.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              )}

              {!signature && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Este usuario aún no tiene una firma digital registrada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalSignatureMui;