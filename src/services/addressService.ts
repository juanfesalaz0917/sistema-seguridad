import api from '../interceptors/axiosInterceptor';
import { Address } from '../models/Address';

const API_URL = `${import.meta.env.VITE_API_URL}/addresses`;

class AddressService {
    async getAddresses(): Promise<Address[]> {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAddressById(id: number): Promise<Address | null> {
        try {
            const response = await api.get<Address>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Dirección no encontrada:', error);
            return null;
        }
    }
    async getAddressesByUserId(userId: number): Promise<Address | null> {
        try {
            const response = await api.get<Address>(
                `${API_URL}/user/${userId}`,
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener direcciones por usuario:', error);
            return null;
        }
    }
    async createAddress(
        userId: number,
        address: Address,
    ): Promise<Address | null> {
        try {
            const response = await api.post<Address>(
                `${API_URL}/user/${userId}`,
                address,
            );
            return response.data;
        } catch (error) {
            console.error('Error al crear dirección:', error);
            return null;
        }
    }
    async updateAddress(id: number, address: Address): Promise<Address | null> {
        try {
            const response = await api.put<Address>(
                `${API_URL}/${id}`,
                address,
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar dirección:', error);
            return null;
        }
    }
    async deleteAddress(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar dirección:', error);
            return false;
        }
    }
}

export const addressService = new AddressService();
