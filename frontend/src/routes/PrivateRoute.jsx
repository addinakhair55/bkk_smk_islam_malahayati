import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika token tidak ada atau role tidak sesuai dengan yang dibutuhkan
  if (!token || !role || (requiredRole && requiredRole !== role)) {
    return <Navigate to="/auth/login" />;
  }

  // Jika role sesuai, tampilkan komponen yang diminta
  return children;
};

export default PrivateRoute;
