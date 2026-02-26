import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, PlusCircle, ArrowRight, FolderOpen, Target, Trophy } from 'lucide-react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
      <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const stats_list = [
    { icon: FolderOpen,   label: 'Categories', value: stats?.totalCategories     ?? 0, color: '#6366f1' },
    { icon: FileText,     label: 'Total Questions', value: stats?.totalQuestions   ?? 0, color: '#10b981' },
    { icon: Trophy,       label: 'Top Score Record',  value: stats?.highestScore      ?? 0, color: '#f59e0b' },
    { icon: Users,        label: 'Total Users',    value: stats?.totalStudents     ?? 0, color: '#ec4899' },
  ];

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ color: 'white', fontWeight: 900, fontSize: 24, marginBottom: 4 }}>System Overview</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Real-time statistics for your quiz platform.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/admin/categories" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700 }}>
              <PlusCircle style={{ width: 15, height: 15 }} />
              Add Content
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
          {stats_list.map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: color + '12', border: `1px solid ${color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 22, height: 22, color }} />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 900, fontSize: 32, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
                <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, margin: 0 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

          {/* Recent sessions */}
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', gap: 8, background: '#16161f' }}>
              <Target style={{ width: 16, height: 16, color: '#10b981' }} />
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>Recent Activity</p>
            </div>
            <div style={{ minHeight: 180 }}>
              {!stats?.recentScores?.length ? (
                <div style={{ padding: 60, textAlign: 'center' }}>
                  <p style={{ color: '#475569', fontSize: 14 }}>No activity yet.</p>
                </div>
              ) : stats.recentScores.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < stats.recentScores.length - 1 ? '1px solid #111118' : 'none' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.student?.name || 'Deleted User'}</p>
                    <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.category}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 12 }}>
                    <div style={{ background: '#1a1a2e', border: '1px solid #3730a3', color: '#818cf8', borderRadius: 6, padding: '3px 12px', fontWeight: 900, fontSize: 16, display: 'inline-block' }}>
                      {s.score} <span style={{ fontSize: 10, fontWeight: 500 }}>PTS</span>
                    </div>
                    <p style={{ color: '#475569', fontSize: 10, marginTop: 3 }}>
                      {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shortcuts */}
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #2a2a3a', background: '#16161f' }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>Quick Actions</p>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/admin/categories" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111118', border: '1px solid #2a2a3a', borderRadius: 10, padding: '16px 18px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText style={{ width: 16, height: 16, color: '#818cf8' }} />
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 13, margin: 0 }}>Manage Questions</p>
                    <p style={{ color: '#475569', fontSize: 11, margin: '2px 0 0' }}>Add or delete quiz content</p>
                  </div>
                </div>
                <ArrowRight style={{ width: 14, height: 14, color: '#475569' }} />
              </Link>
              <Link to="/admin/students" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111118', border: '1px solid #2a2a3a', borderRadius: 10, padding: '16px 18px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users style={{ width: 16, height: 16, color: '#818cf8' }} />
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 13, margin: 0 }}>Manage Users</p>
                    <p style={{ color: '#475569', fontSize: 11, margin: '2px 0 0' }}>View registered students</p>
                  </div>
                </div>
                <ArrowRight style={{ width: 14, height: 14, color: '#475569' }} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
