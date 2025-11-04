// src/pages/DigitalSignature/ViewDigitalSignature.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import Swal from "sweetalert2";

const ViewDigitalSignature: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Usuario no encontrado");
        setLoading(false);
        return;
      }
      setUser(userData);

      // Obtener firma digital
      const signatureData = await digitalSignatureService.getSignatureByUserId(id);
      setSignature(signatureData);
      
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar la información");
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    navigate(`/user/digital-signature/update/${userId}`);
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header con botones */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{user?.name} - Signature</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
          <button className="btn btn-primary" onClick={handleUpdate}>
            <i className="bi bi-pencil me-2"></i>
            Actualizar Firma
          </button>
        </div>
      </div>

      {/* Card principal */}
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="row">
            {/* Columna izquierda - Firma */}
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center border-end">
              <h5 className="text-muted mb-3">Signature</h5>
              
              {signature && signature.photo ? (
                <div 
                  className="border border-2 rounded d-flex align-items-center justify-content-center"
                  style={{ 
                    width: "100%", 
                    maxWidth: "400px", 
                    height: "300px",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  <img
                    src={signature.photo}
                    alt="Digital Signature"
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>
              ) : (
                <div 
                  className="border border-2 border-dashed rounded d-flex align-items-center justify-content-center text-muted"
                  style={{ 
                    width: "100%", 
                    maxWidth: "400px", 
                    height: "300px",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  <div className="text-center">
                    <i className="bi bi-image fs-1 mb-2 d-block"></i>
                    <p className="mb-0">No hay firma digital registrada</p>
                  </div>
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
                    <label className="form-label text-muted fw-semibold">Fecha de creación:</label>
                    <p className="fs-6 mb-0">
                      {signature.created_at 
                        ? new Date(signature.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted fw-semibold">Última actualización:</label>
                    <p className="fs-6 mb-0">
                      {signature.updated_at 
                        ? new Date(signature.updated_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDigitalSignature;