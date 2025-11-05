// src/models/PermissionGroup.ts
import { Permission } from "./Permission";

export interface PermissionGroup {
  entity: string;
  permissions: Permission[];
}