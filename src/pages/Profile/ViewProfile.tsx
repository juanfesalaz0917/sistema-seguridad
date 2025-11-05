import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import GenericProfile from "../../components/GenericProfile";
import type { ProfileData } from "../../components/GenericProfile/types";
import { profileService } from "../../services/profileService";

const ViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!user) return;

    // Traer el perfil desde backend usando el id correcto
    profileService.getById(user.id).then(data => {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: data.phone || "",
        avatarUrl: data.photo ? `${import.meta.env.VITE_API_URL}/${data.photo}` : "/images/default-avatar.png",
      });
    }).catch(() => {
      Swal.fire("Error", "No se pudo cargar el perfil", "error");
    });
  }, [user]);

  if (!user) return <div className="text-center py-20 text-xl">No hay usuario logueado</div>;
  if (!profile) return <div className="text-center py-20 text-xl">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-5xl">
        <GenericProfile
          data={profile}
          onEdit={() => navigate(`/profiles/update/${user.id}`)}
          onLogout={() => Swal.fire("Sesión cerrada", "", "success")}
        />
      </div>
    </div>
  );
};

export default ViewProfile;
