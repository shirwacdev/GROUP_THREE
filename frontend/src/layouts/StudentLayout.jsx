import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, Trophy, User, LogOut, ChevronLeft, ChevronRight, Home, Menu, X } from 'lucide-react';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/categories', label: 'Categories', icon: LayoutGrid },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#111118' }}>

      {/* Mobile Header */}
      <div 
        className="lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-40"
        style={{ background: '#16161f', borderBottom: '1px solid #2a2a3a' }}
      >
        <div className="flex items-center gap-2">
          <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-7 h-7 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">QuizMaster</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {mobileOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45, backdropFilter: 'blur(2px)' }} 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? '60px' : '200px',
          background: '#16161f',
          borderRight: '1px solid #2a2a3a',
          transition: 'width 0.2s, transform 0.2s',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          position: mobileOpen ? 'fixed' : 'relative',
          height: mobileOpen ? '100vh' : 'auto',
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : (window.innerWidth < 1024 ? 'translateX(-100%)' : 'translateX(0)'),
        }}
        className="student-sidebar"
      >
        {/* Logo (Hidden on mobile sidebar, use mobile header) */}
        <div style={{ borderBottom: '1px solid #2a2a3a', padding: '16px 12px' }} className="hidden lg:flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-7 h-7 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">QuizMaster</span>
            </div>
          )}
          {collapsed && (
            <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-7 h-7 flex items-center justify-center mx-auto">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            className="text-slate-400 hover:text-white ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Spacer */}
        <div className="lg:hidden h-16" />

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  background: active ? '#1e1e30' : 'transparent',
                  border: active ? '1px solid #3730a3' : '1px solid transparent',
                  color: active ? '#818cf8' : '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {(!collapsed || mobileOpen) && label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {user ? (
          <div style={{ borderTop: '1px solid #2a2a3a', padding: '12px' }}>
            {(!collapsed || mobileOpen) && (
              <div className="mb-2 px-2">
                <p className="text-slate-500 text-xs">Signed in as</p>
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid #2a2a3a',
                color: '#94a3b8',
                cursor: 'pointer',
                width: '100%',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <LogOut className="w-4 h-4 shrink-0 text-red-400" />
              {(!collapsed || mobileOpen) && 'Logout'}
            </button>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #2a2a3a', padding: '12px' }} className="space-y-2">
            <Link
              to="/login"
              style={{
                display: 'block',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #2a2a3a',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {(!collapsed || mobileOpen) ? 'Login' : <User className="w-4 h-4 mx-auto" />}
            </Link>
            {(!collapsed || mobileOpen) && (
              <Link
                to="/register"
                style={{
                  display: 'block',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: '#6366f1',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Register
              </Link>
            )}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 1023px) {
          .student-sidebar {
            position: fixed !important;
            transform: translateX(-100%);
          }
          .student-sidebar[style*="translateX(0)"] {
             transform: translateX(0) !important;
             width: 220px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentLayout;
