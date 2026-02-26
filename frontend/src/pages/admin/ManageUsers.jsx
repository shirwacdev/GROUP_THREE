import React, { useState, useEffect } from 'react';
import { Trash2, Search, Mail, Calendar, UserX, UserMinus, UserCheck, Shield, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  const fetchStudents = () => {
    setLoading(true);
    api.get('/admin/students')
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student and all their quiz scores?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async (student) => {
    const newStatus = student.status === 'active' ? 'pending' : 'active';
    try {
      await api.put(`/admin/students/${student._id}/status`, { status: newStatus });
      setStudents(prev => prev.map(s => s._id === student._id ? { ...s, status: newStatus } : s));
    } catch (err) { console.error(err); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Users</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>{students.length} registered students</p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#475569' }} />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: '#1c1c28',
                border: '1px solid #2a2a3a',
                borderRadius: 8,
                padding: '9px 12px 9px 32px',
                color: '#e2e8f0',
                fontSize: 13,
                width: '100%',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, padding: 48, textAlign: 'center' }}>
            <UserX style={{ width: 32, height: 32, color: '#2a2a3a', margin: '0 auto 12px' }} />
            <p style={{ color: '#475569', fontSize: 14 }}>No students found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Table Header (Hidden on Mobile) */}
            <div className="mobile-hide" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 100px 100px auto', gap: 12, padding: '10px 16px', background: '#111118', border: '1px solid #2a2a3a', borderRadius: '10px 10px 0 0' }}>
               {['Name', 'Email', 'Status', 'Joined', ''].map((h, i) => (
                <span key={i} style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((student, i) => (
                <div
                  key={student._id}
                  className="mobile-column"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 100px 100px auto',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#1c1c28',
                    border: '1px solid #2a2a3a',
                    borderRadius: 10,
                    opacity: student.status === 'pending' ? 0.7 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  {/* Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: student.status === 'active' ? '#1a1a2e' : '#1a1414', border: `1px solid ${student.status === 'active' ? '#3730a3' : '#7f1d1d'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: student.status === 'active' ? '#818cf8' : '#f87171', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: 'white', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</span>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail className="mobile-hide" style={{ width: 13, height: 13, color: '#44403c' }} />
                    <span style={{ color: '#64748b', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.email}</span>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 4, 
                      fontSize: 10, 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      padding: '2px 8px', 
                      borderRadius: 100, 
                      background: student.status === 'active' ? '#10b98115' : '#ef444415', 
                      color: student.status === 'active' ? '#10b981' : '#ef4444',
                      border: `1px solid ${student.status === 'active' ? '#10b98130' : '#ef444430'}`
                    }}>
                      {student.status === 'active' ? <Shield className="w-2.5 h-2.5" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                      {student.status || 'active'}
                    </span>
                  </div>

                  {/* Joined */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar className="mobile-hide" style={{ width: 13, height: 13, color: '#44403c' }} />
                    <span style={{ color: '#475569', fontSize: 12 }}>{new Date(student.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }} className="mobile-width-full">
                    <button
                      onClick={() => toggleStatus(student)}
                      title={student.status === 'active' ? 'Deactivate (Pend)' : 'Activate'}
                      style={{ 
                        background: student.status === 'active' ? '#f59e0b15' : '#10b98115', 
                        border: `1px solid ${student.status === 'active' ? '#f59e0b50' : '#10b98150'}`, 
                        color: student.status === 'active' ? '#f59e0b' : '#10b981', 
                        borderRadius: 6, padding: '6px', cursor: 'pointer' 
                      }}
                    >
                      {student.status === 'active' ? <UserMinus style={{ width: 14, height: 14 }} /> : <UserCheck style={{ width: 14, height: 14 }} />}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(student._id)}
                      title="Delete student"
                      style={{ background: '#ef444415', border: '1px solid #ef444450', color: '#ef4444', borderRadius: 6, padding: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 639px) {
           .mobile-column { grid-template-columns: 1fr !important; gap: 8px !important; }
           .mobile-width-full { width: 100% !important; border-top: 1px solid #111118; padding-top: 12px; margin-top: 4px; }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
