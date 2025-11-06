import { ReactNode, useEffect, useState } from "react";
import { AuthContext, JwtPayload, User } from "../helper/typesHS";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.exp < Date.now() / 1000;
        } catch (error) {
            toast.error("Error decoding token:" + error);
            return true;
        }
    };

    const login = (token: string, user: User) => {
        setToken(token);
        setUser(user);

        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(user));
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);

        localStorage.clear();
        delete axiosInstance.defaults.headers.common["Authorization"];
        navigate("/", { replace: true });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        const storedToken = localStorage.getItem("token");

        if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
            logout(); // aquí sí hacemos logout si el token ya expiró
        } else {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
    }
        setLoading(false);

         const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "userData" && event.newValue) {
      setUser(JSON.parse(event.newValue));
    }
  };

  const handleCustomUserUpdate = () => {
    const updatedUser = localStorage.getItem("userData");
    if (updatedUser) setUser(JSON.parse(updatedUser));
  };

  // 🔥 Escuchar tanto cambios globales como locales
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("userDataUpdated", handleCustomUserUpdate);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("userDataUpdated", handleCustomUserUpdate);
  };
    }, []);

    useEffect(() => {
        const responseInterceptor = axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) logout();                
                return Promise.reject(error);
            }
        );
        return () => { axiosInstance.interceptors.response.eject(responseInterceptor); };
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}