import React from "react";
import type { GenericTableProps } from "./index";

const GenericTableBootstrap: React.FC<GenericTableProps> = ({ data, columns, actions, onAction }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{String(item[col] ?? "")}</td>
              ))}
              <td>
                {actions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => onAction(action.name, item)}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTableBootstrap;
