// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

export default function Navbar() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1F3B4D] px-8 py-3 flex items-center justify-between shadow-md z-30">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-white tracking-wide">
          DinamiFin
        </span>
        <Link to="/dashboard" className="text-white hover:text-[#F39C12] transition">
          Dashboard
        </Link>
        <Link to="/dashboardHistorico" className="text-white hover:text-[#F39C12] transition">
          Histórico
        </Link>
        <Link to="/mesActual" className="text-white hover:text-[#F39C12] transition">
          Mes Actual
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-white font-semibold">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-[#E74C3C] text-white px-4 py-1 rounded hover:bg-[#C0392B] transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
