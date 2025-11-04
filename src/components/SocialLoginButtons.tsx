import {
    GoogleAuthProvider,
    OAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SocialLoginButtons = () => {
    const handleLogin = async (
        providerName: 'google' | 'microsoft' | 'github',
    ) => {
        try {
            let provider;

            switch (providerName) {
                case 'google':
                    provider = new GoogleAuthProvider();
                    break;
                case 'microsoft':
                    provider = new OAuthProvider('microsoft.com');
                    provider.addScope('openid');
                    provider.addScope('profile');
                    provider.addScope('email');
                    provider.setCustomParameters({ prompt: 'select_account' });
                    break;
                case 'github':
                    provider = new GithubAuthProvider();
                    break;
                default:
                    throw new Error(`Proveedor no soportado: ${providerName}`);
            }

            // 🔹 Iniciar sesión con Firebase
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const apiUrl = import.meta.env.VITE_API_URL;

            // 🔹 1️⃣ Buscar usuario en la DB
            let usersResponse = await fetch(`${apiUrl}/users?email=${user.email}`);
            let users = await usersResponse.json();

            let userId: number;

            if (!users.length) {
                // 🔹 2️⃣ Si no existe, crear usuario
                const createUserResponse = await fetch(`${apiUrl}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.displayName || 'Usuario',
                        phone: '', // opcional
                    }),
                });

                const createdUser = await createUserResponse.json();
                if (!createUserResponse.ok)
                    throw new Error(createdUser.error || 'Error al crear usuario');

                userId = createdUser.id;
            } else {
                userId = users[0].id;
            }

            // 🔹 3️⃣ Revisar si el perfil existe
            const profileCheckResponse = await fetch(`${apiUrl}/profiles/user/${userId}`);
            const existingProfile = await profileCheckResponse.json();

            if (!existingProfile || profileCheckResponse.status === 404) {
                // Crear perfil si no existe
                const formData = new FormData();
                formData.append('displayName', user.displayName || 'Usuario');
                formData.append('email', user.email || '');
                formData.append('phone', '');

                if (user.photoURL) {
                    const photoResponse = await fetch(user.photoURL);
                    const photoBlob = await photoResponse.blob();
                    formData.append('photo', photoBlob, 'profile.jpg');
                }

                const profileResponse = await fetch(`${apiUrl}/profiles/user/${userId}`, {
                    method: 'POST',
                    body: formData,
                });

                const profileData = await profileResponse.json();
                if (!profileResponse.ok)
                    throw new Error(profileData.error || 'Error al crear perfil');

                console.log('✅ Perfil creado:', profileData);
            } else {
                // Solo iniciar sesión
                console.log('✅ Perfil ya existe, iniciando sesión:', existingProfile);
            }

        } catch (error: any) {
            console.error(`❌ Error con ${providerName}:`, error);
            alert(`Error al iniciar sesión con ${providerName}: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Google */}
            <button
                type="button"
                onClick={() => handleLogin('google')}
                className="flex items-center gap-2 border p-3 rounded-lg"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                Continuar con Google
            </button>

            {/* Microsoft */}
            <button
                type="button"
                onClick={() => handleLogin('microsoft')}
                className="flex items-center gap-2 border p-3 rounded-lg"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                    alt="Microsoft"
                    className="w-5 h-5"
                />
                Continuar con Microsoft
            </button>

            {/* GitHub */}
            <button
                type="button"
                onClick={() => handleLogin('github')}
                className="flex items-center gap-2 border p-3 rounded-lg"
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="GitHub"
                    className="w-5 h-5"
                />
                Continuar con GitHub
            </button>
        </div>
    );
};

export default SocialLoginButtons;