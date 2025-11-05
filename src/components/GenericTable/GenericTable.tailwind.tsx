import React from "react";

interface Action {
  name: string;
  label: string;
}

interface GenericTableProps {
  data: Record<string, any>[];
  columns: string[];
  actions: Action[];
  onAction: (name: string, item: Record<string, any>) => void;
  renderCell?: (item: Record<string, any>, column: string) => React.ReactNode; // ✅ agregar aquí
}

const GenericTable: React.FC<GenericTableProps> = ({ data, columns, actions, onAction, renderCell }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>
                {renderCell ? renderCell(item, col) : item[col]} {/* ✅ usar renderCell si existe */}
              </td>
            ))}
            <td>
              {actions.map((action) => (
                <button key={action.name} onClick={() => onAction(action.name, item)}>
                  {action.label}
                </button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GenericTable;
