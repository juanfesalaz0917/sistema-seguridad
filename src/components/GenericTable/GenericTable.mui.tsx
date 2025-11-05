import React from 'react';
import type { GenericTableProps } from './index';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import GenericButton from '../GenericButton';

const GenericTableMui: React.FC<GenericTableProps> = ({
  data,
  columns,
  actions,
  onAction,
  renderCell, // ✅ agregamos renderCell
}) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="generic table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} style={{ fontWeight: 600 }}>
                {col}
              </TableCell>
            ))}
            {actions && actions.length > 0 && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx} hover>
              {columns.map((col) => (
                <TableCell key={col}>
                  {renderCell ? renderCell(item, col) : String(item[col] ?? '')} 
                  {/* ✅ usamos renderCell si existe */}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell>
                  {actions.map((action) => (
                    <GenericButton
                      key={action.name}
                      onClick={() => onAction?.(action.name, item)}
                    >
                      {action.label}
                    </GenericButton>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTableMui;
