// src/models/UserSecurityAnswer.ts
export interface UserSecurityAnswer {
    id?: number;
    user_id: number;                    // FK a User
    security_question_id: number;       // FK a SecurityQuestion
    answer: string;                     // Respuesta (se debe encriptar en backend)
    created_at?: string;
    updated_at?: string;
}

// DTO para crear/actualizar
export interface UserSecurityAnswerInput {
    user_id: number;
    security_question_id: number;
    answer: string;
}

// Vista completa con la pregunta incluida
export interface UserSecurityAnswerView extends UserSecurityAnswer {
    question_name?: string;
    question_description?: string;
}