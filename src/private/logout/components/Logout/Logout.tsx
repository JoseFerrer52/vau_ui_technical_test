import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("nameUser");
      navigate("/sign-in");
    };

    handleLogout();
  }, [navigate]);

  return null;
};
