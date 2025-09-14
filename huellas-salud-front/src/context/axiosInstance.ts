import axios from "axios";

const PATH_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/internal";

const axiosInstance = axios.create({
    baseURL: PATH_BASE,
    headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

export default axiosInstance;