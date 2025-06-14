// src/components/Navbar.jsx
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
    </nav>
  );
}

export default Navbar;

