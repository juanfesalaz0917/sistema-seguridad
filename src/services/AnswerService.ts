// src/services/answerService.ts
import api from "../interceptors/axiosInterceptor";
import { UserSecurityAnswer, UserSecurityAnswerInput, UserSecurityAnswerView } from "../models/UserSecurityAnswer";

class AnswerService {
  // Obtener todas las respuestas (admin)
  async getAllAnswers(): Promise<UserSecurityAnswer[]> {
    try {
      const res = await api.get<UserSecurityAnswer[]>("/answers");
      return res.data;
    } catch (err) {
      console.error("Error al obtener todas las respuestas:", err);
      return [];
    }
  }

  async getAnswerById(id: number): Promise<UserSecurityAnswer | null> {
    try {
      const res = await api.get<UserSecurityAnswer>(`/answers/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error al obtener respuesta por id:", err);
      return null;
    }
  }

  // Obtener todas las respuestas de un usuario
  async getAnswersByUser(userId: number): Promise<UserSecurityAnswerView[]> {
    try {
      const res = await api.get<UserSecurityAnswerView[]>(`/answers/user/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Error al obtener respuestas por usuario:", err);
      return [];
    }
  }

  // Obtener respuestas por pregunta (opcional)
  async getAnswersByQuestion(questionId: number): Promise<UserSecurityAnswer[]> {
    try {
      const res = await api.get<UserSecurityAnswer[]>(`/answers/question/${questionId}`);
      return res.data;
    } catch (err) {
      console.error("Error al obtener respuestas por pregunta:", err);
      return [];
    }
  }

  // Obtener la respuesta de un usuario para una pregunta específica
  async getUserAnswerForQuestion(userId: number, questionId: number): Promise<UserSecurityAnswer | null> {
    try {
      const res = await api.get<UserSecurityAnswer>(`/answers/user/${userId}/question/${questionId}`);
      return res.data;
    } catch (err) {
      console.error("Error al obtener respuesta usuario-pregunta:", err);
      return null;
    }
  }

  /**
   * Crear respuesta
   * Backend espera: POST /api/answers/user/:user_id/question/:question_id
   * Body: { "content": "..." }
   */
  async createAnswer(input: UserSecurityAnswerInput): Promise<UserSecurityAnswer | null> {
    try {
      // Asumo que UserSecurityAnswerInput tiene: user_id, security_question_id, content
      const { user_id, security_question_id, content } = input as any;
      const res = await api.post<UserSecurityAnswer>(
        `/answers/user/${user_id}/question/${security_question_id}`,
        { content },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (err) {
      console.error("Error al crear respuesta:", err);
      return null;
    }
  }

  // Actualizar respuesta por id (envía { content })
  async updateAnswer(id: number, content: string): Promise<UserSecurityAnswer | null> {
    try {
      const res = await api.put<UserSecurityAnswer>(
        `/answers/${id}`,
        { content },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (err) {
      console.error("Error al actualizar respuesta:", err);
      return null;
    }
  }

  async deleteAnswer(id: number): Promise<boolean> {
    try {
      await api.delete(`/answers/${id}`);
      return true;
    } catch (err) {
      console.error("Error al eliminar respuesta:", err);
      return false;
    }
  }
}

export const answerService = new AnswerService();
export default answerService;
