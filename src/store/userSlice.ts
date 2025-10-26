// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";
//Definir la composición de la variable reactiva
interface UserState {
    user: User | null;
}

const storedUser = localStorage.getItem("user");
const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null, //evaluar si hay un usuario almacenado en localStorage, si lo hay lo devuelve como objeto, si no hay devuelve null
};

const userSlice = createSlice({
    name: "user", // esto es cuando se apaga el computador y vuelve a prender, mantiene la sesion
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload)); // Almacenar el usuario en localStorage o si no esta en la plataforma
            } else {
                localStorage.removeItem("user");// Eliminar el usuario de localStorage si es null o si cierra sesión
            }
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;