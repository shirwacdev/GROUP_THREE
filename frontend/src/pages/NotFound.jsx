import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111118', padding: '24px' }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        
        <div style={{ width: 64, height: 64, background: '#2a1a1a', border: '1px solid #7f1d1d', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <AlertTriangle style={{ width: 32, height: 32, color: '#ef4444' }} />
        </div>

        <h1 style={{ color: 'white', fontWeight: 900, fontSize: 32, marginBottom: 8 }}>404</h1>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Page Not Found</p>
        <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved to a new category-based system.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link 
            to="/" 
            style={{ 
              background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '14px', 
              fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 
            }}
          >
            <Home style={{ width: 16, height: 16 }} /> Go Home
          </Link>
          
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              background: '#1c1c28', border: '1px solid #2a2a3a', color: '#cbd5e1', borderRadius: 10, padding: '14px', 
              fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Go Back
          </button>
        </div>

        <p style={{ marginTop: 40, color: '#334155', fontSize: 12 }}>
          Admin? Visit the <Link to="/admin/categories" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Categories</Link> page to manage content.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
