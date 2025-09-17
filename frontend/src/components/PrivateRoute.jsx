import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render the children components
  return children;
};

export default PrivateRoute;