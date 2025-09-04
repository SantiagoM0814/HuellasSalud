import { useContext } from "react";
import { AuthContext } from "../helper/typesHS";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole: string[] }) => {

    const { user, loading } = useContext(AuthContext);

    if (loading) return <div style={{ textAlign: "center", marginTop: "135px" }}>Cargando...</div>;
    if (!user) return <Navigate to="/" replace />;
    if (requiredRole?.length && !requiredRole.includes(user.role)) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;