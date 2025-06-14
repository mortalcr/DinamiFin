import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return null; 

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

