import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import GenericProfile from "../../components/GenericProfile";
import type { ProfileData } from "../../components/GenericProfile/types";
import { profileService } from "../../services/profileService";
import { userService } from "../../services/userService";

const ViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!id) {
          Swal.fire("Error", "No se encontró el ID del perfil", "error");
          return;
        }

        // 1️⃣ Traemos el perfil
        const profileData = await profileService.getById(id);

        // Validar user_id antes de continuar
        if (!profileData.user_id) {
          Swal.fire("Error", "Este perfil no tiene usuario asociado", "error");
          return;
        }

        // 2️⃣ Traemos el usuario asociado
        const userData = await userService.getUserById(Number(profileData.user_id));
        if (!userData) {
          Swal.fire("Error", "Usuario no encontrado", "error");
          return;
        }

        // 3️⃣ Combinamos ambos datos
        setProfile({
          name: userData.name ?? "",
          email: userData.email ?? "",
          phone: profileData.phone ?? "",
          avatarUrl: profileData.photo
            ? `${import.meta.env.VITE_API_URL}/${profileData.photo}`
            : "/images/default-avatar.png",
        });
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
        console.error(error);
      }
    };

    fetchProfileData();
  }, [id]);

  if (!profile)
    return <div className="text-center py-20 text-xl">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-5xl">
        <GenericProfile
          data={profile}
          onEdit={() => navigate(`/profiles/update/${id}`)}
          onLogout={() => Swal.fire("Sesión cerrada", "", "success")}
        />
      </div>
    </div>
  );
};

export default ViewProfile;
