import React from "react";
import type { ProfileProps } from "./types";

const GenericProfileBootstrap: React.FC<ProfileProps> = ({ data, onEdit, onLogout }) => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="row w-100 justify-content-center align-items-center">
        {/* Imagen de perfil */}
        <div className="col-md-4 text-center mb-4 mb-md-0">
          <img
            src={data.avatarUrl ?? "/images/default-avatar.png"}
            alt="Avatar"
            className="rounded-circle border border-secondary"
            style={{ width: "250px", height: "250px", objectFit: "cover" }}
          />
        </div>

        {/* Información del usuario */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="display-3 mb-4">{data.name}</h1>
          <p className="fs-4 mb-2"><strong>Email:</strong> {data.email}</p>
          <p className="fs-4 mb-2"><strong>Teléfono:</strong> {data.phone ?? "No disponible"}</p>

          <div className="mt-4 d-flex gap-3 flex-wrap">
            {onEdit && (
              <button className="btn btn-primary btn-lg" onClick={onEdit}>
                Editar Perfil
              </button>
            )}
            {onLogout && (
              <button className="btn btn-danger btn-lg" onClick={onLogout}>
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericProfileBootstrap;
