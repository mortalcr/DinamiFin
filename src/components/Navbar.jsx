// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

import { useState } from "react";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link to="/dashboard" className="bg-white text-[#1F3B4D] font-semibold rounded border-2 border-[#F39C12] hover:bg-[#F39C12] hover:text-white transition block px-4 py-1 mx-1 shadow">
        Dashboard
      </Link>
      <Link to="/dashboardHistorico" className="bg-white text-[#1F3B4D] font-semibold rounded border-2 border-[#F39C12] hover:bg-[#F39C12] hover:text-white transition block px-4 py-1 mx-1 shadow">
        Histórico
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1F3B4D] px-4 py-3 flex items-center justify-between shadow-md z-30">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-white tracking-wide mr-2">
          DinamiFin
        </span>
        <div className="hidden md:flex gap-4 items-center">
          {navLinks}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold hidden md:inline-block border border-white rounded px-2 py-1 bg-[#223B54]">
          {user ? user.username : "Invitado"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-[#F39C12] text-[#1F3B4D] font-bold px-4 py-1 rounded border-2 border-white hover:bg-white hover:text-[#F39C12] transition hidden md:inline-block shadow-lg"
        >
          Cerrar sesión
        </button>
        {/* Menú hamburguesa para móviles */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {/* Menú desplegable para móviles */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1F3B4D] flex flex-col items-center py-4 shadow-lg md:hidden animate-fade-in z-40">
          {navLinks}
          <span className="text-white font-semibold mb-2 border border-white rounded px-2 py-1 bg-[#223B54]">
            {user ? user.username : "Invitado"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-[#F39C12] text-[#1F3B4D] font-bold px-4 py-1 rounded border-2 border-white hover:bg-white hover:text-[#F39C12] transition mb-2 shadow-lg"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

