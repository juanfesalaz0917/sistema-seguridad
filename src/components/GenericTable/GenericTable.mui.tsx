import React from "react";
import type { GenericTableProps } from "./index";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const GenericTableMui: React.FC<GenericTableProps> = ({ data, columns, actions, onAction }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="generic table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} style={{ fontWeight: 600 }}>{col}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx} hover>
              {columns.map((col) => (
                <TableCell key={col}>{String(item[col] ?? "")}</TableCell>
              ))}
              <TableCell>
                {actions.map((action) => (
                  <Button
                    key={action.name}
                    size="small"
                    variant="outlined"
                    onClick={() => onAction(action.name, item)}
                    style={{ marginRight: 8 }}
                  >
                    {action.label}
                  </Button>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTableMui;
