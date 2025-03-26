import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../../services/authService";

const PublicRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getUser();

  if (isAuthenticated) {
    switch (user?.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "driver":
        return <Navigate to="/driver/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
