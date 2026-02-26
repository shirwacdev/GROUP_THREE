import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Target, Trophy } from 'lucide-react';
import api from '../utils/api';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/leaderboard')
      .then(res => setEntries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const medal = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Leaderboard</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Top scores from all quiz sessions.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : entries.length === 0 ? (
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, padding: 48, textAlign: 'center' }}>
            <Trophy style={{ width: 36, height: 36, color: '#2a2a3a', margin: '0 auto 12px' }} />
            <p style={{ color: '#64748b', fontSize: 15, fontWeight: 600 }}>No scores yet</p>
            <p style={{ color: '#374151', fontSize: 13, marginTop: 4 }}>Be the first to complete a quiz!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.map((entry, i) => (
              <div
                key={entry._id}
                style={{
                  background: i < 3 ? '#1a1a2e' : '#1c1c28',
                  border: `1px solid ${i < 3 ? '#3730a3' : '#2a2a3a'}`,
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                {/* Rank */}
                <div style={{ width: 36, textAlign: 'center', fontSize: i < 3 ? 20 : 13, fontWeight: 700, color: i < 3 ? 'white' : '#64748b', flexShrink: 0 }}>
                  {medal(i)}
                </div>

                {/* Name + category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.student?.name || 'Anonymous'}
                  </p>
                  <p style={{ color: '#64748b', fontSize: 12, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.category}
                  </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 11 }}>
                    <Target style={{ width: 12, height: 12 }} />
                    {entry.totalQuestions}Q
                  </div>
                  <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 11 }}>
                    <Clock style={{ width: 12, height: 12 }} />
                    {entry.timeTaken}s
                  </div>
                  <div style={{ background: i < 3 ? '#4f46e5' : '#111118', border: i < 3 ? 'none' : '1px solid #2a2a3a', color: 'white', fontWeight: 900, fontSize: 14, borderRadius: 8, padding: '4px 10px', minWidth: 42, textAlign: 'center' }}>
                    {entry.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
