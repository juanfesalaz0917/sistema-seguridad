import React from 'react';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import UserFormValidator from '../../components/UserFormValidator';
import Swal from 'sweetalert2';
import { userService } from "../../services/userService";
import { profileService } from "../../services/profileService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreateUser: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateUser = async (user: User) => {
        try {
            // 1️⃣ Crear usuario
            console.log("📋 Datos que se envían para crear usuario:", user);
            const createdUser = await userService.createUser(user);

            if (!createdUser || !createdUser.id) {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear el usuario",
                    icon: "error",
                    timer: 3000
                });
                return;
            }

            console.log("✅ Usuario creado con éxito:", createdUser);

            // 2️⃣ Crear perfil automáticamente usando el teléfono ingresado en el formulario
            const profileData: Omit<Profile, "id"> = {
                user_id: createdUser.id,
                phone: user.phone || "" // usamos el phone del formulario
            };

            const createdProfile = await profileService.createForUser(createdUser.id, profileData);
            console.log("📞 Perfil creado automáticamente:", createdProfile);

            // 3️⃣ Mostrar mensaje de éxito y redirigir a la lista de usuarios
            Swal.fire({
                title: "Completado",
                text: "Usuario y perfil creados correctamente",
                icon: "success",
                timer: 3000
            });

            navigate("/user/list");

        } catch (error) {
            console.error("❌ Error al crear usuario o perfil:", error);
            Swal.fire({
                title: "Error",
                text: "Existe un problema al crear el usuario o su perfil",
                icon: "error",
                timer: 3000
            });
        }
    };

    return (
        <div>
            <h2>Create User</h2>
            <Breadcrumb pageName="Crear Usuario" />
            <UserFormValidator
                handleCreate={handleCreateUser}
                mode={1} // 1 significa creación
            />
        </div>
    );
};

export default CreateUser;
