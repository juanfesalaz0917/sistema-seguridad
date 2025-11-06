import React, { useEffect, useState } from 'react';
import { Role } from '../../../models/Role';
import GenericTable from '../../../components/GenericTable';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { roleService } from '../../../services/roleService';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const RolesList: React.FC = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const roleResp = await roleService.getRoles();
            setRoles(roleResp ?? []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching roles:', err);
            setError('No se pudieron cargar los roles.');
            setLoading(false);
        }
    };

    const deleteRole = async (item: Role) => {
        const result = await Swal.fire({
            title: 'Eliminación',
            text: '¿Está seguro de querer eliminar el rol?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            const success = await roleService.deleteRole(item.id!);
            if (success) {
                await Swal.fire(
                    'Eliminado',
                    'El rol se ha eliminado',
                    'success',
                );
                fetchData();
            } else {
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    };

    const handleAction = async (action: string, role: Role) => {
        if (action === 'viewUsers') {
            navigate(`/user-role/list/${role.id}`);
        }
        if (action === 'assignPermissions') {
            navigate(`/role-permissions/list/${role.id}`);
        }
        if (action === 'update') {
            navigate(`/role/update/${role.id}`);
        }
        if (action === 'delete') {
            await deleteRole(role);
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
                    <Typography variant="h6">Roles</Typography>
                </Stack>

                <Box>
                    <Tooltip title="Add Role">
                        <IconButton
                            color="primary"
                            onClick={() => navigate('/role/create')}
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
                ) : (
                    <GenericTable
                        data={roles}
                        columns={['id', 'name', 'description']}
                        actions={[
                            { name: 'update', label: 'Update' },
                            { name: 'delete', label: 'Delete' },
                            {
                                name: 'assignPermissions',
                                label: 'Assign Permissions',
                            },
                        ]}
                        onAction={handleAction}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default RolesList;
