import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Target, User, ChevronDown, ChevronUp, CheckCircle2, XCircle, Search } from 'lucide-react';
import api from '../../utils/api';

const AdminLeaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch]     = useState('');

  const fetchLearderboard = async () => {
    try {
      const res = await api.get('/student/leaderboard');
      setEntries(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLearderboard(); }, []);

  const filtered = entries.filter(e => 
    e.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ color: 'white', fontWeight: 900, fontSize: 24, marginBottom: 4 }}>Leaderboard & History</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>View all quiz submissions and history.</p>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#475569' }} />
            <input 
              type="text" 
              placeholder="Search student or category..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 8, padding: '9px 12px 9px 34px', color: 'white', fontSize: 13, width: '100%', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
            <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, padding: 60, textAlign: 'center' }}>
            <Trophy style={{ width: 42, height: 42, color: '#2a2a3a', margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontSize: 15 }}>No submissions found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((entry) => (
              <div key={entry._id} style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
                <div 
                  className="mobile-column"
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                  onClick={() => setExpanded(expanded === entry._id ? null : entry._id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, background: '#111118', border: '1px solid #2a2a3a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User style={{ width: 18, height: 18, color: '#818cf8' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'white', fontWeight: 800, fontSize: 15, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.student?.name || 'Deleted User'}</p>
                      <p style={{ color: '#64748b', fontSize: 12, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.category} · {new Date(entry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }} className="mobile-width-full">
                    <div style={{ textAlign: 'right', flex: 1 }}>
                      <p style={{ color: '#64748b', fontSize: 10, margin: 0, textTransform: 'uppercase' }}>Score</p>
                      <p style={{ color: '#10b981', fontWeight: 900, fontSize: 18, margin: 0 }}>{entry.score}</p>
                    </div>
                    <div style={{ textAlign: 'right', flex: 1 }}>
                      <p style={{ color: '#64748b', fontSize: 10, margin: 0, textTransform: 'uppercase' }}>Time</p>
                      <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>{entry.timeTaken}s</p>
                    </div>
                    {expanded === entry._id ? <ChevronUp style={{ color: '#475569' }} /> : <ChevronDown style={{ color: '#475569' }} />}
                  </div>
                </div>

                {expanded === entry._id && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid #111118', background: '#16161f' }}>
                    <div style={{ marginTop: 16 }}>
                      <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Question History</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {entry.history?.map((h, i) => (
                          <div key={i} className="mobile-column" style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 12 }}>
                            <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                               {h.isCorrect ? <CheckCircle2 style={{ width: 16, height: 16, color: '#10b981', flexShrink: 0 }} /> : <XCircle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0 }} />}
                               <div style={{ flex: 1 }}>
                                 <p style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: 0 }}>{h.question}</p>
                                 <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                                   <p style={{ color: h.isCorrect ? '#10b981' : '#ef4444', fontSize: 11, margin: 0 }}><b>Ans:</b> {h.selected || 'N/A'}</p>
                                   {!h.isCorrect && <p style={{ color: '#6366f1', fontSize: 11, margin: 0 }}><b>Cor:</b> {h.correct}</p>}
                                   <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>Pts: {h.points}</p>
                                 </div>
                               </div>
                            </div>
                          </div>
                        ))}
                        {(!entry.history || entry.history.length === 0) && (
                          <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', padding: 20 }}>No details available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 639px) {
           .mobile-width-full { width: 100%; border-top: 1px solid #111118; padding-top: 12px; margin-top: 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminLeaderboard;
