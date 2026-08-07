import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function TeacherRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile?.role !== "guru") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default TeacherRoute;
