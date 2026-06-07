import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PATHS } from '../../common/path';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
