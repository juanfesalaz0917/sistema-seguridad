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

  async getAll(): Promise<Session[]> {
    if (!this.userId) throw new Error("User ID es requerido para listar sesiones");
    const res = await fetch(`${API_URL}/sessions/user/${this.userId}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return await res.json();
  }

  async getById(id: string): Promise<Session> {
    const res = await fetch(`${API_URL}/sessions/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return await res.json();
  }

  async create(item: Omit<Session, "id">): Promise<Session> {
  if (!this.userId) throw new Error("User ID es requerido para crear sesión");
  const res = await fetch(`${API_URL}/sessions/user/${this.userId}`, { // <- aquí
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(`Error creando sesión: ${res.status} - ${await res.text()}`);
  return await res.json();
}


  async update(id: string, item: Partial<Session>): Promise<Session> {
    const res = await fetch(`${API_URL}/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error actualizando sesión: ${res.status} - ${text}`);
    }
    return await res.json();
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error eliminando sesión: ${res.status} - ${text}`);
    }
    return true;
  }
}

export const getSessionService = (userId?: string) => new SessionService(userId);
