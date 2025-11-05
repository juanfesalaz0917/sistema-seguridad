// src/components/SocialLoginButtons.tsx
import { GoogleAuthProvider, OAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SocialLoginButtons = () => {
  const handleLogin = async (providerName: "google" | "microsoft" | "github") => {
    try {
      let provider;

      switch (providerName) {
        case "google":
          provider = new GoogleAuthProvider();
          break;

        case "microsoft":
          provider = new OAuthProvider("microsoft.com");
          provider.addScope("openid");
          provider.addScope("profile");
          provider.addScope("email");
          provider.setCustomParameters({ prompt: "select_account" });
          break;

        case "github":
          provider = new GithubAuthProvider();
          break;

        default:
          throw new Error(`Proveedor no soportado: ${providerName}`);
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log(`✅ Sesión iniciada con ${providerName}:`, user);
      alert(`Bienvenido ${user.displayName || user.email}`);
    } catch (error: any) {
      console.error(`❌ Error con ${providerName}:`, error);
      alert(`Error al iniciar sesión con ${providerName}: ${error.code || error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Google */}
      <button type="button" onClick={() => handleLogin("google")} className="flex items-center gap-2 border p-3 rounded-lg">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        Continuar con Google
      </button>

      {/* Microsoft */}
      <button type="button" onClick={() => handleLogin("microsoft")} className="flex items-center gap-2 border p-3 rounded-lg">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="w-5 h-5" />
        Continuar con Microsoft
      </button>

      {/* GitHub */}
      <button type="button" onClick={() => handleLogin("github")} className="flex items-center gap-2 border p-3 rounded-lg">
        <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="w-5 h-5" />
        Continuar con GitHub
      </button>
    </div>
  );
};

export default SocialLoginButtons;
