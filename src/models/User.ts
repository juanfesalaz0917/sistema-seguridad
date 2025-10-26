export interface User {
    id?: number; //opcional
    name?: string;
    email?: string;
    password?:string;
    age?: number;
    city?: string;
    phone?: string;
    is_active?: boolean;
    token?:string;
}