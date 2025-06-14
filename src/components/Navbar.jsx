
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-[#1F3B4D] text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">DinamiFin</h1>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="font-medium hover:underline"
        >
          {user.username || user.sub}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-[#1F3B4D] rounded shadow-lg z-10">
            <button
              className="block px-4 py-2 hover:bg-[#f4f4f4] w-full text-left"
              onClick={() => {
                setIsOpen(false);
                navigate("/perfil");
              }}
            >
              Ajustes de usuario
            </button>
            <button
              className="block px-4 py-2 hover:bg-[#f4f4f4] w-full text-left"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
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

export default Navbar;

