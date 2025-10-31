import { useMemo } from 'react';

export const useAuth = () => {
  const token = localStorage.getItem('token');

  const isLoggedIn = useMemo(() => !!token, [token]);

  return { isLoggedIn, token };
};