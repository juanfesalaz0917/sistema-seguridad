import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";
import Swal from "sweetalert2";
import GenericButton from "../../components/GenericButton";

const UpdatePermission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      permissionService
        .getById(id)
        .then((data) => {
          setPermission(data);
          setLoading(false);
        })
        .catch(() => {
          Swal.fire("Error", "No se pudo cargar el permiso", "error");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!permission) return;
    setPermission({ ...permission, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permission) return;

    try {
      setSaving(true);
      await permissionService.update(permission.id!, permission);
      Swal.fire("Actualizado", "El permiso ha sido actualizado correctamente", "success");
      navigate("/permissions/list");
    } catch {
      Swal.fire("Error", "No se pudo actualizar el permiso", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando...</div>;
  if (!permission) return <div className="text-center py-5">Permiso no encontrado</div>;

  return (
    <div className="card p-4">
      <h4 className="mb-4">Actualizar Permiso</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">URL</label>
          <input
            type="text"
            name="url"
            className="form-control"
            value={permission.url}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Method</label>
          <input
            type="text"
            name="method"
            className="form-control"
            value={permission.method}
            onChange={handleChange}
          />
        </div>

        {/* 🔹 Botones dinámicos */}
        <div className="flex justify-end gap-2 mt-4">
          <GenericButton
            variant="secondary"
            type="button"
            onClick={() => navigate(-1)}
          >
            Volver
          </GenericButton>

          <GenericButton
            variant="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Actualizar"}
          </GenericButton>
        </div>
      </form>
    </div>
  );
};

export default UpdatePermission;
