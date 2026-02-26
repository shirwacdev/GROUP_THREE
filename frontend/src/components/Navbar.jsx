import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User, LayoutGrid, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#16161f', borderBottom: '1px solid #2a2a3a' }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-8 h-8 flex items-center justify-center">
            <LayoutGrid className="text-white w-4 h-4" />
          </div>
          <span className="text-white font-bold text-base">QuizMaster</span>
        </Link>

        {/* Nav Links + Auth */}
        <div className="flex items-center gap-6">

          {user && user.role === 'admin' ? (
            <div className="flex items-center gap-5">
              <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-indigo-400 font-semibold text-sm">
                <Shield className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/admin/questions" className="text-slate-400 hover:text-white text-sm font-medium">Questions</Link>
              <Link to="/admin/students" className="text-slate-400 hover:text-white text-sm font-medium">Users</Link>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link to="/leaderboard" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Link>
              <Link to="/categories" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium">
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Categories</span>
              </Link>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-3 ml-2 pl-4" style={{ borderLeft: '1px solid #2a2a3a' }}>
              <div className="flex items-center gap-2">
                <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: '6px' }} className="px-3 py-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: '6px' }}
                className="p-2 text-slate-400 hover:text-red-400"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium">
                Login
              </Link>
              <Link
                to="/register"
                style={{ background: '#6366f1', borderRadius: '8px' }}
                className="text-white font-semibold text-sm px-4 py-2 hover:bg-indigo-500"
              >
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
