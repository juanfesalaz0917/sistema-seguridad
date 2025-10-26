import axios from "axios";
import { User } from "../models/User";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";

class SecurityService extends EventTarget { // Extiende EventTarget para manejar eventos personalizados(hereda propiedades y métodos de EventTarget)
    keySession: string;
    API_URL: string;
    user: User;
    theAuthProvider: any;
    
    constructor() {
        super();

        this.keySession = 'token';
        this.API_URL = import.meta.env.VITE_API_URL || ""; // Reemplaza con la URL real
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser); //si hay un usuario almacenado en localStorage, lo devuelve como objeto
        } else {
            this.user = {};//si no hay un usuario almacenado, inicializa como objeto vacío
        }
    }

    async login(user: User) {
        console.log("llamando api " + `${this.API_URL}/login`);
        try {
            const response = await axios.post(`${this.API_URL}/login`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            //localStorage.setItem("user", JSON.stringify(data));
            store.dispatch(setUser(data["user"]));// Actualiza el estado global con el usuario autenticado
            localStorage.setItem(this.keySession, data["token"]); // Almacena el token en localStorage
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
        
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
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
