import { Role } from "../../models/Role";
import React, { useState } from "react";
import GenericTable from "../../components/GenericTable";
import { useNavigate } from "react-router-dom";

const RolesList: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([
        { id: 1, name: "Admin" },
        { id: 2, name: "User"},
    ]);

    const navigate = useNavigate();

  const handleAction = (action: string, item: Role) => {
  if (action === "assignPermissions") {
    navigate(`/permissions/grouped/role/${item.id}`);
  }
};

  return (
    <div>
      <h2>Role List</h2>
      <GenericTable
        data={roles}
        columns={["id", "name"]}
        actions={[{ name: "assignPermissions", label: "Assign Permissions" }]}
        onAction={handleAction}
      />
    </div>
  );
};

export default RolesList;