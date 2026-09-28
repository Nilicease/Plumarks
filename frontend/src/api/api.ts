import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("plumarks-token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";
    return config;
});

export default api;