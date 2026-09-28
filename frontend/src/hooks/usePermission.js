// import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
export const usePermission = () => {
  // const { user } = useAuth();
const user = useSelector((state) => state.auth.user);


  const hasPermission = (requiredPermission) => {
    if (!user) return false;

    const systemRoleSlug = typeof user.systemRole === 'string' 
      ? user.systemRole 
      : user.systemRole?.slug;
      
    if (systemRoleSlug === 'SUPER_ADMIN') return true;

    const userPermissions = user.permissions || [];

    if (Array.isArray(userPermissions)) {
      return userPermissions.includes(requiredPermission);
    }

    return false;
  };

  return { hasPermission };
};