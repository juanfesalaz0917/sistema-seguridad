// src/services/sessionService.ts
import { BaseService } from "./baseService";
import { Session } from "../models/Session";

const API_URL = import.meta.env.VITE_API_URL;

export class SessionService extends BaseService<Session> {
  private userId?: string;

  constructor(userId?: string) {
    super("/sessions");
    this.userId = userId;
  }

  // Lista sesiones de un usuario
  async getAll(): Promise<Session[]> {
    if (!this.userId) throw new Error("User ID es requerido para listar sesiones");
    const res = await fetch(`${API_URL}/sessions/user/${this.userId}`);
    const data = await res.json();
    return data;
  }

  // Obtener sesión por ID (ruta directa)
  async getById(id: string): Promise<Session> {
    const res = await fetch(`${API_URL}/sessions/${id}`);
    const data = await res.json();
    return data;
  }

  // Crear sesión para un usuario
  async create(item: Omit<Session, "id">): Promise<Session> {
    if (!this.userId) throw new Error("User ID es requerido para crear sesión");
    const res = await fetch(`${API_URL}/sessions/create/${this.userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  }

  // Actualizar sesión por ID
  async update(id: string, item: Partial<Session>): Promise<Session> {
    const res = await fetch(`${API_URL}/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return await res.json();
  }

  // Eliminar sesión por ID
  async delete(id: string): Promise<boolean> {
    await fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" });
    return true;
  }
}

// Función helper para usar desde páginas
export const getSessionService = (userId?: string) => new SessionService(userId);
