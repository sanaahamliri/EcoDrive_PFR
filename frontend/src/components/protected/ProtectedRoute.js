import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = AuthService.getUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'driver':
        return <Navigate to="/driver/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 