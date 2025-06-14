import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { register } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    meta_gasto: 0,
    meta_ahorro: 0,
    meta_inversion: 0,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Asegurarse de convertir a número si es una meta
    if (["meta_gasto", "meta_ahorro", "meta_inversion"].includes(name)) {
      setForm({ ...form, [name]: value === "" ? 0 : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateMetas = () => {
    const total =
      Number(form.meta_gasto) +
      Number(form.meta_ahorro) +
      Number(form.meta_inversion);
    return total <= 100;
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("➡️ Datos del formulario enviados al backend:", form);

    if (!validateMetas()) {
      setError("La suma de las metas no puede superar el 100%.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "La contraseña debe tener al menos 10 caracteres, una letra, un número y un símbolo."
      );
      return;
    }

    if (form.username && form.username.length > 50) {
      setError("El nombre de usuario no debe superar los 50 caracteres.");
      return;
    }

    try {
      await register(form);
      alert("Cuenta creada exitosamente. Inicie sesión.");
      navigate("/");
    } catch (err) {
      console.error("❌ Error al registrar:", err);
      const errData = err.response?.data?.detail;
      setError(Array.isArray(errData) ? errData : [errData || "Error al registrar usuario."]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white px-8 pt-6 pb-8 rounded-xl shadow-lg w-full max-w-md border border-[#95A5A6]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1F3B4D]">
          Crear cuenta
        </h2>

        {Array.isArray(error)
          ? error.map((e, i) => (
              <p key={i} className="text-[#E74C3C] text-sm mb-2 text-center">
                {e}
              </p>
            ))
          : error && (
              <p className="text-[#E74C3C] mb-4 text-center">{error}</p>
            )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#1F3B4D] font-medium mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <InputField
              type="email"
              name="email"
              placeholder="Ingrese su correo"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-[#95A5A6] bg-white text-[#1F3B4D]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#1F3B4D] font-medium mb-1" htmlFor="username">
              Nombre de usuario (opcional)
            </label>
            <InputField
              type="text"
              name="username"
              placeholder="Ingrese un nombre de usuario"
              value={form.username}
              onChange={handleChange}
              maxLength={50}
              className="border border-[#95A5A6] bg-white text-[#1F3B4D]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#1F3B4D] font-medium mb-1" htmlFor="password">
              Contraseña
            </label>
            <InputField
              type="password"
              name="password"
              placeholder="Ingrese una contraseña segura"
              value={form.password}
              onChange={handleChange}
              required
              className="border border-[#95A5A6] bg-white text-[#1F3B4D]"
            />
          </div>

          {/* Metas */}
          {["meta_gasto", "meta_ahorro", "meta_inversion"].map((campo, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[#1F3B4D] font-medium mb-1" htmlFor={campo}>
                {`Meta de ${campo.split("_")[1]} (%)`}
              </label>
              <InputField
                type="number"
                name={campo}
                placeholder="Ej: 30"
                value={form[campo]}
                onChange={handleChange}
                min={0}
                max={100}
                className="border border-[#95A5A6] bg-white text-[#1F3B4D]"
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-[#1F3B4D] hover:bg-[#F39C12] text-white font-semibold py-2 px-4 rounded w-full transition-colors"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <a href="/" className="text-[#2ECC71] font-medium hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;

