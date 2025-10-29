import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';
import { User } from '../models/User';
import { store } from '../store/store';
import { setUser } from '../store/userSlice';

class SecurityService extends EventTarget {
    // Extiende EventTarget para manejar eventos personalizados(hereda propiedades y métodos de EventTarget)
    keySession: string;
    API_URL: string;
    user: User;
    theAuthProvider: any;

    constructor() {
        super();

        this.keySession = 'token';
        this.API_URL = import.meta.env.VITE_API_URL || ''; // Reemplaza con la URL real
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser); //si hay un usuario almacenado en localStorage, lo devuelve como objeto
        } else {
            this.user = {}; //si no hay un usuario almacenado, inicializa como objeto vacío
        }

        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                this.handleFirebaseUser(firebaseUser);
            }
        });
    }

    private async handleFirebaseUser(firebaseUser: FirebaseUser) {
        const user: User = {
            id: 0,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            token: await firebaseUser.getIdToken(),
            photo_url: firebaseUser.photoURL || '',
        };
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem(this.keySession, user.token || '');
        this.dispatchEvent(new CustomEvent('userChange', { detail: user }));
        store.dispatch(setUser(user));
        return user;
    }

    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser: FirebaseUser = result.user;

            return await this.handleFirebaseUser(firebaseUser);
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            throw error;
        }
    }

    async login(user: User) {
        try {
            const response = await axios.post(`${this.API_URL}/login`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            //localStorage.setItem("user", JSON.stringify(data));
            store.dispatch(setUser(data['user'])); // Actualiza el estado global con el usuario autenticado
            localStorage.setItem(this.keySession, data['token']); // Almacena el token en localStorage
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    getUser() {
        return this.user;
    }

    logout() {
        this.user = {};
        signOut(auth);
        localStorage.removeItem(this.keySession);
        localStorage.removeItem('user');
        this.dispatchEvent(new CustomEvent('userChange', { detail: null }));
        store.dispatch(setUser(null));
    }

    isAuthenticated() {
        return localStorage.getItem(this.keySession) !== null;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }
}

export default new SecurityService();
