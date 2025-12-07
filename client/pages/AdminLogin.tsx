
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/DataContext';
import { Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  // Handle redirects and notifications
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      return;
    }
    if (location.state?.message) {
      toast.error(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [isAuthenticated, navigate, from, location.state]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      if (res.data.token) {
        login(res.data.token, res.data.email);
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-canvas dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary dark:text-blue-300">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-dark dark:text-white">Admin Access</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to manage content</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              {...register('email', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="admin@worriedweb.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              {...register('password', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-primary/90 dark:hover:bg-blue-700 transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
