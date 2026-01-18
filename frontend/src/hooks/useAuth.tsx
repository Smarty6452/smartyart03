import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token
      axios.get(`${import.meta.env.VITE_API_BASE}/auth/verify`)
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      toast({ title: 'Welcome back!' });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Login failed', variant: 'destructive' });
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/signup`, { email, password, fullName });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      toast({ title: 'Account created!' });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Signup failed', variant: 'destructive' });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/auth/forgot-password`, { email });
      toast({ title: 'Reset link sent to email!' });
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/');
  };

  return { user, loading, login, signup, forgotPassword, signOut };
};