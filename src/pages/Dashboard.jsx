import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/authService";
import { useUser } from "../context/UserContext";

function Dashboard() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!user) {
      getDashboard(token)
        .then((res) => setUser(res))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/");
        });
    }
  }, [navigate, user, setUser]);

  if (!user) return <div className="text-center p-8">Cargando...</div>;
  console.log("User data:", user);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.username}</h1>
      <p>Correo: {user.email}</p>
      {/* Puedes mostrar metas y demás datos aquí */}
    </div>
  );
}

export default Dashboard;
