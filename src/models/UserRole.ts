import { User } from "./User";
import { Role } from "./Role";

export interface UserRole {
  id?: string;
  startAt?: Date;
  endAt?: Date;
  user?: User;
  role?: Role;
}
