import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import DashboardHistorico from "./pages/DashboardHistorico";
import ImportarDatos from "./components/ImportarDatos";
import Perfil from "./pages/Perfil"; 

import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Redirección raíz */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboardHistorico"
            element={
              <ProtectedRoute>
                <DashboardHistorico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/importar"
            element={
              <ProtectedRoute>
                <ImportarDatos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          {/* Fallback: cualquier ruta no encontrada */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

