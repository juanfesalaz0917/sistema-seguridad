import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";

// Definir la composición de la variable reactiva
interface UserState {
    user: User | null;
}

// Inicializa el estado desde localStorage si existe
const storedUser = localStorage.getItem("user");
const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;

            if (action.payload) {
                const userToStore = {
                    id: action.payload.id ?? 0,
                    name: action.payload.name,
                    email: action.payload.email,
                    token: action.payload.token,
                    photo_url: action.payload.photo_url,
                };

                localStorage.setItem("user", JSON.stringify(userToStore));
                
                // ⚠️ AGREGAR ESTA LÍNEA:
                if (action.payload.token) {
                    localStorage.setItem("token", action.payload.token);
                }
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token"); // ⚠️ AGREGAR ESTA LÍNEA
            }
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
