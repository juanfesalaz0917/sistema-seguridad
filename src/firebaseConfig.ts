// Importa las funciones necesarias del SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase (la que te daba la app desde la consola)
const firebaseConfig = {
  apiKey: "AIzaSyAvq1khoy2DNHdlxNHK8GXkAO3ZkjK5w64",
  authDomain: "frontendreact-c6632.firebaseapp.com",
  projectId: "frontendreact-c6632",
  storageBucket: "frontendreact-c6632.firebasestorage.app",
  messagingSenderId: "801883072689",
  appId: "1:801883072689:web:faf4aa577125c9a8989a90"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la autenticación
export const auth = getAuth(app);
