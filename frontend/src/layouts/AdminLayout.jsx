import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut, ChevronLeft, ChevronRight, Shield, FolderOpen, Trophy, Menu, X } from 'lucide-react';

const AdminLayout = () => {
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
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/leaderboard', label: 'History', icon: Trophy },
    { path: '/admin/students', label: 'Users', icon: Users },
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
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Admin</span>
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
        <div className="sidebar-overlay lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${!mobileOpen ? 'sidebar-collapsed lg:sidebar-expanded' : ''}`}
        style={{
          width: collapsed ? '60px' : '220px',
          background: '#16161f',
          borderRight: '1px solid #2a2a3a',
          transition: 'width 0.2s, transform 0.2s',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          position: mobileOpen ? 'fixed' : 'relative',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 50,
        }}
      >
        {/* Toggle but hidden on mobile - we use mobile header instead */}
        <div style={{ borderBottom: '1px solid #2a2a3a', padding: '16px 12px' }} className="hidden lg:flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-7 h-7 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">Admin Panel</span>
            </div>
          )}
          {collapsed && (
            <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-7 h-7 flex items-center justify-center mx-auto">
              <Shield className="w-4 h-4 text-white" />
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

        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden p-4 border-b border-[#2a2a3a] mb-2">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Navigation</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
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

        {/* User + Logout */}
        <div style={{ borderTop: '1px solid #2a2a3a', padding: '12px' }}>
          {(!collapsed || mobileOpen) && (
            <div className="mb-2 px-2">
              <p className="text-slate-500 text-xs">Logged in as</p>
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
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
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-[1200px] mx-auto min-h-full">
           <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 1023px) {
          .sidebar-container {
            position: fixed !important;
            height: 100vh !important;
            z-index: 50 !important;
            left: 0 !important;
            top: 0 !important;
          }
          .sidebar-expanded {
             transform: translateX(0) !important;
             width: 240px !important;
          }
          .sidebar-collapsed {
             transform: translateX(-100%) !important;
          }
        }
        @media (min-width: 1024px) {
           .sidebar-container {
              transform: translateX(0) !important;
              position: relative !important;
           }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
