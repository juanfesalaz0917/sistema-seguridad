import { BaseService } from "./baseService";
import { Permission } from "../models/Permission";

export class PermissionService extends BaseService<Permission> {
    constructor() {
        super("/permissions"); // 👈 Este es el endpoint REST del recurso Permission
    }
}
export const permissionService = new PermissionService();
