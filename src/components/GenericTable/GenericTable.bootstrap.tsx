// src/components/GenericTable/GenericTable.bootstrap.tsx
import React from "react";
import type { Action } from "./types";

interface GenericTableProps {
  data: Record<string, any>[];
  columns: string[];
  columnLabels?: Record<string, string>;
  actions: Action[];
  onAction: (name: string, item: Record<string, any>) => void;
  compact?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

const GenericTableBootstrap: React.FC<GenericTableProps> = ({
  data,
  columns,
  columnLabels = {},
  actions,
  onAction,
  compact = true,
  striped = false,
  bordered = false,
  hover = true,
  loading = false,
  emptyMessage = "No hay registros disponibles",
}) => {
  
  // Función para formatear valores de celdas
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "number") return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  // Obtener la etiqueta de la columna
  const getColumnLabel = (col: string): string => {
    return columnLabels[col] || String(col).replace(/_/g, " ").toUpperCase();
  };

  // Determinar la variante del botón (usando Bootstrap classes)
  const getButtonClass = (action: Action): string => {
    // Mapeo de acciones específicas a variantes Bootstrap
    const actionVariants: Record<string, string> = {
      delete: "btn-outline-danger",
      edit: "btn-outline-warning",
      update: "btn-outline-warning",
      view: "btn-outline-info",
      create: "btn-outline-success",
    };

    return actionVariants[action.name.toLowerCase()] || "btn-outline-primary";
  };

  return (
    <div className="bootstrap-table-wrapper">
      <div className="table-responsive">
        <table 
          className={`
            table 
            ${compact ? "table-sm" : ""} 
            ${striped ? "table-striped" : ""} 
            ${bordered ? "table-bordered" : ""} 
            ${hover ? "table-hover" : ""} 
            align-middle 
            mb-0
          `.trim().replace(/\s+/g, ' ')}
        >
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-muted fw-semibold">
                  {getColumnLabel(col)}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-end text-muted fw-semibold" style={{ width: "200px" }}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="text-center py-5"
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="text-center py-5 text-muted"
                >
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.id ?? idx}>
                  {columns.map((col) => (
                    <td key={col} className="text-truncate" style={{ maxWidth: "250px" }}>
                      {formatCellValue(item[col])}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="text-end">
                      <div className="btn-group btn-group-sm" role="group">
                        {actions.map((action) => (
                          <button
                            key={action.name}
                            type="button"
                            className={`btn ${getButtonClass(action)}`}
                            onClick={() => onAction(action.name, item)}
                            title={action.label}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTableBootstrap;