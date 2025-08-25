import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // check if token exists
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
