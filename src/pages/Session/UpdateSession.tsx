// src/pages/UpdateSession.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getSessionService } from "../../services/sessionService";

const UpdateSession: React.FC = () => {
  const { id: userId, sessionId } = useParams<{ id: string; sessionId: string }>();
  const navigate = useNavigate();
  const service = getSessionService(userId);

  const [form, setForm] = useState({
    token: "",
    FACode: "",
    expiration: "",
    state: "",
  });

  useEffect(() => {
    if (!sessionId) return;

    const loadData = async () => {
      try {
        const res = await service.getById(sessionId);

        // Convertimos expiration a formato "YYYY-MM-DDTHH:mm"
        const date = new Date(res.expiration);
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

        setForm({
          token: res.token,
          FACode: res.FACode,
          expiration: formatted,
          state: res.state,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar la sesión", "error");
      }
    };

    loadData();
  }, [sessionId]); // ✅ Removí 'service' de las dependencias

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!sessionId) return;

      // Convertimos de nuevo a formato que espera backend: "YYYY-MM-DD HH:mm:00"
      const expirationBackend = form.expiration ? form.expiration.replace("T", " ") + ":00" : "";

      const payload = {
        expiration: expirationBackend,
        state: form.state,
      };

      await service.update(sessionId, payload);
      Swal.fire("Actualizado", "La sesión se ha actualizado correctamente", "success");
      navigate(`/sessions/user/${userId}`);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar la sesión", "error");
    }
  };

  return (
    <div className="card p-3">
      <h4>Editar Sesión</h4>

      <div className="mb-2">
        <label>Token</label>
        <input value={form.token} readOnly className="form-control bg-light" />
      </div>

      <div className="mb-2">
        <label>FACode</label>
        <input value={form.FACode} readOnly className="form-control bg-light" />
      </div>

      <div className="mb-2">
        <label>Expiration</label>
        <input
          type="datetime-local"
          name="expiration"
          value={form.expiration}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-2">
        <label>State</label>
        <select name="state" value={form.state} onChange={handleChange} className="form-control">
          <option value="">Seleccione estado</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button className="btn btn-primary mt-2" onClick={handleSubmit}>
        Guardar
      </button>
    </div>
  );
};

export default UpdateSession;