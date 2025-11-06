// src/services/SecurityService.ts
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import api from "../interceptors/axiosInterceptor";
import { User } from "../models/User";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";


class SecurityService extends EventTarget {
  keySession: string;
  API_URL: string;
  user: User | null;

  constructor() {
    super();

    this.keySession = "token";
    this.API_URL = import.meta.env.VITE_API_URL || "";
    this.user = JSON.parse(localStorage.getItem("user") || "null");

    // Escucha cambios de autenticación
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.handleFirebaseUser(firebaseUser);
      } else {
        // Solo hacer logout si no hay usuario en localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          this.logout();
        }
      }
    });
  }

  private async handleFirebaseUser(firebaseUser: FirebaseUser) {
    try {
      const email = firebaseUser.email;
      if (!email) throw new Error("Usuario Firebase sin email");

      // 🔹 Verificar si ya hay un usuario en localStorage con el mismo email
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Si el email coincide, usar el usuario guardado (preserva foto actualizada)
        if (parsedUser.email === email) {
          console.log("✅ Usuario cargado desde localStorage (foto preservada)");

          // Solo actualizar el token (puede haber expirado)
          const newToken = await firebaseUser.getIdToken();
          const updatedUser = {
            ...parsedUser,
            token: newToken,
          };

          this.user = updatedUser;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.setItem(this.keySession, newToken);
          store.dispatch(setUser(updatedUser));

          return updatedUser;
        }
      }

      // 1️⃣ Buscar usuario en DB por email exacto
      const res = await fetch(`${this.API_URL}/users?email=${encodeURIComponent(email)}`);
      const users = await res.json();

      console.log('🔍 Usuarios devueltos:', users);

      // Filtrar por email exacto (case-insensitive)
      const exactUser = Array.isArray(users)
        ? users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
        : null;

      let userObj: any;

      if (!exactUser) {
        // 2️⃣ Crear usuario si no existe
        console.log('📝 Creando nuevo usuario...');
        const createRes = await fetch(`${this.API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: firebaseUser.displayName || "Usuario",
            phone: "",
          }),
        });
        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(err.error || "Error al crear usuario");
        }
        userObj = await createRes.json();
        console.log('✅ Usuario creado:', userObj);
      } else {
        // 3️⃣ Usar el usuario exacto
        userObj = exactUser;
        console.log('✅ Usuario encontrado:', userObj);
      }

      // 4️⃣ Obtener foto del perfil en backend (si existe)
      let profilePhotoUrl = firebaseUser.photoURL || "";

      try {
        const profileRes = await fetch(`${this.API_URL}/profiles/user/${userObj.id}`);
        if (profileRes.ok) {
          const profile = await profileRes.json();
          console.log('📸 Perfil del backend:', profile);

          // El backend guarda la foto en el campo "photo"
          if (profile.photo) {
            // Construir URL completa
            let photoUrl = profile.photo;
            if (!photoUrl.startsWith('http')) {
              photoUrl = `${this.API_URL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
            }
            profilePhotoUrl = photoUrl;
            console.log('✅ Foto cargada desde perfil del backend:', photoUrl);
          } else {
            console.log('⚠️ Perfil sin foto, usando foto del proveedor');
          }
        }
      } catch (profileError) {
        console.log('⚠️ No se pudo cargar perfil del backend, usando foto de proveedor');
      }

      // 5️⃣ Construir objeto User con ID real de DB
      const user: User = {
        id: userObj.id,
        name: userObj.name || firebaseUser.displayName || "Usuario",
        email: email,
        token: await firebaseUser.getIdToken(),
        photo_url: profilePhotoUrl,
      };

      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(this.keySession, user.token || "");

      store.dispatch(setUser(user));
      this.dispatchEvent(new CustomEvent("userChange", { detail: user }));

      console.log("✅ Usuario autenticado:", user);
      return user;
    } catch (error) {
      console.error("Error manejando FirebaseUser:", error);
      // No hacer logout automático, solo registrar error
    }
  }

  async login(user: User) {
    try {
      const response = await api.post(`${this.API_URL}/login`, user, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      // Guardar usuario y token correctos
      store.dispatch(setUser(data.user));
      localStorage.setItem(this.keySession, data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      // Mejorar mensaje de error para el frontend
      console.error("Error durante login:", error);
      const err: any = error;
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      throw new Error(serverMsg || 'Error durante login');
    }
  }

  logout() {
    this.user = null;
    signOut(auth);
    localStorage.removeItem(this.keySession);
    localStorage.removeItem("user");
    store.dispatch(setUser(null));
    this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.keySession);
  }

  getToken() {
    return localStorage.getItem(this.keySession);
  }
}

export default new SecurityService();