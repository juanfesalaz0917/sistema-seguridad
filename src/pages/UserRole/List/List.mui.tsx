import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userRoleService } from '../../../services/userRoleService';
import type { UserRole } from '../../../models/UserRole';
import Swal from 'sweetalert2';
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
import GenericTable from '../../../components/GenericTable';
import { roleService } from '../../../services/roleService';

const ListUserRoles: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            loadUserRoles(Number.parseInt(userId));
        }
    }, [userId]);

    const loadUserRoles = async (id: number) => {
        try {
            setLoading(true);
            const data = await userRoleService.getUserRolesByUserId(id);
            await Promise.all(
                data.map(async (ur) => {
                    ur.role =
                        (await roleService.getRoleById(ur.role_id!)) ??
                        undefined;
                }),
            );
            setUserRoles(data ?? []);
            setError(null);
        } catch (error) {
            console.error('Error loading user roles:', error);
            setError('Failed to load user roles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userRole: UserRole) => {
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
            const success = await userRoleService.deleteUserRole(userRole.id!);
            if (success) {
                await Swal.fire(
                    'Eliminado',
                    'El rol de usuario ha sido eliminado.',
                    'success',
                );
                if (userId) {
                    loadUserRoles(Number.parseInt(userId));
                }
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo eliminar el rol de usuario.',
                    'error',
                );
            }
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    const handleAction = async (action: string, userRole: UserRole) => {
        if (action === 'delete') {
            await handleDelete(userRole);
        }
    };

    const renderCell = (item: UserRole, column: string) => {
        switch (column) {
            case 'roleName':
                return item.role?.name || 'N/A';
            case 'description':
                return item.role?.description || 'N/A';
            case 'startAt':
                return formatDate(item.startAt);
            case 'endAt':
                return formatDate(item.endAt);
            case 'status':
                const isActive =
                    !item.endAt || new Date(item.endAt) > new Date();
                return (
                    <Chip
                        label={isActive ? 'Activo' : 'Expirado'}
                        color={isActive ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                    />
                );
            default:
                return String(item[column as keyof UserRole] ?? '');
        }
    };

    return (
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
                        Roles de Usuario #{userId}
                    </Typography>
                </Stack>

                <Box>
                    <Tooltip title="Asignar Nuevo Rol">
                        <IconButton
                            color="primary"
                            onClick={() =>
                                navigate(`/user-role/assign/${userId}`)
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
                ) : userRoles.length === 0 ? (
                    <Alert severity="info">
                        No hay roles asignados a este usuario.
                    </Alert>
                ) : (
                    <GenericTable
                        data={userRoles}
                        columns={[
                            'roleName',
                            'description',
                            'startAt',
                            'endAt',
                            'status',
                        ]}
                        actions={[{ name: 'delete', label: 'Eliminar' }]}
                        onAction={handleAction}
                        renderCell={renderCell}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default ListUserRoles;
