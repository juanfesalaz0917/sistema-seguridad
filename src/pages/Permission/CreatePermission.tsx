import React, { useState } from "react";
import { permissionService } from "../../services/permissionService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GenericButton from "../../components/GenericButton";

const ENTITIES = [
  "users",
  "profiles",
  "addresses",
  "digital_signatures",
  "sessions",
  "passwords",
  "devices",
  "security_questions",
  "answers",
  "roles",
  "permissions",
];

const METHODS = ["GET", "POST", "PUT", "DELETE"];

const CreatePermission: React.FC = () => {
  const [entity, setEntity] = useState("");
  const [method, setMethod] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // ✅ Genera dinámicamente las URLs según la entidad elegida
  const getUrlsForEntity = (entityName: string): string[] => {
    if (!entityName) return [];
    return [`/${entityName}`, `/${entityName}/?`];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!entity || !method || !url) {
      Swal.fire("Campos incompletos", "Debes seleccionar entidad, método y URL", "warning");
      return;
    }

    try {
      setSaving(true);
      const newPermission = { entity, method, url };
      await permissionService.create(newPermission);
      Swal.fire("Creado", "El permiso ha sido creado exitosamente", "success");
      navigate("/permissions/list");
    } catch (error) {
      console.error("Error al crear el permiso:", error);
      Swal.fire("Error", "No se pudo crear el permiso", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Crear Permiso</h2>

      {/* 🧩 Seleccionar entidad */}
      <div>
        <label className="block font-medium mb-1">Entidad</label>
        <select
          className="border px-2 py-2 rounded w-full"
          value={entity}
          onChange={(e) => {
            setEntity(e.target.value);
            setUrl(""); // resetear URL al cambiar entidad
          }}
        >
          <option value="">Seleccionar entidad...</option>
          {ENTITIES.map((ent) => (
            <option key={ent} value={ent}>
              {ent}
            </option>
          ))}
        </select>
      </div>

      {/* 🧩 Seleccionar método */}
      <div>
        <label className="block font-medium mb-1">Método</label>
        <select
          className="border px-2 py-2 rounded w-full"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="">Seleccionar método...</option>
          {METHODS.map((met) => (
            <option key={met} value={met}>
              {met}
            </option>
          ))}
        </select>
      </div>

      {/* 🧩 Seleccionar URL — se filtra automáticamente según entidad */}
      <div>
        <label className="block font-medium mb-1">URL</label>
        <select
          className="border px-2 py-2 rounded w-full"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={!entity}
        >
          <option value="">
            {entity ? "Seleccionar URL..." : "Selecciona una entidad primero"}
          </option>
          {getUrlsForEntity(entity).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* 🧩 Botones */}
      <div className="flex justify-between mt-6">
        <GenericButton
          type="button"
          variant="secondary"
          onClick={() => navigate("/permissions/list")}
        >
          Volver
        </GenericButton>

        <GenericButton type="submit" variant="primary" disabled={saving}>
          {saving ? "Guardando..." : "Crear"}
        </GenericButton>
      </div>
    </form>
  );
};

export default CreatePermission;
