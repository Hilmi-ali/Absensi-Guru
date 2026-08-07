import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AdminRoute;
