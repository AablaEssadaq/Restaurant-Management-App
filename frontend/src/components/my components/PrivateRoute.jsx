import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Recommended PrivateRoute implementation
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    // Important: Redirect to /login, not /unauthorized
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;