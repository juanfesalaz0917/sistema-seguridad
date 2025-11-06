// src/pages/DigitalSignature/DigitalSignature.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import Swal from "sweetalert2";

const DigitalSignaturePage: React.FC = () => {
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-black mb-0">{user?.name} - Signature</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            className="bg-gray-600 hover:bg-gray-700 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            onClick={handleBack}
          >
            <i className="bi bi-arrow-left mr-2"></i>
            Volver
          </button>
          {!isEditing && signature && (
            <>
              <button 
                className="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil mr-2"></i>
                Editar
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                onClick={handleDelete} 
                disabled={uploading}
              >
                <i className="bi bi-trash mr-2"></i>
                Eliminar
              </button>
            </>
          )}
          {!isEditing && !signature && (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-plus-lg mr-2"></i>
              Crear Firma
            </button>
          )}
        </div>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row">
            {/* Columna izquierda - Firma */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center lg:border-r lg:border-gray-200 lg:pr-6 mb-6 lg:mb-0">
              <h5 className="text-gray-600 mb-4 text-lg font-medium">Signature</h5>

              {/* Vista/Edición de firma */}
              <div
                className="border-2 border-gray-300 rounded-lg flex items-center justify-center relative bg-gray-50"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "300px",
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Digital Signature"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <i className="bi bi-image text-4xl mb-3 block"></i>
                    <p className="text-black">
                      {isEditing ? "Selecciona una imagen" : "No hay firma digital registrada"}
                    </p>
                  </div>
                )}
              </div>

              {/* Input de archivo en modo edición */}
              {isEditing && (
                <div className="mt-4 w-full max-w-[400px]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  <small className="text-gray-600 block mt-2">
                    Formatos: JPG, PNG, GIF. Máximo: 5MB
                  </small>
                </div>
              )}

              {/* Botones de acción en modo edición */}
              {isEditing && (
                <div className="flex gap-3 mt-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg mr-2"></i>
                        Guardar
                      </>
                    )}
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCancel}
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Columna derecha - Información del usuario */}
            <div className="lg:w-1/2 flex flex-col justify-center lg:pl-6">
              <div className="mb-4">
                <label className="block text-gray-600 font-semibold mb-2">Name:</label>
                <p className="text-xl text-black mb-0">{user?.name || "N/A"}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-semibold mb-2">Email:</label>
                <p className="text-base text-black break-words">{user?.email || "N/A"}</p>
              </div>

              {signature && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-600 font-semibold mb-2">Estado:</label>
                    <p className="text-base mb-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i className="bi bi-check-circle mr-1"></i>
                        Firma Registrada
                      </span>
                    </p>
                  </div>

                  {signature.created_at && (
                    <div className="mb-4">
                      <label className="block text-gray-600 font-semibold mb-2">Fecha de creación:</label>
                      <p className="text-base text-black mb-0">
                        {new Date(signature.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {signature.updated_at && (
                    <div className="mb-4">
                      <label className="block text-gray-600 font-semibold mb-2">Última actualización:</label>
                      <p className="text-base text-black mb-0">
                        {new Date(signature.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              )}

              {!signature && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4" role="alert">
                  <div className="flex items-center">
                    <i className="bi bi-exclamation-triangle text-yellow-600 mr-2"></i>
                    <span className="text-yellow-800">
                      Este usuario aún no tiene una firma digital registrada.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalSignaturePage;