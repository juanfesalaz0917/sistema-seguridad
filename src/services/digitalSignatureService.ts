// src/services/digitalSignatureService.ts
import api from "../interceptors/axiosInterceptor";
import { DigitalSignature } from "../models/DigitalSignature";

const API_URL = import.meta.env.VITE_API_URL || "";
const SIGNATURE_ENDPOINT = "/digital-signatures";

class DigitalSignatureService {
    /**
     * Obtener todas las firmas digitales (admin)
     */
    async getAllSignatures(): Promise<DigitalSignature[]> {
        try {
            const response = await api.get<DigitalSignature[]>(`${SIGNATURE_ENDPOINT}/`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener firmas digitales:", error);
            return [];
        }
    }

    /**
     * Obtener la firma digital de un usuario específico
     * Relación 1:1 - Un usuario tiene una firma
     */
    async getSignatureByUserId(userId: number): Promise<DigitalSignature | null> {
        try {
            const response = await api.get<DigitalSignature>(`${SIGNATURE_ENDPOINT}/user/${userId}`);
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
            const response = await api.get<DigitalSignature>(`${SIGNATURE_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Firma digital no encontrada:", error);
            return null;
        }
    }

    /**
     * Crear una nueva firma digital para un usuario
     * Backend espera FormData con 'photo' file
     */
    async createSignature(userId: number, photoFile: File): Promise<DigitalSignature | null> {
        try {
            const formData = new FormData();
            formData.append("photo", photoFile);

            const response = await api.post<DigitalSignature>(
                `${SIGNATURE_ENDPOINT}/user/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error al crear firma digital:", error);
            return null;
        }
    }

    /**
     * Actualizar firma digital por ID
     * Backend espera FormData con 'photo' file
     */
    async updateSignature(id: number, photoFile: File): Promise<DigitalSignature | null> {
        try {
            const formData = new FormData();
            formData.append("photo", photoFile);

            const response = await api.put<DigitalSignature>(
                `${SIGNATURE_ENDPOINT}/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
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
            await api.delete(`${SIGNATURE_ENDPOINT}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar firma digital:", error);
            return false;
        }
    }

    /**
     * Construir URL de imagen desde el backend Flask
     */
    getImageUrl(filename: string): string {
        if (!filename) return "";

        // If filename is already a data URL or blob URL, return it directly
        if (filename.startsWith("data:") || filename.startsWith("blob:")) {
            return filename;
        }

        // Si ya es una URL completa, devolverla
        if (filename.startsWith("http")) {
            return filename;
        }

        // Normalize base and filename to avoid duplicated segments like
        // http://host/api/digital-signatures/digital-signatures/xxxx
        const base = API_URL.replace(/\/+$/, ''); // remove trailing slashes
        const normalized = filename.replace(/^\/+/, ''); // remove leading slashes
        const endpointNoSlash = SIGNATURE_ENDPOINT.replace(/^\/+/, '');

        // If filename already contains the endpoint segment (with or without leading slash),
        // return base + '/' + normalized so we don't duplicate the endpoint.
        if (normalized.startsWith(endpointNoSlash) || normalized.includes(`${endpointNoSlash}/`)) {
            return `${base}/${normalized}`;
        }

        // If filename looked like a server absolute path (starting with slash originally),
        // normalized removed the slash above so treat it as not containing endpoint and
        // construct by joining base + endpoint + normalized
        return `${base}${SIGNATURE_ENDPOINT}/${normalized}`;
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const digitalSignatureService = new DigitalSignatureService();