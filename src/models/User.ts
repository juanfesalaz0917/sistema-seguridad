export interface User {
    id?: number; // puede venir como string/number desde el backend o estar ausente en el cliente
    name: string;
    email: string;
    password?: string; // opcional en el cliente (no tenemos la contraseña cuando autenticamos con proveedores)
    age?: number;
    city?: string;
    phone?: string;
    is_active?: boolean;
    token?: string;
    photo_url?: string;
}
