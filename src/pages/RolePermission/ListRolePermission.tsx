// src/pages/RolePermission/ListRolesPermission.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GenericTable from '../../components/GenericTable';
import { rolePermissionService } from '../../services/rolePermissionService';

// Tipos
interface PermissionForTable {
    model: string;
    permissions: {
        id: number;
        method: string;
        has_permission: boolean;
        url: string;
    }[];
    view: boolean;
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
}

interface PermissionGroup {
    entity: string;
    permissions: {
        id: number;
        url: string;
        method: string;
        has_permission: boolean;
    }[];
}

const ListRolesPermission: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const [permissions, setPermissions] = useState<PermissionForTable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [updatingPermissions, setUpdatingPermissions] = useState<Set<number>>(
        new Set(),
    );

    useEffect(() => {
        if (!roleId) return;

        const fetchPermissions = async () => {
            try {
                setLoading(true);
                console.log('🔄 Fetching permissions for role:', roleId);
                const res: PermissionGroup[] =
                    await rolePermissionService.getByRoleId(Number(roleId));
                console.log('📥 Datos recibidos del backend:', res);

                const formatted: PermissionForTable[] = res.map((group) => {
                    const row: PermissionForTable = {
                        model: group.entity,
                        permissions: group.permissions.map((p) => ({
                            id: p.id,
                            method: p.method.toUpperCase(),
                            has_permission: p.has_permission,
                            url: p.url,
                        })),
                        view: false,
                        list: false,
                        create: false,
                        update: false,
                        delete: false,
                    };

                    // Determinar los permisos basados en los métodos y URLs
                    group.permissions.forEach((p) => {
                        const has = Boolean(p.has_permission);
                        const method = p.method.toUpperCase();

                        if (method === 'GET') {
                            // Diferenciar entre list (colección) y view (individual)
                            if (p.url.includes('/?')) {
                                // URL con parámetro -> view (elemento individual)
                                row.view = row.view || has;
                            } else {
                                // URL básica -> list (colección)
                                row.list = row.list || has;
                            }
                        } else if (method === 'POST') {
                            row.create = row.create || has;
                        } else if (method === 'PUT' || method === 'PATCH') {
                            row.update = row.update || has;
                        } else if (method === 'DELETE') {
                            row.delete = row.delete || has;
                        }
                    });

                    return row;
                });

                console.log('📊 Datos formateados para tabla:', formatted);
                setPermissions(formatted);
            } catch (err) {
                console.error('Error fetching permissions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [roleId]);

    const handleCheckboxChange = async (
        item: PermissionForTable,
        field: keyof PermissionForTable,
    ) => {
        if (loading) return;

        const newValue = !item[field];

        // Determinar qué permisos individuales actualizar basado en el campo
        let permissionsToUpdate: number[] = [];

        switch (field) {
            case 'view':
                permissionsToUpdate = item.permissions
                    .filter((p) => p.method === 'GET' && p.url.includes('/?'))
                    .map((p) => p.id);
                break;
            case 'list':
                permissionsToUpdate = item.permissions
                    .filter((p) => p.method === 'GET' && !p.url.includes('/?'))
                    .map((p) => p.id);
                break;
            case 'create':
                permissionsToUpdate = item.permissions
                    .filter((p) => p.method === 'POST')
                    .map((p) => p.id);
                break;
            case 'update':
                permissionsToUpdate = item.permissions
                    .filter((p) => p.method === 'PUT' || p.method === 'PATCH')
                    .map((p) => p.id);
                break;
            case 'delete':
                permissionsToUpdate = item.permissions
                    .filter((p) => p.method === 'DELETE')
                    .map((p) => p.id);
                break;
            default:
                return;
        }

        console.log(
            `🔄 Permisos a actualizar para ${field}:`,
            permissionsToUpdate,
        );

        if (permissionsToUpdate.length === 0) {
            console.warn(
                `No se encontraron permisos para actualizar: ${field}`,
            );
            return;
        }

        // Actualizar estado local inmediatamente para mejor UX
        setPermissions((prev) =>
            prev.map((p) => {
                if (p.model === item.model) {
                    const updatedPermissions = p.permissions.map((perm) =>
                        permissionsToUpdate.includes(perm.id)
                            ? { ...perm, has_permission: newValue }
                            : perm,
                    );

                    return {
                        ...p,
                        [field]: newValue,
                        permissions: updatedPermissions,
                    };
                }
                return p;
            }),
        );

        // Marcar permisos como actualizando
        setUpdatingPermissions((prev) => {
            const newSet = new Set(prev);
            permissionsToUpdate.forEach((id) => newSet.add(id));
            return newSet;
        });

        try {
            // Actualizar cada permiso individualmente en el backend.
            // El backend expone endpoints para crear o eliminar la relación rol-permiso,
            // en lugar de un PUT genérico. Si activamos (newValue === true) creamos
            // la relación; si desactivamos, la eliminamos.
            const updatePromises = permissionsToUpdate.map((permissionId) =>
                newValue
                    ? rolePermissionService.createRolePermission(
                          Number(roleId),
                          permissionId,
                          {},
                      )
                    : rolePermissionService.deleteRolePermission(
                          Number(roleId),
                          permissionId,
                      ),
            );

            await Promise.all(updatePromises);
            console.log(
                `✅ Todos los permisos actualizados (create/delete) para ${field}`,
            );
        } catch (err) {
            console.error('Error updating permissions:', err);
            // Revertir cambios en caso de error
            setPermissions((prev) =>
                prev.map((p) => {
                    if (p.model === item.model) {
                        const revertedPermissions = p.permissions.map((perm) =>
                            permissionsToUpdate.includes(perm.id)
                                ? { ...perm, has_permission: !newValue }
                                : perm,
                        );

                        return {
                            ...p,
                            [field]: !newValue,
                            permissions: revertedPermissions,
                        };
                    }
                    return p;
                }),
            );
        } finally {
            // Quitar permisos de la lista de actualización
            setUpdatingPermissions((prev) => {
                const newSet = new Set(prev);
                permissionsToUpdate.forEach((id) => newSet.delete(id));
                return newSet;
            });
        }
    };

    const columns = ['model', 'view', 'list', 'create', 'update', 'delete'];

    const renderCell = (item: PermissionForTable, column: string) => {
        if (column === 'model') {
            return <strong>{item.model}</strong>;
        }

        // Verificar si algún permiso de esta fila está actualizando
        const isUpdating = item.permissions.some((p) =>
            updatingPermissions.has(p.id),
        );

        return (
            <input
                type="checkbox"
                checked={!!item[column as keyof PermissionForTable]}
                onChange={() =>
                    handleCheckboxChange(
                        item,
                        column as keyof PermissionForTable,
                    )
                }
                disabled={loading || isUpdating}
            />
        );
    };

    if (loading && permissions.length === 0) {
        return <div>Cargando permisos...</div>;
    }

    if (permissions.length === 0 && !loading) {
        return <div>No se encontraron permisos para este rol.</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Assign Permissions to Role {roleId}</h2>
            {loading && (
                <div
                    style={{
                        padding: '10px',
                        background: '#f0f0f0',
                        marginBottom: '10px',
                    }}
                >
                    Cargando permisos...
                </div>
            )}
            <GenericTable
                data={permissions}
                columns={columns}
                renderCell={renderCell}
                actions={[]}
                onAction={() => {}}
            />
        </div>
    );
};

export default ListRolesPermission;
