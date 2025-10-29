import axios from 'axios';
import { UserRole } from '../models/UserRole';
import api from '../interceptors/axiosInterceptor';

const API_URL = `${import.meta.env.VITE_API_URL}/user-roles`;

class UserRoleService {
    async getUserRoles(): Promise<UserRole[]> {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUserRoleById(id: string): Promise<UserRole | null> {
        try {
            const response = await axios.get<UserRole>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('UserRole no encontrado:', error);
            return null;
        }
    }
    async getUserRolesByRoleId(roleId: number): Promise<UserRole[]> {
        try {
            const response = await axios.get<UserRole[]>(
                `${API_URL}/role/${roleId}`,
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener roles por ID de rol:', error);
            return [];
        }
    }
    async getUserRolesByUserId(userId: number): Promise<UserRole[]> {
        try {
            const response = await axios.get<UserRole[]>(
                `${API_URL}/user/${userId}`,
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener roles por ID de usuario:', error);
            return [];
        }
    }
    async createUserRole(
        userId: number,
        roleId: number,
        UserRole: UserRole,
    ): Promise<UserRole | null> {
        try {
            const response = await api.post<UserRole>(
                `${API_URL}/user/${userId}/role/${roleId}`,
                UserRole,
            );
            return response.data;
        } catch (error) {
            console.error('Error al crear UserRole:', error);
            return null;
        }
    }
    async updateUserRole(
        id: string,
        UserRole: UserRole,
    ): Promise<UserRole | null> {
        try {
            const response = await api.put<UserRole>(
                `${API_URL}/${id}`,
                UserRole,
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar UserRole:', error);
            return null;
        }
    }
    async deleteUserRole(id: string): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar UserRole:', error);
            return false;
        }
    }
}

export const userRoleService = new UserRoleService();
