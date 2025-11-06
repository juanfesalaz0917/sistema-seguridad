import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import GenericButton from '../../components/GenericButton';
import { Permission } from '../../models/Permission';
import { permissionService } from '../../services/permissionService';

const ViewPermission: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [permission, setPermission] = useState<Permission | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            permissionService
                .getById(id)
                .then((data) => {
                    setPermission(data);
                    setLoading(false);
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo cargar el permiso', 'error');
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div className="text-center py-5">Cargando...</div>;
    if (!permission)
        return <div className="text-center py-5">Permiso no encontrado</div>;

    return (
        <div className="card p-4">
            <h4 className="mb-4">Detalle del Permiso</h4>
            <div className="mb-2">
                <strong>ID:</strong> {permission.id}
            </div>
            <div className="mb-2">
                <strong>URL:</strong> {permission.url}
            </div>
            <div className="mb-2">
                <strong>Method:</strong> {permission.method}
            </div>
            <GenericButton
                onClick={() => navigate('/permissions/list')}
                variant="secondary"
                className="mt-3"
            >
                Volver
            </GenericButton>
        </div>
    );
};

export default ViewPermission;
