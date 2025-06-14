import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  return !user ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;

