import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import { RootState, store } from "../../store/store";
import { setUser } from "../../store/userSlice";
import { profileService } from "../../services/profileService";
import GenericButton from "../../components/GenericButton/index";

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // 👈 tomamos el ID desde la URL
  const user = useSelector((state: RootState) => state.user.user);

  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar datos del perfil usando el ID de la URL
  useEffect(() => {
    if (!id) return;

    profileService
      .getById(id)
      .then((profile) => {
        console.log("📞 Perfil cargado:", profile);
        setPhone(profile.phone || "");

        // Construir URL de la foto si existe
        if (profile.photo) {
          const apiUrl = import.meta.env.VITE_API_URL;
          const photoUrl = `${apiUrl}/${profile.photo}`;
          setPhotoPreview(photoUrl);
        }
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      });
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      if (photoFile) formData.append("photo", photoFile);

      const updatedProfile = await profileService.update(id, formData);

      // 🔹 Si el usuario logueado es el mismo, actualizamos Redux store
      if (user && user.id?.toString() === id && updatedProfile.photo) {
        const apiUrl = import.meta.env.VITE_API_URL;
        let newPhotoUrl = updatedProfile.photo;

        if (!newPhotoUrl.startsWith("http")) {
          newPhotoUrl = `${apiUrl}${newPhotoUrl.startsWith("/") ? "" : "/"}${newPhotoUrl}`;
        }

        const updatedUser = { ...user, photo_url: newPhotoUrl };
        store.dispatch(setUser(updatedUser));
        console.log("✅ Usuario actualizado en store:", updatedUser);
      }

      Swal.fire("¡Perfil actualizado!", "", "success");
      navigate(`/profiles/${id}`); // 👈 redirige al perfil correcto
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      Swal.fire("Error al actualizar perfil", "", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (!id) {
    return <div className="text-center py-20 text-xl">ID de perfil no válido</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Actualizar Perfil</h2>
          <GenericButton variant="secondary" onClick={handleGoBack} disabled={loading}>
            ← Volver
          </GenericButton>
        </div>

        <form onSubmit={handleSubmit}>
          {photoPreview && (
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/150?text=Sin+Foto")
                  }
                />
                {photoFile && (
                  <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Nueva
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block font-medium mb-2">Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: +57 300 123 4567"
              className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Foto de Perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={loading}
              className="w-full border rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-3">
            <GenericButton type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? "Actualizando..." : "💾 Actualizar Perfil"}
            </GenericButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
