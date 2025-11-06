// src/services/profileService.ts
import api from "../interceptors/axiosInterceptor";
import { BaseService } from "./baseService";
import { Profile } from "../models/Profile";

export class ProfileService extends BaseService<Profile> {
  constructor() {
    super("/profiles"); // para getAll, getById, update, delete
  }

  // Obtener perfil por usuario
  async getByUserId(userId: string | number): Promise<Profile> {
    const res = await api.get(`${this.endpoint}/user/${userId}`);
    return res.data;
  }

  // Crear perfil para un usuario
  async createForUser(
    userId: string | number,
    data: Omit<Profile, "id">,
    photo?: File
  ): Promise<Profile> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (photo) formData.append("photo", photo);

    const res = await api.post(`${this.endpoint}/user/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  // Actualizar perfil
  async updateProfile(
    profileId: string | number,
    data: Partial<Profile>,
    photo?: File
  ): Promise<Profile> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value as string);
    });
    if (photo) formData.append("photo", photo);

    const res = await api.put(`${this.endpoint}/${profileId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  // Eliminar perfil
  async deleteProfile(profileId: string | number): Promise<boolean> {
    await api.delete(`${this.endpoint}/${profileId}`);
    return true;
  }
}

export const profileService = new ProfileService();
