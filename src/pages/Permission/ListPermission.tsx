import React from "react";
import CrudPage from "../../components/CrudPage";
import { permissionService } from "../../services/permissionService";
import { Permission } from "../../models/Permission";

const ListPermission: React.FC = () => {
  return (
    <CrudPage<Permission>
      title="Permisos"
      service={{
        getAll: permissionService.getAll.bind(permissionService),
        delete: permissionService.delete.bind(permissionService),
      }}
      columns={["id", "url", "method"]}
      routeBase="/permissions"
    />
  );
};

export default ListPermission;
