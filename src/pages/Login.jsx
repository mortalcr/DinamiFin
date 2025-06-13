import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { login } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else if (err.response?.status === 422) {
        setError("Formato inválido. Verifica tu correo y contraseña.");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo más tarde.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white px-8 pt-6 pb-8 rounded-xl shadow-lg w-full max-w-md border border-[#95A5A6]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1F3B4D]">
          Iniciar Sesión
        </h2>

        {error && <p className="text-[#E74C3C] mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#1F3B4D] font-medium mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <InputField
              type="email"
              name="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#95A5A6] bg-white text-[#1F3B4D] focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#1F3B4D] font-medium mb-1" htmlFor="password">
              Contraseña
            </label>
            <InputField
              type="password"
              name="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-[#95A5A6] bg-white text-[#1F3B4D] focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1F3B4D] hover:bg-[#F39C12] text-white font-semibold py-2 px-4 rounded w-full transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-[#2ECC71] font-medium hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

