import { Role } from "./Role";
import { Permission } from "./Permission";

export interface RolePermission {
  id?: string;
  startAt?: Date;
  endAt?: Date;
  role?: Role;
  permission?: Permission;
}