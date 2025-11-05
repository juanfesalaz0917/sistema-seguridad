// src/services/deviceService.ts
import axios from "axios";
import { Device, DeviceInput } from "../models/Device";
import api from "../interceptors/axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL + "/devices" || "";

class DeviceService {
    /**
     * Obtener todos los dispositivos de un usuario
     * Relación N:1 - Un usuario tiene muchos dispositivos
     */
    async getDevicesByUserId(userId: number): Promise<Device[]> {
        try {
            const response = await api.get<Device[]>(`/devices/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener dispositivos:", error);
            return [];
        }
    }

    /**
     * Obtener todos los dispositivos (admin)
     */
    async getAllDevices(): Promise<Device[]> {
        try {
            const response = await api.get<Device[]>("/devices");
            return response.data;
        } catch (error) {
            console.error("Error al obtener dispositivos:", error);
            return [];
        }
    }

    /**
     * Obtener un dispositivo por ID
     */
    async getDeviceById(id: number): Promise<Device | null> {
        try {
            const response = await axios.get<Device>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Dispositivo no encontrado:", error);
            return null;
        }
    }

    /**
     * Registrar un nuevo dispositivo
     */
    async createDevice(device: DeviceInput): Promise<Device | null> {
        try {
            const response = await axios.post<Device>(API_URL, device);
            return response.data;
        } catch (error) {
            console.error("Error al registrar dispositivo:", error);
            return null;
        }
    }

    /**
     * Actualizar dispositivo
     */
    async updateDevice(id: number, device: Partial<Device>): Promise<Device | null> {
        try {
            const response = await axios.put<Device>(`${API_URL}/${id}`, device);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar dispositivo:", error);
            return null;
        }
    }

    /**
     * Desactivar dispositivo (no eliminar, solo marcar como inactivo)
     */
    async deactivateDevice(id: number): Promise<boolean> {
        try {
            await axios.patch(`${API_URL}/${id}/deactivate`);
            return true;
        } catch (error) {
            console.error("Error al desactivar dispositivo:", error);
            return false;
        }
    }

    /**
     * Eliminar dispositivo
     */
    async deleteDevice(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar dispositivo:", error);
            return false;
        }
    }

    /**
     * Actualizar última conexión
     */
    async updateLastLogin(id: number): Promise<boolean> {
        try {
            await axios.patch(`${API_URL}/${id}/last-login`);
            return true;
        } catch (error) {
            console.error("Error al actualizar última conexión:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const deviceService = new DeviceService();