// src/services/SecurityService.ts
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import { User } from "../models/User";
import axios from "axios";

class SecurityService extends EventTarget {
  keySession: string;
  API_URL: string;
  user: User;

  constructor() {
    super();

    this.keySession = "token";
    this.API_URL = import.meta.env.VITE_API_URL || "";
    this.user = JSON.parse(localStorage.getItem("user") || "{}");

    // Escucha cambios de autenticación
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.handleFirebaseUser(firebaseUser);
      } else {
        this.logout();
      }
    });
  }

  private async handleFirebaseUser(firebaseUser: FirebaseUser) {
    const user: User = {
      id: 0,
      name: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      token: await firebaseUser.getIdToken(),
      photo_url: firebaseUser.photoURL || "",
    };

    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(this.keySession, user.token || "");

    store.dispatch(setUser(user));
    this.dispatchEvent(new CustomEvent("userChange", { detail: user }));
    return user;
  }

  async login(user: User) { //estara en la interfaz donde se pide usuario y contraseña
        console.log("llamando api " + `${this.API_URL}/login`);
        try {
            const response = await axios.post(`${this.API_URL}/login`, user, { // llamar al backend con petición login 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data; //usuario y token 
            //localStorage.setItem("user", JSON.stringify(data));
            store.dispatch(setUser(data["user"])); //guardar en base de datos el usuario contenido en el LocalStorage
            localStorage.setItem(this.keySession, data["token"]); //guarda token en localStorage
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

  logout() {
    this.user = {};
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
