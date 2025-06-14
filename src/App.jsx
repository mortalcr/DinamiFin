import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardHistorico from "./pages/DashboardHistorico";
import Navbar from "./components/Navbar";
import ImportarDatos from "./components/ImportarDatos";

function App() {
  const token = localStorage.getItem("token");

  return (
    <UserProvider>
      <Router>
        <Navbar />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboardHistorico" element={<DashboardHistorico />} />
        <Route
          path="/importar"
          element={
            <ProtectedRoute>
              <ImportarDatos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

