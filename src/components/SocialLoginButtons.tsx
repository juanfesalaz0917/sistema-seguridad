import { useState } from 'react';
import {
    GoogleAuthProvider,
    OAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { store } from '../store/store';
import { setUser } from '../store/userSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SocialLoginButtons = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (
        providerName: 'google' | 'microsoft' | 'github',
    ) => {
        if (loading) return; // prevent double clicks
        setLoading(true);
        
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

            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            const apiUrl = import.meta.env.VITE_API_URL;

            if (!apiUrl) {
                throw new Error('VITE_API_URL no está configurada');
            }

            if (!firebaseUser.email) {
                throw new Error('El proveedor no proporcionó un email');
            }

            // 🔹 Buscar usuario en DB
            const usersResponse = await fetch(
                `${apiUrl}/users?email=${encodeURIComponent(firebaseUser.email)}`,
            );
            
            if (!usersResponse.ok) {
                throw new Error('Error al consultar usuarios en la base de datos');
            }

            const users = await usersResponse.json();

            // 🔍 DEBUG: Ver qué devuelve el backend
            console.log('🔍 Usuarios devueltos por el backend:', users);
            console.log('🔍 Email buscado:', firebaseUser.email);
            console.log('🔍 Tipo de respuesta:', Array.isArray(users) ? 'Array' : typeof users);

            // 🔹 VALIDACIÓN MANUAL: Filtrar por email exacto (case-insensitive)
            const exactUser = Array.isArray(users) 
                ? users.find((u: any) => u.email?.toLowerCase() === firebaseUser.email?.toLowerCase())
                : null;

            console.log('🔍 Usuario exacto encontrado:', exactUser);

            let userObj: any;
            
            if (!exactUser) {
                // ✅ No existe → Crear usuario
                console.log('📝 Creando nuevo usuario...');
                
                const createUserResponse = await fetch(`${apiUrl}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || 'Usuario',
                        phone: '',
                    }),
                });
                
                if (!createUserResponse.ok) {
                    const err = await createUserResponse.json();
                    throw new Error(err.error || 'Error al crear usuario');
                }
                
                userObj = await createUserResponse.json();
                console.log('✅ Usuario creado exitosamente:', userObj);
            } else {
                // ✅ Usuario encontrado → usarlo
                userObj = exactUser;
                console.log('✅ Usuario existente encontrado:', userObj);
            }

            const userId = userObj.id;

            if (!userId) {
                throw new Error('El usuario no tiene un ID válido');
            }

            // 🔹 Revisar perfil exacto del userId
            const profileResponse = await fetch(
                `${apiUrl}/profiles/user/${userId}`,
            );
            
            let profileData: any = null;
            
            if (profileResponse.ok) {
                profileData = await profileResponse.json();
            }

            if (!profileData || profileResponse.status === 404) {
                // ✅ Crear perfil
                console.log('📝 Creando perfil para usuario:', userId);
                
                const formData = new FormData();
                formData.append(
                    'displayName',
                    firebaseUser.displayName || 'Usuario',
                );
                formData.append('email', firebaseUser.email);
                formData.append('phone', '');

                if (firebaseUser.photoURL) {
                    try {
                        const photoBlob = await (
                            await fetch(firebaseUser.photoURL)
                        ).blob();
                        formData.append('photo', photoBlob, 'profile.jpg');
                    } catch (photoError) {
                        console.warn('⚠️ No se pudo cargar la foto de perfil:', photoError);
                    }
                }

                const createProfileResponse = await fetch(
                    `${apiUrl}/profiles/user/${userId}`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );

                if (!createProfileResponse.ok) {
                    const err = await createProfileResponse.json();
                    throw new Error(err.error || 'Error al crear perfil');
                }

                profileData = await createProfileResponse.json();
                console.log('✅ Perfil creado:', profileData);
            } else {
                console.log('✅ Perfil ya existe:', profileData);
            }

            // 🔹 Guardar en store y LocalStorage
            const finalUser = {
                ...userObj,
                token: await firebaseUser.getIdToken(),
                photo_url: firebaseUser.photoURL || '',
            };
            
            store.dispatch(setUser(finalUser));
            localStorage.setItem('user', JSON.stringify(finalUser));

            console.log('✅ Usuario logueado correctamente:', finalUser);
            toast.success('Login exitoso');
            // Redirect to dashboard after successful social login
            navigate('/');
        } catch (err: any) {
            console.error('❌ Error login social:', err);
            toast.error(err?.message || 'Error durante el inicio de sesión');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <button
                type="button"
                onClick={() => handleLogin('google')}
                disabled={loading}
                className="flex items-center gap-2 border p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                {loading ? 'Procesando...' : 'Continuar con Google'}
            </button>

            <button
                type="button"
                onClick={() => handleLogin('microsoft')}
                disabled={loading}
                className="flex items-center gap-2 border p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                    alt="Microsoft"
                    className="w-5 h-5"
                />
                {loading ? 'Procesando...' : 'Continuar con Microsoft'}
            </button>

            <button
                type="button"
                onClick={() => handleLogin('github')}
                disabled={loading}
                className="flex items-center gap-2 border p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="GitHub"
                    className="w-5 h-5"
                />
                {loading ? 'Procesando...' : 'Continuar con GitHub'}
            </button>
        </div>
    );
};

export default SocialLoginButtons;