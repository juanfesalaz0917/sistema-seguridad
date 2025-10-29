import { number } from "yup";

export interface Address {
    id: number;
    user_id: number;
    street: string;
    number: string;
    latitude: number;
    longitude: number;
}