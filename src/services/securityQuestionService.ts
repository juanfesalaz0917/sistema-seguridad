// src/services/securityQuestionService.ts
import api from "../interceptors/axiosInterceptor";
import { SecurityQuestion } from "../models/SecurityQuestion";

class SecurityQuestionService {
  async getAllQuestions(): Promise<SecurityQuestion[]> {
    try {
      const res = await api.get<SecurityQuestion[]>("/security-questions");
      return res.data;
    } catch (err) {
      console.error("Error al obtener preguntas de seguridad:", err);
      return [];
    }
  }

  async getQuestionById(id: number): Promise<SecurityQuestion | null> {
    try {
      const res = await api.get<SecurityQuestion>(`/security-questions/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error al obtener pregunta por id:", err);
      return null;
    }
  }

  async createQuestion(payload: Partial<SecurityQuestion>): Promise<SecurityQuestion | null> {
    try {
      const res = await api.post<SecurityQuestion>("/security-questions", payload);
      return res.data;
    } catch (err) {
      console.error("Error al crear pregunta:", err);
      return null;
    }
  }

  async updateQuestion(id: number, payload: Partial<SecurityQuestion>): Promise<SecurityQuestion | null> {
    try {
      const res = await api.put<SecurityQuestion>(`/security-questions/${id}`, payload);
      return res.data;
    } catch (err) {
      console.error("Error al actualizar pregunta:", err);
      return null;
    }
  }

  async deleteQuestion(id: number): Promise<boolean> {
    try {
      await api.delete(`/security-questions/${id}`);
      return true;
    } catch (err) {
      console.error("Error al eliminar pregunta:", err);
      return false;
    }
  }
}

export const securityQuestionService = new SecurityQuestionService();
export default securityQuestionService;
