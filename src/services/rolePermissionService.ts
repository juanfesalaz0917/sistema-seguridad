import { BaseService } from "./baseService";
import { RolePermission } from "../models/RolePermission";

export class RolePermissionService extends BaseService<RolePermission> {}
export const rolePermissionService = new RolePermissionService();