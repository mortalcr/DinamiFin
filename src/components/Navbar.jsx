import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutUser, loading } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
    setMenuOpen(false);
  };

  if (loading) return null;

  const navLinks = user && (
    <>
      <Link
        to="/dashboard"
        className="bg-white text-[#1F3B4D] hover:bg-[#F39C12] hover:text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Dashboard
      </Link>
      <Link
        to="/dashboardHistorico"
        className="bg-white text-[#1F3B4D] hover:bg-[#F39C12] hover:text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Histórico
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1F3B4D] px-6 py-3 flex items-center justify-between shadow z-50">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-white tracking-wide mr-2">
          DinamiFin
        </span>
        <div className="hidden md:flex gap-4 items-center">
          {navLinks}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <Link
              to="/perfil"
              className="bg-[#E8EDF3] text-[#1F3B4D] font-semibold px-3 py-1 rounded-md text-sm hover:bg-white transition"
            >
              {user.username}
            </Link>
            <button
              onClick={handleLogout}
              className="text-white border border-white px-3 py-1 rounded-md text-sm hover:bg-white hover:text-[#1F3B4D] transition hidden md:inline-block"
            >
              Cerrar sesión
            </button>
          </>
        )}

        {/* Menú hamburguesa para móviles */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {menuOpen && user && (
        <div className="absolute top-full left-0 w-full bg-[#1F3B4D] flex flex-col items-center py-4 shadow-md md:hidden z-40">
          {navLinks}
          <Link
            to="/perfil"
            className="text-white text-sm font-medium mb-2 hover:text-blue-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            {user.username}
          </Link>
          <button
            onClick={handleLogout}
            className="text-white border border-white px-3 py-1 rounded-md text-sm hover:bg-white hover:text-[#1F3B4D] transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

