// src/pages/ViewSession.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getSessionService } from "../../services/sessionService";
import { Session } from "../../models/Session";

const ViewSession: React.FC = () => {
  const { id: userId, sessionId } = useParams<{ id: string; sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const service = getSessionService(userId); // pasamos userId solo por consistencia
    service
      .getById(sessionId)
      .then((res) => setSession(res))
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar la sesión", "error");
      })
      .finally(() => setLoading(false));
  }, [userId, sessionId]);

  if (loading) return <div className="p-3">Cargando...</div>;
  if (!session) return <div className="p-3">Sesión no encontrada</div>;

  return (
    <div className="card p-3">
      <h4>Detalle de Sesión</h4>

      <div className="mb-2">
        <label>ID:</label>
        <input value={session.id} readOnly className="form-control bg-light" />
      </div>

      <div className="mb-2">
        <label>Token:</label>
        <input value={session.token} readOnly className="form-control bg-light" />
      </div>

      <div className="mb-2">
        <label>Expiration:</label>
        <input value={session.expiration} readOnly className="form-control bg-light" />
      </div>

      <div className="mb-2">
        <label>FACode:</label>
        <input value={session.FACode} readOnly className="form-control bg-light" />
      </div>

      <div className="mb-2">
        <label>State:</label>
        <input value={session.state} readOnly className="form-control bg-light" />
      </div>

      <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
};

export default ViewSession;
