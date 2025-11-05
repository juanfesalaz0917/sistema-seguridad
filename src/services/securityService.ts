// src/services/SecurityService.ts
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import { User } from "../models/User";

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
