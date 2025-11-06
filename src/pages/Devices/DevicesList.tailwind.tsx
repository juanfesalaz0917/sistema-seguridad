// src/pages/Devices/DevicesList.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import { userService } from '../../services/userService';
import { Device } from '../../models/Device';
import { User } from '../../models/User';
import Swal from 'sweetalert2';

const DevicesList: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [devices, setDevices] = useState<Device[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        ip: '',
        operating_system: '',
        is_active: true,
    });

    useEffect(() => {
        if (userId) {
            fetchData(parseInt(userId));
        }
    }, [userId]);

    const fetchData = async (id: number) => {
        try {
            setLoading(true);

            const userData = await userService.getUserById(id);
            if (!userData) {
                setError('Usuario no encontrado');
                setLoading(false);
                return;
            }
            setUser(userData);

            const devicesData = await deviceService.getDevicesByUserId(id);
            setDevices(devicesData);

            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar la información');
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/user/list');
    };

    const handleOpenModal = (device?: Device) => {
        if (device) {
            // Editar
            setEditingDevice(device);
            setFormData({
                name: device.name,
                ip: device.ip,
                operating_system: device.operating_system,
                is_active: device.is_active,
            });
        } else {
            // Crear nuevo
            setEditingDevice(null);
            setFormData({
                name: '',
                ip: '',
                operating_system: '',
                is_active: true,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDevice(null);
        setFormData({
            name: '',
            ip: '',
            operating_system: '',
            is_active: true,
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!formData.name || !formData.ip || !formData.operating_system) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return;
        }

        try {
            let success;
            if (editingDevice) {
                // Actualizar
                success = await deviceService.updateDevice(
                    editingDevice.id!,
                    formData,
                );
                if (success) {
                    await Swal.fire(
                        'Actualizado',
                        'Dispositivo actualizado correctamente',
                        'success',
                    );
                }
            } else {
                // Crear
                success = await deviceService.createDevice({
                    user_id: parseInt(userId!),
                    ...formData,
                });
                if (success) {
                    await Swal.fire(
                        'Creado',
                        'Dispositivo registrado correctamente',
                        'success',
                    );
                }
            }

            if (success) {
                handleCloseModal();
                fetchData(parseInt(userId!));
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo guardar el dispositivo',
                    'error',
                );
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
        }
    };

    const handleDelete = async (device: Device) => {
        const result = await Swal.fire({
            title: 'Eliminar dispositivo',
            text: `¿Estás seguro de eliminar "${device.name}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const success = await deviceService.deleteDevice(device.id!);
            if (success) {
                await Swal.fire(
                    'Eliminado',
                    'El dispositivo ha sido eliminado',
                    'success',
                );
                fetchData(parseInt(userId!));
            } else {
                Swal.fire(
                    'Error',
                    'No se pudo eliminar el dispositivo',
                    'error',
                );
            }
        }
    };

    const handleToggleActive = async (device: Device) => {
        const action = device.is_active ? 'desactivar' : 'activar';
        const result = await Swal.fire({
            title: `${
                action.charAt(0).toUpperCase() + action.slice(1)
            } dispositivo`,
            text: `¿Estás seguro de ${action} "${device.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const success = await deviceService.updateDevice(device.id!, {
                is_active: !device.is_active,
            });
            if (success) {
                await Swal.fire(
                    action.charAt(0).toUpperCase() + action.slice(1),
                    `El dispositivo ha sido ${action}do`,
                    'success',
                );
                fetchData(parseInt(userId!));
            } else {
                Swal.fire(
                    'Error',
                    `No se pudo ${action} el dispositivo`,
                    'error',
                );
            }
        }
    };

    const getDeviceIcon = (os: string): string => {
        const osLower = os.toLowerCase();
        if (osLower.includes('windows')) return 'bi-windows';
        if (osLower.includes('mac') || osLower.includes('ios'))
            return 'bi-apple';
        if (osLower.includes('android')) return 'bi-android2';
        if (osLower.includes('linux')) return 'bi-ubuntu';
        return 'bi-laptop';
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i
                    className="bi bi-circle-fill mr-1"
                    style={{ fontSize: '0.5rem' }}
                ></i>
                Activo
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <i
                    className="bi bi-circle-fill mr-1"
                    style={{ fontSize: '0.5rem' }}
                ></i>
                Inactivo
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Dispositivos Registrados
                    </h2>
                    <p className="text-gray-600">
                        Usuario: <strong>{user?.name}</strong> ({user?.email})
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                        onClick={() => handleOpenModal()}
                    >
                        <i className="bi bi-plus-lg mr-2"></i>
                        Nuevo Dispositivo
                    </button>
                    <button
                        className="bg-gray-600 hover:bg-gray-700 text-black px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                        onClick={handleBack}
                    >
                        <i className="bi bi-arrow-left mr-2"></i>
                        Volver
                    </button>
                </div>
            </div>

            {/* Cards de dispositivos */}
            {devices.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="text-center py-12">
                        <i className="bi bi-laptop text-4xl text-gray-400 mb-4 block"></i>
                        <h5 className="text-gray-500 text-lg font-medium mb-2">
                            No hay dispositivos registrados
                        </h5>
                        <p className="text-gray-400 mb-4">
                            Este usuario aún no tiene dispositivos registrados.
                        </p>
                        <button
                            type="button"
                            onClick={() => handleOpenModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-black border border-white/50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto transition-colors shadow-sm hover:shadow-md"
                        >
                            <i className="bi bi-plus-lg text-black"></i>
                            Registrar Primer Dispositivo
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map((device) => (
                        <div
                            key={device.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <i
                                                className={`${getDeviceIcon(
                                                    device.operating_system,
                                                )} text-xl ${
                                                    device.is_active
                                                        ? 'text-blue-600'
                                                        : 'text-gray-500'
                                                }`}
                                            ></i>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {device.name}
                                            </h3>
                                            {getStatusBadge(device.is_active)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <i className="bi bi-gear text-gray-400"></i>
                                        <span className="text-sm text-gray-500">
                                            Sistema Operativo:
                                        </span>
                                    </div>
                                    <p className="text-gray-900 ml-6">
                                        {device.operating_system}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <i className="bi bi-router text-gray-400"></i>
                                        <span className="text-sm text-gray-500">
                                            Dirección IP:
                                        </span>
                                    </div>
                                    <p className="text-gray-900 font-mono ml-6">
                                        {device.ip}
                                    </p>

                                    {device.last_login && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <i className="bi bi-clock-history text-gray-400"></i>
                                                <span className="text-sm text-gray-500">
                                                    Último acceso:
                                                </span>
                                            </div>
                                            <p className="text-gray-900 ml-6">
                                                {new Date(
                                                    device.last_login,
                                                ).toLocaleString()}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm flex items-center justify-center transition-colors"
                                        onClick={() => handleOpenModal(device)}
                                    >
                                        <i className="bi bi-pencil mr-1"></i>
                                        Editar
                                    </button>
                                    <button
                                        className={`flex-1 border px-3 py-2 rounded-lg text-sm flex items-center justify-center transition-colors ${
                                            device.is_active
                                                ? 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                                                : 'border-green-500 text-green-600 hover:bg-green-50'
                                        }`}
                                        onClick={() =>
                                            handleToggleActive(device)
                                        }
                                    >
                                        <i
                                            className={`bi ${
                                                device.is_active
                                                    ? 'bi-pause-circle'
                                                    : 'bi-play-circle'
                                            } mr-1`}
                                        ></i>
                                        {device.is_active
                                            ? 'Desactivar'
                                            : 'Activar'}
                                    </button>
                                    <button
                                        className="bg-white border border-red-600 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                                        onClick={() => handleDelete(device)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>

                            {device.created_at && (
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 rounded-b-lg">
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <i className="bi bi-calendar3 mr-1"></i>
                                        Registrado:{' '}
                                        {new Date(
                                            device.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Información adicional */}
            {devices.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-center">
                        <i className="bi bi-info-circle text-blue-500 mr-2"></i>
                        <span className="text-blue-800">
                            <strong>Total:</strong> {devices.length} |{' '}
                            <strong>Activos:</strong>{' '}
                            {devices.filter((d) => d.is_active).length} |{' '}
                            <strong>Inactivos:</strong>{' '}
                            {devices.filter((d) => !d.is_active).length}
                        </span>
                    </div>
                </div>
            )}

            {/* Modal de Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingDevice
                                    ? 'Editar Dispositivo'
                                    : 'Nuevo Dispositivo'}
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={handleCloseModal}
                            >
                                <i className="bi bi-x-lg text-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Dispositivo{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Ej: iPhone 13 Pro"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección IP{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleInputChange}
                                        placeholder="192.168.1.100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sistema Operativo{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        name="operating_system"
                                        value={formData.operating_system}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Windows 11">
                                            Windows 11
                                        </option>
                                        <option value="Windows 10">
                                            Windows 10
                                        </option>
                                        <option value="macOS Sonoma">
                                            macOS Sonoma
                                        </option>
                                        <option value="macOS Ventura">
                                            macOS Ventura
                                        </option>
                                        <option value="iOS 17">iOS 17</option>
                                        <option value="iOS 16">iOS 16</option>
                                        <option value="Android 14">
                                            Android 14
                                        </option>
                                        <option value="Android 13">
                                            Android 13
                                        </option>
                                        <option value="Ubuntu 22.04">
                                            Ubuntu 22.04
                                        </option>
                                        <option value="Ubuntu 20.04">
                                            Ubuntu 20.04
                                        </option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        type="checkbox"
                                        name="is_active"
                                        id="isActive"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        className="ml-2 block text-sm text-gray-700"
                                        htmlFor="isActive"
                                    >
                                        Dispositivo activo
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                                >
                                    <i className="bi bi-check-lg mr-2"></i>
                                    {editingDevice ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevicesList;
