import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Perfil = () => {
  const { user, logoutUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    meta_gasto: "",
    meta_ahorro: "",
    meta_inversion: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:8000/perfil", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const payload = {
          email: data.email || "",
          username: data.username || "",
          password: "",
          meta_gasto: data.meta_gasto ?? "",
          meta_ahorro: data.meta_ahorro ?? "",
          meta_inversion: data.meta_inversion ?? "",
        };
        setFormData(payload);
        setOriginalData(payload);
        setLoading(false);
      })
      .catch(() => {
        logoutUser();
        navigate("/login");
      });
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const datosActualizados = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== originalData[key] && value !== "") {
        datosActualizados[key] = value;
      }
    });

    if (Object.keys(datosActualizados).length === 0) {
      setMensaje("No hay cambios para guardar.");
      setMostrarModal(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(datosActualizados),
      });

      if (response.status === 401) {
        logoutUser();
        navigate("/login");
      } else if (response.status === 200) {
        setMensaje("¡Perfil actualizado correctamente!");
        setMostrarModal(true);
      } else {
        const err = await response.json();
        setMensaje(err.detail || "Error al actualizar perfil.");
        setMostrarModal(true);
      }
    } catch (error) {
      setMensaje("Error del servidor.");
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    // Si hubo cambio de username o contraseña, cerrar sesión
    if (formData.username !== originalData.username || formData.password) {
      logoutUser();
      navigate("/login");
    } else {
      // Forzar recarga para ver reflejados los cambios
      window.location.reload();
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Perfil de Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Correo electrónico", name: "email", type: "email" },
            { label: "Nombre de usuario", name: "username", type: "text" },
            { label: "Nueva contraseña", name: "password", type: "password" },
            { label: "Meta de gasto mensual (%)", name: "meta_gasto", type: "number" },
            { label: "Meta de ahorro mensual (%)", name: "meta_ahorro", type: "number" },
            { label: "Meta de inversión mensual (%)", name: "meta_inversion", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F39C12]"
                {...(type === "number" ? { min: 0, max: 100 } : {})}
                required={name !== "password"}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#F39C12] text-white font-semibold py-2 rounded hover:bg-[#d9840c] transition"
          >
            Guardar cambios
          </button>
        </form>
      </div>

      {/* Modal de mensaje */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
            <p className="text-gray-800 text-lg font-semibold mb-4">{mensaje}</p>
            <button
              onClick={cerrarModal}
              className="bg-[#1F3B4D] text-white px-6 py-2 rounded hover:bg-[#2c5870] transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;

