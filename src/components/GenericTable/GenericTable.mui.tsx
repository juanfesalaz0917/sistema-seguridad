import React from 'react';
import type { GenericTableProps } from './index';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import GenericButton from '../GenericButton';
import { Box } from '@mui/material';

const GenericTableMui: React.FC<GenericTableProps> = ({
    data,
    columns,
    actions,
    onAction,
    renderCell,
}) => {
    // 🔹 Función para truncar texto largo (por defecto 30 caracteres)
    const shortenText = (text: string, maxLength = 30) => {
        if (!text) return '';
        return text.length > maxLength
            ? `${text.slice(0, 15)}...${text.slice(-10)}`
            : text;
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 2,
                boxShadow: 3,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#aaa',
                    borderRadius: 3,
                },
            }}
        >
            <Table
                size="small"
                aria-label="generic table"
                sx={{ minWidth: 650 }}
            >
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col}
                                sx={{
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                {col}
                            </TableCell>
                        ))}
                        {actions && actions.length > 0 && (
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((item, idx) => (
                        <TableRow key={idx} hover>
                            {columns.map((col) => {
                                const cellValue = renderCell
                                    ? renderCell(item, col)
                                    : String(item[col] ?? '');

                                // 🔹 Render con Tooltip y truncamiento si el texto es largo
                                return (
                                    <TableCell
                                        key={col}
                                        sx={{
                                            maxWidth: 220,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {typeof cellValue === 'string' &&
                                        cellValue.length > 30 ? (
                                            <Tooltip title={cellValue} arrow>
                                                <Box component="span">
                                                    {shortenText(cellValue)}
                                                </Box>
                                            </Tooltip>
                                        ) : (
                                            cellValue
                                        )}
                                    </TableCell>
                                );
                            })}

                            {actions && actions.length > 0 && (
                                <TableCell>
                                    {actions.map((action) => (
                                        <GenericButton
                                            key={action.name}
                                            onClick={() =>
                                                onAction?.(action.name, item)
                                            }
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
