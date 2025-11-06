import React from "react";
import CrudPage from "../../components/CrudPage";
import { profileService } from "../../services/profileService";
import type { Profile } from "../../models/Profile";

const ListProfiles: React.FC = () => {
  return (
    <CrudPage<Profile>
      title="Perfiles"
      service={profileService}
      columns={["id", "user_id", "phone", "photo"]}
      routeBase="/profiles"
    />
  );
};

export default ListProfiles;
