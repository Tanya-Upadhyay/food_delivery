
import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Auth() {
  const token = localStorage.getItem('authToken');
  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }, [token]);

  return { user };
}
