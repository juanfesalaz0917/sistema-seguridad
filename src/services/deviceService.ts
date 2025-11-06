import { Device, DeviceInput } from "../models/Device";
import api from "../interceptors/axiosInterceptor";

// Cambiar device_bp por devices para que coincida con el registro del blueprint
const API_URL = `${import.meta.env.VITE_API_URL}/devices`;

class DeviceService {
    /**
     * Obtener todos los dispositivos de un usuario
     * Relación N:1 - Un usuario tiene muchos dispositivos
     */
    async getDevicesByUserId(userId: number): Promise<Device[]> {
        try {
            console.log('Obteniendo dispositivos para usuario:', userId);
            const response = await api.get<Device[]>(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error("Error al obtener dispositivos:", {
                mensaje: error.message,
                estado: error.response?.status,
                datos: error.response?.data
            });
            return [];
        }
    }

    /**
     * Obtener todos los dispositivos (admin)
     */
    async getAllDevices(): Promise<Device[]> {
        try {
            const response = await api.get<Device[]>(`${API_URL}`);
            return response.data;
        } catch (error: any) {
            console.error("Error al obtener dispositivos:", {
                mensaje: error.message,
                estado: error.response?.status
            });
            return [];
        }
    }

    /**
     * Registrar un nuevo dispositivo
     */
    async createDevice(device: DeviceInput): Promise<Device | null> {
        try {
            console.log('Creando dispositivo:', device);
            const response = await api.post<Device>(`${API_URL}/user/${device.user_id}`, device);
            return response.data;
        } catch (error: any) {
            console.error("Error al registrar dispositivo:", {
                mensaje: error.message,
                estado: error.response?.status,
                datos: error.response?.data
            });
            return null;
        }
    }

    /**
     * Actualizar dispositivo
     */
    async updateDevice(id: number, device: Partial<Device>): Promise<Device | null> {
        try {
            const response = await api.put<Device>(`${API_URL}/${id}`, device);
            return response.data;
        } catch (error: any) {
            console.error("Error al actualizar dispositivo:", {
                mensaje: error.message,
                estado: error.response?.status
            });
            return null;
        }
    }

    /**
     * Desactivar dispositivo (no eliminar, solo marcar como inactivo)
     */
    async deactivateDevice(id: number): Promise<boolean> {
        try {
            await api.patch(`${API_URL}/${id}/deactivate`);
            return true;
        } catch (error: any) {
            console.error("Error al desactivar dispositivo:", {
                mensaje: error.message,
                estado: error.response?.status
            });
            return false;
        }
    }

    /**
     * Eliminar dispositivo
     */
    async deleteDevice(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error: any) {
            console.error("Error al eliminar dispositivo:", {
                mensaje: error.message,
                estado: error.response?.status
            });
            return false;
        }
    }

    /**
     * Actualizar última conexión
     */
    async updateLastLogin(id: number): Promise<boolean> {
        try {
            await api.patch(`${API_URL}/${id}/last-login`);
            return true;
        } catch (error: any) {
            console.error("Error al actualizar última conexión:", {
                mensaje: error.message,
                estado: error.response?.status
            });
            return false;
        }
    }
}

export const deviceService = new DeviceService();