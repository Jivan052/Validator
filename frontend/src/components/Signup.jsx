import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page since we're consolidating to Google auth only
    navigate("/login");
  }, [navigate]);

  // Render a simple loading component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <p className="text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default Signup;