// src/services/digitalSignatureService.ts
import axios from "axios";
import { DigitalSignature, DigitalSignatureInput } from "../models/DigitalSignature";
import api from "../interceptors/axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL + "/digital_signature_bp" || "";

class DigitalSignatureService {
    /**
     * Obtener la firma digital de un usuario específico
     * Relación 1:1 - Un usuario tiene una firma
     */
    async getSignatureByUserId(userId: number): Promise<DigitalSignature | null> {
        try {
            const response = await api.get<DigitalSignature>(`/${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener firma digital:", error);
            return null;
        }
    }

    /**
     * Obtener una firma digital por su ID
     */
    async getSignatureById(id: number): Promise<DigitalSignature | null> {
        try {
            const response = await axios.get<DigitalSignature>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Firma digital no encontrada:", error);
            return null;
        }
    }

    /**
     * Crear una nueva firma digital para un usuario
     */
    async createSignature(signature: DigitalSignatureInput): Promise<DigitalSignature | null> {
        try {
            const response = await axios.post<DigitalSignature>(API_URL, signature);
            return response.data;
        } catch (error) {
            console.error("Error al crear firma digital:", error);
            return null;
        }
    }

    /**
     * Actualizar la firma digital de un usuario
     * Usa user_id para encontrar y actualizar
     */
    async updateSignatureByUserId(userId: number, photo: string): Promise<DigitalSignature | null> {
        try {
            const response = await axios.put<DigitalSignature>(
                `${API_URL}/user/${userId}`,
                { photo }
            );
            return response.data;
        } catch (error) {
            console.error("Error al actualizar firma digital:", error);
            return null;
        }
    }

    /**
     * Actualizar firma por ID
     */
    async updateSignature(id: number, signature: Partial<DigitalSignature>): Promise<DigitalSignature | null> {
        try {
            const response = await axios.put<DigitalSignature>(`${API_URL}/${id}`, signature);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar firma digital:", error);
            return null;
        }
    }

    /**
     * Eliminar firma digital
     */
    async deleteSignature(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar firma digital:", error);
            return false;
        }
    }

    /**
     * Subir imagen de firma (si tu backend maneja uploads)
     */
    async uploadSignatureImage(userId: number, file: File): Promise<string | null> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId.toString());

            const response = await axios.post<{ url: string }>(
                `${API_URL}/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.url;
        } catch (error) {
            console.error("Error al subir imagen:", error);
            return null;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const digitalSignatureService = new DigitalSignatureService();