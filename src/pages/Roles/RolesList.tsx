import { Role } from '../../models/Role';
import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { roleService } from '../../services/roleService';

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
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <h4 className="mb-0">Roles</h4>
                    <button
                        className="btn btn-sm btn-outline-primary ms-3"
                        title="Add Role"
                        onClick={() => navigate('/role/create')}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="card-body p-0">
                {loading ? (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="p-3">
                        <div className="alert alert-danger mb-0">{error}</div>
                    </div>
                ) : (
                    <div className="p-3">
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
                        />{' '}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolesList;
