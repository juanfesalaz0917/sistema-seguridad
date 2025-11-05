import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import GenericTable from "./GenericTable/index"; // wrapper dinámico
import type { Action } from "./GenericTable/types";
import GenericButton from "./GenericButton/index";

interface CrudPageProps<T extends { id?: string }> {
  title: string;
  service: {
    getAll: () => Promise<T[]>;
    delete: (id: string) => Promise<boolean>;
  };
  columns: (keyof T)[];
  routeBase: string;
}

function CrudPage<T extends { id?: string }>({ title, service, columns, routeBase }: CrudPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      setData(response ?? []);
    } catch (err) {
      console.error(`Error al obtener ${title}:`, err);
      setError(`No se pudieron cargar los ${title}.`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (item: T) => {
    if (!item.id) {
      Swal.fire("Error", "Este registro no tiene ID y no se puede eliminar.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Eliminar",
      text: "¿Está seguro que desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await service.delete(item.id);
      if (success) {
        Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
        fetchData();
      } else {
        Swal.fire("Error", "No se pudo eliminar el registro.", "error");
      }
    }
  };

  const handleAction = (action: string, item: T) => {
    const id = item.id;
    if (!id) {
        Swal.fire("Error", "Este registro no tiene un ID válido.", "error");
        return;
    }
    switch (action) {
      case "view":
        navigate(`${routeBase}/view/${id}`);
        break;
      case "edit":
        navigate(`${routeBase}/update/${id}`);
        break;
      case "delete":
        deleteItem(item);
        break;
      default:
        console.log("Acción no reconocida:", action);
    }
  };

  const actions: Action[] = [
    { name: "view", label: "Ver" },
    { name: "edit", label: "Editar" },
    { name: "delete", label: "Eliminar" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h4>{title}</h4>
          <button className="btn btn-primary" onClick={() => navigate(`${routeBase}/create`)}>
            +
          </button>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center py-5">Cargando...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <GenericTable
            data={data as Record<string, any>[]} // hacemos cast para el wrapper
            columns={columns.map(String)}
            actions={actions}
            onAction={(action, item) => handleAction(action as string, item as T)}
          />
        )}
      </div>
    </div>
  );
}

export default CrudPage;
