// Importa las funciones necesarias del SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from "firebase/auth";

// Configuración de Firebase (la que te daba la app desde la consola)
const firebaseConfig = {
  apiKey: "AIzaSyAvq1khoy2DNHdlxNHK8GXkAO3ZkjK5w64",
  authDomain: "frontendreact-c6632.firebaseapp.com",
  projectId: "frontendreact-c6632",
  storageBucket: "frontendreact-c6632.firebasestorage.app",
  messagingSenderId: "801883072689",
  appId: "1:801883072689:web:faf4aa577125c9a8989a90"
};

// Evitar inicializaciones múltiples
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar Auth
export const auth = getAuth(app);

// Exportar proveedores (para usarlos donde quieras)
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider("microsoft.com");

// Parámetros opcionales
googleProvider.setCustomParameters({ prompt: "select_account" });
microsoftProvider.setCustomParameters({ prompt: "select_account" });

export default app;
