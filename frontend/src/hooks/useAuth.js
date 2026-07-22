import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    hasRole,
    role: user?.role,
  };
};
