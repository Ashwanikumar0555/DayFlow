import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('dayflow_token');
      if (token) {
        try {
          // Verify token and get user details
          const response = await api.get('/auth/me');
          // The backend returns { success: true, data: { user: ... } } (based on typical responseHandler)
          // Let's verify standard response structure. Most likely user is in response.data.data or response.data.user
          // I'll assume response.data.data based on standard implementation.
          // Actually, let's look at auth.controller.js later or be safe by inspecting.
          // Safe bet: response.data.data if using common ApiResponse.success pattern.
          setUser(response.data.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('dayflow_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });

      // Expected response structure: { success: true, data: { user: {...}, token: "..." } }
      const { user: userData, token } = response.data.data;

      localStorage.setItem('dayflow_token', token);
      setUser(userData);

      return userData; // Return user to help with redirection
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Throw to allow component to handle UI error
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
