import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";

function AdminRequire({ children }) {
  const location = useLocation();
  const { user, isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.data?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRequire;
