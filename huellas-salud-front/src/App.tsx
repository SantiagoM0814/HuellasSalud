import { useLocation, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./modules/Navbar/Navbar";
import Login from "./modules/Login/Login";
import Products from "./modules/Products/Products";
import ProductsAdmin from "./modules/Products/ProductsAdmin";
import Pets from "./modules/Pets/Pets";
// import History from "./modules/History/History";
import Home from "./modules/Home/Home";
import Contact from "./modules/Contact/Contact";
import Services from "./modules/Services/Services";
import UserRegister from "./modules/Users/UserRegister/UserRegister";
import Users from "./modules/Users/UserManagement/Users";
import ProtectedRoute from "./context/ProtectedRoute";
import PasswordRecovery from "./modules/PasswordRecovery/PasswordRecovery";
import ResetPassword from "./modules/PasswordRecovery/ResetPassword";
import PetDetails from "./modules/PetDetails/PetDetails";

const AppRoutes = () => {

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/registro-usuario", element: <UserRegister /> },
    { path: "/productos", element: <Products /> },
    { path: "/productos-admin", element: <ProductsAdmin /> },
    { path: "/recuperar-contrasena", element: <PasswordRecovery /> },
    { path: "/reset-password", element: <ResetPassword /> },
    {
      path: "/usuarios",
      element: (
        <ProtectedRoute requiredRole={["ADMINISTRADOR"]}>
          <Users />
        </ProtectedRoute>
      ),
    },
    {
      path: "/mascotas", element: (
        <ProtectedRoute requiredRole={["CLIENTE", "ADMINISTRADOR"]}>
          <Pets />
        </ProtectedRoute>
      )
    },
    {
    path: "/mascotas/:idPet", // ruta dinámica para detalle
    element: (
      <ProtectedRoute requiredRole={["CLIENTE", "ADMINISTRADOR"]}>
        <PetDetails />
      </ProtectedRoute>
      ),
    },
    // { path: "/historial", element: <History /> },
    { path: "/contacto", element: <Contact /> },
    { path: "/servicios", element: <Services /> }
  ]);

  return routes;
};

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/reset-password" && <Navbar />}
      <AppRoutes />
      <ToastContainer theme="light" />
    </>
  );
}

export default App;
