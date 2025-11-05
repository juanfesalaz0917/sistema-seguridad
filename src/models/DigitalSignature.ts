// src/models/DigitalSignature.ts
export interface DigitalSignature {
    id?: number;
    user_id: number;           // FK - Relación 1:1 con User
    photo: string;             // URL o base64 de la imagen de la firma
    created_at?: string;
    updated_at?: string;
}

// DTO para crear/actualizar (sin necesidad de id)
export interface DigitalSignatureInput {
    user_id: number;
    photo: string;
}