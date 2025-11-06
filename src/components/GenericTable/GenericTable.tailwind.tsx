import React from "react";
import type { Action } from "./types";

interface GenericTableProps {
  data: Record<string, any>[];
  columns: string[];
  columnLabels?: Record<string, string>;
  actions?: Action[];
  onAction?: (name: string, item: Record<string, any>) => void;
  renderCell?: (item: Record<string, any>, column: string) => React.ReactNode;
  compact?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

const GenericTable: React.FC<GenericTableProps> = ({
  data,
  columns,
  columnLabels = {},
  actions = [],
  onAction,
  renderCell,
  compact = true,
  striped = false,
  bordered = false,
  hover = true,
  loading = false,
  emptyMessage = "No hay registros disponibles",
}) => {
  
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "number") return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  const getColumnLabel = (col: string): string => {
    return columnLabels[col] || String(col).replace(/_/g, " ").toUpperCase();
  };

  const getButtonVariant = (action: Action): "primary" | "secondary" | "danger" | "success" | "warning" => {
    const actionVariants: Record<string, "primary" | "secondary" | "danger" | "success" | "warning"> = {
      delete: "danger",
      edit: "warning",
      update: "warning",
      view: "secondary",
      create: "success",
    };
    return actionVariants[action.name.toLowerCase()] || "primary";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className={`min-w-full divide-y divide-gray-200 ${bordered ? "border border-gray-300" : ""}`}>
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col} 
                  className={`${compact ? "px-3 py-2" : "px-6 py-3"} text-left text-xs font-semibold text-gray-700 uppercase tracking-wider`}
                >
                  {getColumnLabel(col)}
                </th>
              ))}
              {actions.length > 0 && (
                <th 
                  className={`${compact ? "px-3 py-2" : "px-6 py-3"} text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-48`}
                >
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200`}>
            {loading ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length ? 1 : 0)} 
                  className="px-6 py-12 text-center"
                >
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-700">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-600"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr 
                  key={item.id ?? idx}
                  className={`
                    ${striped && idx % 2 === 1 ? "bg-gray-50" : "bg-white"}
                    ${hover ? "hover:bg-gray-100" : ""}
                    transition-colors duration-150
                  `}
                >
                  {columns.map((col) => (
                    <td 
                      key={col} 
                      className={`${compact ? "px-3 py-2" : "px-6 py-4"} text-sm text-gray-800 truncate max-w-xs`}
                    >
                      {renderCell ? renderCell(item, col) : formatCellValue(item[col])}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className={`${compact ? "px-3 py-2" : "px-6 py-4"} text-right`}>
                      <div className="flex justify-end gap-2">
                        {actions.map((action) => (
                          <button
                            key={action.name}
                            type="button"
                            className={`btn btn-${getButtonVariant(action)} btn-sm`}
                            onClick={() => onAction?.(action.name, item)}
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

export default GenericTable;