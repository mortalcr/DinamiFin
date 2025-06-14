import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return null; 
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
}

