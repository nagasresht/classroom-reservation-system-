import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to validate user session
 * @param {boolean} requireAdmin - Whether admin role is required
 * @returns {object|null} - User object if valid, null otherwise
 */
export const useAuth = (requireAdmin = false) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = () => {
      try {
        const userString = localStorage.getItem('user');
        
        if (!userString) {
          console.warn('No user session found');
          navigate('/', { replace: true });
          return null;
        }

        const user = JSON.parse(userString);

        // Validate required fields
        if (!user.email || !user.name) {
          console.error('Invalid user session - missing required fields');
          localStorage.removeItem('user');
          navigate('/', { replace: true });
          return null;
        }

        // Check admin role if required
        if (requireAdmin) {
          const isAdmin = user.role === 'admin' || user.email.toLowerCase().endsWith('@admin.com');
          
          if (!isAdmin) {
            console.warn('Unauthorized: Admin access required');
            navigate('/dashboard', { replace: true });
            return null;
          }
        }

        return user;
      } catch (error) {
        console.error('Session validation error:', error);
        localStorage.removeItem('user');
        navigate('/', { replace: true });
        return null;
      }
    };

    validateSession();
  }, [navigate, requireAdmin]);

  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch {
    return null;
  }
};
