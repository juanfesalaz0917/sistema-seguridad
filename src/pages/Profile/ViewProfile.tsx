import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import GenericProfile from "../../components/GenericProfile";
import type { ProfileData } from "../../components/GenericProfile/types";

const ViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return <div className="text-center py-20 text-xl">No hay usuario logueado</div>;

  const profileData: ProfileData = {
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    avatarUrl: user.photo_url ?? "/images/default-avatar.png",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4">
      {/* GenericProfile ocupando toda la sección */}
      <div className="w-full max-w-5xl">
        <GenericProfile
          data={profileData}
          fullPage // prop opcional para indicar que debe expandirse
          onEdit={() => navigate("/profiles/update")}
          onLogout={() => Swal.fire("Sesión cerrada", "", "success")}
        />
      </div>
    </div>
  );
};

export default ViewProfile;
