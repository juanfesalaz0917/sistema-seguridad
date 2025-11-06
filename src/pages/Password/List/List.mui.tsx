import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { passwordService } from '../../../services/passwordService';
import type { Password } from '../../../models/Password';
import Breadcrumb from '../../../components/Breadcrumb';
import Swal from 'sweetalert2';
import GenericTable from '../../../components/GenericTable';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ListPasswords: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            loadPasswords(Number.parseInt(userId));
        }
    }, [userId]);

    const loadPasswords = async (id: number) => {
        try {
            setLoading(true);
            const data = await passwordService.getPasswordsByUserId(id);
            setPasswords(data ?? []);
            setError(null);
        } catch (error) {
            console.error('Error loading passwords:', error);
            setError('No se pudieron cargar las contraseñas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (password: Password) => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: '¡No podrá revertir esta acción!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const success = await passwordService.deletePassword(password.id);
            if (success) {
                await Swal.fire(
                    'Eliminado',
                    'La contraseña ha sido eliminada.',
                    'success',
                );
                if (userId) {
                    loadPasswords(Number.parseInt(userId));
                }
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo eliminar la contraseña.',
                    'error',
                );
            }
        }
    };

    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    const handleAction = async (action: string, password: Password) => {
        if (action === 'update') {
            navigate(`/user/passwords/update/${password.id}`);
        }
        if (action === 'delete') {
            await handleDelete(password);
        }
    };

    const renderCell = (item: Password, column: string) => {
        switch (column) {
            case 'id':
                return item.id;
            case 'password':
                return (
                    <Typography
                        component="span"
                        sx={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                    >
                        {'•'.repeat(12)}
                    </Typography>
                );
            case 'startAt':
                return formatDate(item.startAt);
            case 'endAt':
                return formatDate(item.endAt);
            case 'status':
                const isActive =
                    !item.endAt || new Date(item.endAt) > new Date();
                return (
                    <Chip
                        label={isActive ? 'Activa' : 'Expirada'}
                        color={isActive ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                    />
                );
            default:
                return String(item[column as keyof Password] ?? '');
        }
    };

    return (
        <>
            <Breadcrumb pageName="Historial de Contraseñas" />
            <Paper elevation={1} sx={{ overflow: 'hidden' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton onClick={() => navigate(-1)} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6">
                            Historial de Contraseñas - Usuario #{userId}
                        </Typography>
                    </Stack>

                    <Box>
                        <Tooltip title="Agregar Nueva Contraseña">
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    navigate(`/user/passwords/create/${userId}`)
                                }
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Box sx={{ p: 2 }}>
                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 6,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : passwords.length === 0 ? (
                        <Alert severity="info">
                            No se encontró historial de contraseñas para este
                            usuario.
                        </Alert>
                    ) : (
                        <GenericTable
                            data={passwords}
                            columns={[
                                'id',
                                'password',
                                'startAt',
                                'endAt',
                                'status',
                            ]}
                            actions={[
                                { name: 'update', label: 'Editar' },
                                { name: 'delete', label: 'Eliminar' },
                            ]}
                            onAction={handleAction}
                            renderCell={renderCell}
                        />
                    )}
                </Box>
            </Paper>
        </>
    );
};

export default ListPasswords;
