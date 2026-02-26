import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Monitor, Globe, BookOpen, FlaskConical, Landmark, Map, Music, Film, HelpCircle, BrainCircuit } from 'lucide-react';

const categoryMeta = {
  'Computers':   { icon: Monitor,     color: '#6366f1' },
  'Science':     { icon: FlaskConical, color: '#10b981' },
  'History':     { icon: Landmark,     color: '#f59e0b' },
  'Geography':   { icon: Map,          color: '#3b82f6' },
  'Art':         { icon: BookOpen,     color: '#ec4899' },
  'General':     { icon: HelpCircle,   color: '#64748b' },
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/student/categories')
      .then(res => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (cat) => {
    navigate('/quiz', { state: { categoryId: cat._id, categoryName: cat.name } });
  };

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Pick a Category</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Select a topic created by the admin to start. Each correct answer helps you climb the leaderboard.
          </p>
          {!user && (
            <p style={{ color: '#f59e0b', fontSize: 13, marginTop: 12, padding: '10px 14px', background: '#1c1a10', border: '1px solid #78350f', borderRadius: 8, display: 'inline-block' }}>
              Guest mode — <a href="/register" style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'none' }}>Register</a> to save your progress
            </p>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
            <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, padding: 60, textAlign: 'center' }}>
            <BrainCircuit style={{ width: 48, height: 48, color: '#2a2a3a', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontSize: 15 }}>No categories published yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }} className="mobile-grid-1">
            {categories.map((cat) => {
              const meta = categoryMeta[cat.name] || { icon: HelpCircle, color: '#6366f1' };
              const Icon = meta.icon;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleSelect(cat)}
                  style={{
                    background: '#1c1c28',
                    border: '1px solid #2a2a3a',
                    borderRadius: 12,
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    transition: 'transform 0.1s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#2a2a3a';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ width: 42, height: 42, background: '#1a1a2e', border: '1px solid #3730a3', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 20, height: 20, color: '#818cf8' }} />
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: 16, margin: 0 }}>{cat.name}</p>
                    <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>
                      {cat.questionCount || 0} Questions
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
