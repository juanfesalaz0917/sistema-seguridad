import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export class BaseService<T extends { id?: string }> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${API_URL}${endpoint}`;
  }

  async getAll(): Promise<T[]> {
    const res = await axios.get(this.endpoint);
    return res.data;
  }

  async getById(id: number | string): Promise<T> {
    const res = await axios.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const res = await axios.post(this.endpoint, item);
    return res.data;
  }

  // ✅ Actualizado para aceptar Partial<T> o FormData
  async update(id: string | number, item: Partial<T> | FormData): Promise<T> {
    const res = await axios.put(`${this.endpoint}/${id}`, item, {
      headers: item instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  }

  async delete(id: string): Promise<boolean> {
    await axios.delete(`${this.endpoint}/${id}`);
    return true;
  }
}
