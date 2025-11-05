// src/pages/DigitalSignature/UpdateDigitalSignature.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import Swal from "sweetalert2";

const UpdateDigitalSignature: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string>("");
  const [newPhoto, setNewPhoto] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      fetchData(parseInt(userId));
    }
  }, [userId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);
      
      const userData = await userService.getUserById(id);
      if (!userData) {
        Swal.fire("Error", "Usuario no encontrado", "error");
        navigate("/user/list");
        return;
      }
      setUser(userData);

      const signatureData = await digitalSignatureService.getSignatureByUserId(id);
      if (signatureData && signatureData.photo) {
        setCurrentPhoto(signatureData.photo);
        setNewPhoto(signatureData.photo);
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

    // Convertir a base64 para preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setNewPhoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPhoto) {
      Swal.fire("Error", "Debes seleccionar una imagen para la firma", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirmar actualización",
      text: "¿Estás seguro de actualizar la firma digital?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setUploading(true);

      const id = parseInt(userId!);
      
      // Intentar actualizar
      let success = await digitalSignatureService.updateSignatureByUserId(id, newPhoto);
      
      // Si no existe, crear nueva
      if (!success) {
        success = await digitalSignatureService.createSignature({
          user_id: id,
          photo: newPhoto,
        });
      }

      setUploading(false);

      if (success) {
        await Swal.fire("Éxito", "Firma digital actualizada correctamente", "success");
        navigate(`/user/digital-signature/${userId}`);
      } else {
        Swal.fire("Error", "No se pudo actualizar la firma digital", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploading(false);
      Swal.fire("Error", "Ocurrió un error al actualizar", "error");
    }
  };

  const handleCancel = () => {
    navigate(`/user/digital-signature/${userId}`);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Actualizar Firma Digital</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Información del usuario */}
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Usuario:</label>
                  <p className="fs-5">{user?.name}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email:</label>
                  <p className="text-muted">{user?.email}</p>
                </div>
              </div>

              {/* Área de firma */}
              <div className="col-md-8">
                <label className="form-label fw-semibold">Firma Digital:</label>
                
                {/* Preview de la imagen */}
                <div 
                  className="border border-2 rounded mb-3 d-flex align-items-center justify-content-center position-relative"
                  style={{ 
                    height: "300px",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  {newPhoto ? (
                    <>
                      <img
                        src={newPhoto}
                        alt="Signature Preview"
                        style={{ 
                          maxWidth: "100%", 
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                        onClick={handleRemovePhoto}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-muted">
                      <i className="bi bi-image fs-1 mb-2 d-block"></i>
                      <p>No hay imagen seleccionada</p>
                    </div>
                  )}
                </div>

                {/* Input de archivo */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                <small className="text-muted">
                  Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                </small>
              </div>
            </div>

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploading || !newPhoto}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDigitalSignature;