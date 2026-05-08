import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // true until auth check done

  // On mount: if token exists, fetch profile to restore user object
  useEffect(() => {
    const restoreUser = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await API.get('/users/profile');
        setUser(res.data);
      } catch {
        // Token expired or invalid — clear it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
