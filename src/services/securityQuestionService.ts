// src/services/securityQuestionService.ts
import axios from "axios";
import { SecurityQuestion } from "../models/SecurityQuestion";
import { UserSecurityAnswer, UserSecurityAnswerInput, UserSecurityAnswerView } from "../models/UserSecurityAnswer";
import api from "../interceptors/axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL || "";

class SecurityQuestionService {
    // ==========================================
    // SECURITY QUESTIONS (Catálogo)
    // ==========================================

    /**
     * Obtener todas las preguntas de seguridad disponibles
     */
    async getAllQuestions(): Promise<SecurityQuestion[]> {
        try {
            const response = await api.get<SecurityQuestion[]>("/security-questions");
            return response.data;
        } catch (error) {
            console.error("Error al obtener preguntas de seguridad:", error);
            return [];
        }
    }

    /**
     * Obtener una pregunta por ID
     */
    async getQuestionById(id: number): Promise<SecurityQuestion | null> {
        try {
            const response = await api.get<SecurityQuestion>(`/security-questions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener pregunta:", error);
            return null;
        }
    }

    // ==========================================
    // USER SECURITY ANSWERS (Respuestas del usuario)
    // ==========================================

    /**
     * Obtener todas las respuestas de un usuario
     * Retorna las preguntas respondidas con sus respuestas
     */
    async getUserAnswers(userId: number): Promise<UserSecurityAnswerView[]> {
        try {
            const response = await api.get<UserSecurityAnswerView[]>(`/user-security-answers/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener respuestas del usuario:", error);
            return [];
        }
    }

    /**
     * Crear una nueva respuesta de seguridad
     */
    async createAnswer(answer: UserSecurityAnswerInput): Promise<UserSecurityAnswer | null> {
        try {
            const response = await api.post<UserSecurityAnswer>("/user-security-answers", answer);
            return response.data;
        } catch (error) {
            console.error("Error al crear respuesta:", error);
            return null;
        }
    }

    /**
     * Actualizar una respuesta existente
     */
    async updateAnswer(id: number, answer: string): Promise<UserSecurityAnswer | null> {
        try {
            const response = await api.put<UserSecurityAnswer>(`/user-security-answers/${id}`, { answer });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar respuesta:", error);
            return null;
        }
    }

    /**
     * Eliminar una respuesta de seguridad
     */
    async deleteAnswer(id: number): Promise<boolean> {
        try {
            await api.delete(`/user-security-answers/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar respuesta:", error);
            return false;
        }
    }

    /**
     * Guardar múltiples respuestas a la vez (batch)
     */
    async saveMultipleAnswers(userId: number, answers: { question_id: number; answer: string }[]): Promise<boolean> {
        try {
            const promises = answers.map(a =>
                this.createAnswer({
                    user_id: userId,
                    security_question_id: a.question_id,
                    answer: a.answer,
                })
            );
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error("Error al guardar respuestas:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase
export const securityQuestionService = new SecurityQuestionService();