// src/services/rolePermissionService.ts
import axios, { AxiosResponse } from "axios";
import { RolePermission } from "../models/RolePermission";

const API_URL = import.meta.env.VITE_API_URL;

export interface PermissionGroup {
  entity: string;
  permissions: {
    id: number;
    url: string;
    method: string;
    has_permission: boolean;
  }[];
}

class RolePermissionService {
  // Obtener permisos agrupados por entidad para un rol
  async getByRoleId(roleId: number): Promise<PermissionGroup[]> {
    const res: AxiosResponse<PermissionGroup[]> = await axios.get(`${API_URL}/permissions/grouped/role/${roleId}`);
    return res.data;
  }

  // Actualizar un permiso individual
  async updateRolePermission(rolePermissionId: number, data: { has_permission: boolean }): Promise<RolePermission> {
    console.log(`🔧 Actualizando role_permission ${rolePermissionId} con:`, data);
    try {
      const res: AxiosResponse<RolePermission> = await axios.put(`${API_URL}/role-permissions/${rolePermissionId}`, data);
      console.log(`✅ Role permission actualizado:`, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ Error actualizando role_permission ${rolePermissionId}:`, error);
      throw error;
    }
  }

  // Crear nueva relación rol-permiso
  async createRolePermission(roleId: number, permissionId: number, data: Partial<RolePermission> = {}): Promise<RolePermission> {
    const res: AxiosResponse<RolePermission> = await axios.post(
      `${API_URL}/role-permissions/role/${roleId}/permission/${permissionId}`,
      data
    );
    return res.data;
  }

  // Eliminar relación rol-permiso
  async deleteRolePermission(roleId: number, permissionId: number): Promise<{ message: string }> {
    const res: AxiosResponse<{ message: string }> = await axios.delete(
      `${API_URL}/role-permissions/role/${roleId}/permission/${permissionId}`
    );
    return res.data;
  }
}

export const rolePermissionService = new RolePermissionService();