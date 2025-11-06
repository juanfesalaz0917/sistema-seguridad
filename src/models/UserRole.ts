import { User } from './User';
import { Role } from './Role';

export interface UserRole {
    id?: string;
    user_id?: number;
    role_id?: number;
    startAt?: Date;
    endAt?: Date;
    user?: User;
    role?: Role;
}
