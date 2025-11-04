import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // 👈 lee la variable del .env

export class BaseService<T extends { id?: string }> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `${API_URL}${endpoint}`; // 👈 concatena con la base URL
  }

  async getAll(): Promise<T[]> {
    const res = await axios.get(this.endpoint);
    return res.data;
  }

  async getById(id: string): Promise<T> {
    const res = await axios.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const res = await axios.post(this.endpoint, item);
    return res.data;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const res = await axios.put(`${this.endpoint}/${id}`, item);
    return res.data;
  }

  async delete(id: string): Promise<boolean> {
    await axios.delete(`${this.endpoint}/${id}`);
    return true;
  }
}
