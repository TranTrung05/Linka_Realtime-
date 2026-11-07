import axios from "axios"
const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
});

let accessToken: string | null = null;

export const setApiAccessToken = (token: string | null) => {
    accessToken = token;
};

api.interceptors.request.use((config) => {
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default api;