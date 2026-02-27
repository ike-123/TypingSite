import { create } from "zustand"
import type { AxiosInstance } from "axios";
import axios from "axios";

type AuthStore = {

    Register: (username: string, email: string, password: string) => Promise<void>;
    Login: (email: string, password: string) => Promise<void>;
    Logout: () => Promise<void>;
    AuthPing: () => Promise<void>;
    user: any | null;
    loggedIn: boolean;

}

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:3001/api/Auth/",
    withCredentials: true,
});

export const useAuthStore = create<AuthStore>((set) => ({

    user: null,
    loggedIn: false,

    async Register(username:string, email: string, password: string) {

        await api.post("Register", { username, email, password });

    },

    async Login(email: string, password: string) {

        try {

            const { data } = await api.post("Login", { email, password });

            // set({ user: data, loggedIn: true });
            // console.log(data);

        } catch (error) {

            // set({ user: null, loggedIn: false });
            throw error;

        }

    },

    async Logout() {

        await api.get("Logout");
        window.location.reload();
    },

    async AuthPing() {

        console.log("ping");
        try {
            // const { data } = await api_Refresh.get("Auth/Ping", { withCredentials: true });

            // set({ user: data, loggedIn: true });

            // console.log(data);

        } catch (error) {

            set({ user: null, loggedIn: false });

        }
    },

}))