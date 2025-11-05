import { RolePermission } from "./RolePermission";

export interface Permission{
    id?:string;
    url:string;
    method:string;
    roles?: RolePermission[];
}