// src/components/SocialLoginButtons.tsx
import React from "react";
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseMicrosoftConfig"; // Ajusta la ruta según tu estructura

const MicrosoftLoginTest: React.FC = () => {
  const handleMicrosoftLogin = async () => {
    try {
      const provider = new OAuthProvider("microsoft.com");
      provider.addScope("openid");
      provider.addScope("profile");
      provider.addScope("email");
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("✅ Sesión iniciada con Microsoft:", user);
      alert(`Bienvenido ${user.displayName || user.email}`);
    } catch (error: any) {
      console.error("❌ Error al iniciar sesión con Microsoft:", error);
      alert(`Error: ${error.code || error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <button
        onClick={handleMicrosoftLogin}
        type="button"
        className="flex items-center justify-center gap-2 w-full max-w-sm rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-700 font-medium hover:bg-gray-100 transition"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
          alt="Microsoft"
          className="h-5 w-5"
        />
        <span>Continuar con Microsoft</span>
      </button>
    </div>
  );
};

export default MicrosoftLoginTest;
