import api from '../interceptors/axiosInterceptor';
import { Password } from '../models/Password';

const API_URL = `${import.meta.env.VITE_API_URL}/passwords`;

class PasswordService {
    async getPasswords(): Promise<Password[]> {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getPasswordById(id: number): Promise<Password | null> {
        try {
            const response = await api.get<Password>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener contraseña por ID:', error);
            return null;
        }
    }
    async getPasswordsByUserId(userId: number): Promise<Password[]> {
        try {
            const response = await api.get<Password[]>(
                `${API_URL}/user/${userId}`,
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener contraseñas por usuario:', error);
            return [];
        }
    }
    async createPassword(
        userId: number,
        Password: Password,
    ): Promise<Password | null> {
        try {
            const response = await api.post<Password>(
                `${API_URL}/user/${userId}`,
                Password,
            );
            return response.data;
        } catch (error) {
            console.error('Error al crear contraseña:', error);
            return null;
        }
    }
    async updatePassword(
        id: number,
        Password: Password,
    ): Promise<Password | null> {
        try {
            const response = await api.put<Password>(
                `${API_URL}/${id}`,
                Password,
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            return null;
        }
    }
    async deletePassword(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar contraseña:', error);
            return false;
        }
    }
}

export const passwordService = new PasswordService();
