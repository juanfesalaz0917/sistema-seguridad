// src/models/Device.ts
export interface Device {
    id?: number;
    user_id: number;              // FK - Relación N:1 con User
    name: string;                 // ej: "iPhone 13 Pro", "MacBook Pro"
    ip: string;                   // ej: "192.168.1.100"
    operating_system: string;     // ej: "iOS 16.4", "Windows 11"
    last_login?: string;          // Última vez que se usó
    is_active: boolean;           // Si el dispositivo está actualmente activo
    created_at?: string;
    updated_at?: string;
}

// DTO para crear dispositivo
export interface DeviceInput {
    user_id: number;
    name: string;
    ip: string;
    operating_system: string;
    is_active?: boolean;
}