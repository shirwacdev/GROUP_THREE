import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Student pages
import Categories from './pages/Categories';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
 
// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageQuestions from './pages/admin/ManageQuestions';
import ManageUsers from './pages/admin/ManageUsers';
import AdminLeaderboard from './pages/admin/Leaderboard';

// Guards
const AdminGuard = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" />;
  return <Outlet />;
};

const StudentGuard = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  
  // If not logged in, redirect to login page
  if (!user) return <Navigate to="/login" />;
  
  return <Outlet />;
};

const Spinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111118' }}>
    <div style={{ width: 36, height: 36, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

const PublicLayout = () => (
  <div style={{ background: '#111118', minHeight: '100vh' }}>
    <nav style={{ background: '#16161f', borderBottom: '1px solid #2a2a3a', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>QuizMaster</a>
      <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
        <a href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Login</a>
        <a href="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Register</a>
      </div>
    </nav>
    <main><Outlet /></main>
  </div>
);

const router = createBrowserRouter([
  // Public
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/admin/login', element: <AdminLogin /> },
    ],
  },

  // Student (sidebar, publicly accessible)
  {
    element: <StudentGuard />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: '/categories', element: <Categories /> },
          { path: '/quiz', element: <Quiz /> },
          { path: '/leaderboard', element: <Leaderboard /> },
        ],
      },
    ],
  },

  // Admin (sidebar, admin-only)
  {
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/categories', element: <ManageCategories /> },
          { path: '/admin/categories/:catId/questions', element: <ManageQuestions /> },
          { path: '/admin/leaderboard', element: <AdminLeaderboard /> },
          { path: '/admin/students', element: <ManageUsers /> },
          { path: '/admin/questions', element: <Navigate to="/admin/categories" replace /> },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
]);

const App = () => (
  <AuthProvider>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;