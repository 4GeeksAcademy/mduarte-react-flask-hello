import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const LogoutButton = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Borrar el token guardado
    dispatch({ type: "LOGOUT" }); // Limpiar el estado global
    navigate("/login"); // Redirigir al login
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};
