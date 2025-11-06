// src/pages/ListUsers.tsx
import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import type { Action } from '../../components/GenericTable/types';
import { User } from '../../models/User';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ListUsers: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const usersResp = await userService.getUsers();
            setUsers(usersResp ?? []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('No se pudieron cargar los usuarios.');
            setLoading(false);
        }
    };

    const handleAction = async (action: string, item: User) => {
        switch (action) {
            case 'view':
                navigate(`/user/view/${item.id}`);
                break;
            case 'viewRoles':
                navigate(`/user-role/${item.id}`);
                break;
            case 'edit':
                navigate(`/user/update/${item.id}`);
                break;
            case 'delete':
                await deleteUser(item);
                break;
            case 'profile':
                navigate(`/profiles/${item.id}`);
                break;
            case 'address':
                navigate(`/user/address/${item.id}`);
                break;
            case 'digital-signature':
                navigate(`/user/digital-signature/${item.id}`);
                break;
            case 'devices':
                navigate(`/user/devices/${item.id}`);
                break;
            case 'passwords':
                navigate(`/user/passwords/${item.id}`);
                break;
            case 'security-questions':
                navigate(`/user/security-questions/${item.id}`);
                break;
            case 'sessions':
                navigate(`/user/sessions/${item.id}`);
                break;
            default:
                console.log(action, item);
        }
    };

    const deleteUser = async (item: User) => {
        const result = await Swal.fire({
            title: 'Eliminación',
            text: '¿Está seguro de querer eliminar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            const success = await userService.deleteUser(item.id!);
            if (success) {
                await Swal.fire(
                    'Eliminado',
                    'El registro se ha eliminado',
                    'success',
                );
                fetchData();
            } else {
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    };

    const columns = ['id', 'name', 'email'];

    const actions: Action[] = [
        { name: 'view', label: 'Ver' },
        { name: 'viewRoles', label: 'Ver Roles' },
        { name: 'edit', label: 'Editar' },
        { name: 'delete', label: 'Eliminar' },
        { name: 'profile', label: 'Perfil' },
        { name: 'address', label: 'Dirección' },
        { name: 'digital-signature', label: 'Firma Digital' },
        { name: 'devices', label: 'Dispositivos' },
        { name: 'passwords', label: 'Contraseñas' },
        { name: 'security-questions', label: 'Seguridad' },
        { name: 'sessions', label: 'Sesiones' },
    ];

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <h4 className="mb-0">Usuarios</h4>
                    <button
                        className="btn btn-sm btn-outline-primary ms-3"
                        title="Agregar usuario"
                        onClick={() => navigate('/user/create')}
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
                            data={users}
                            columns={columns}
                            actions={actions}
                            onAction={handleAction}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListUsers;
