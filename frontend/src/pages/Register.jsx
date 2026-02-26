import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/student/register', formData);
      login(response.data.student, response.data.token);
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: '10px' }} className="p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">Create Account</h2>
            <p className="text-slate-400 text-sm">Fill in your details to register.</p>
          </div>

          {error && (
            <div style={{ background: '#2a1a1a', border: '1px solid #7f1d1d', borderRadius: '8px' }} className="mb-6 p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="handmade-input pl-11"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="handmade-input pl-11"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="handmade-input pl-11"
                  placeholder="Enter a password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: '#6366f1', borderRadius: '8px', width: '100%' }}
              className="flex items-center justify-center gap-2 text-white font-bold py-3 mt-2 hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-white font-semibold">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
