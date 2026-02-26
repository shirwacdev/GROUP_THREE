import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Trophy, BookOpen, Users, Star, CheckCircle, Zap, Lightbulb, Flame } from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a1a2e', border: '1px solid #3730a3', borderRadius: '40px', padding: '6px 16px', marginBottom: 24 }}>
            <Star style={{ width: 14, height: 14, color: '#f59e0b', fill: '#f59e0b' }} />
            <span style={{ color: '#818cf8', fontSize: 13, fontWeight: 700 }}>New: Lifelines & Streaks added</span>
          </div>

          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
            The Ultimate <span style={{ color: '#6366f1' }}>Quiz Platform</span> for Knowledge Hunters
          </h1>

          <p style={{ color: '#64748b', fontSize: 18, marginBottom: 40, maxW: 600, marginInline: 'auto' }}>
            Answer multiple-choice questions across categories managed by experts. Use lifelines to survive and build streaks for massive bonus points.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to="/categories"
              style={{ background: '#6366f1', color: 'white', fontWeight: 800, textDecoration: 'none', borderRadius: 10, padding: '16px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
            >
              <Rocket style={{ width: 20, height: 20 }} />
              Browse Categories
            </Link>
            <Link
              to="/register"
              style={{ background: '#1c1c28', color: 'white', fontWeight: 700, textDecoration: 'none', borderRadius: 10, border: '1px solid #2a2a3a', padding: '16px 32px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Join the Leaderboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 80 }}>
          {[
            { icon: Lightbulb, color: '#f59e0b', title: 'Smart Lifelines', desc: 'Stuck on a question? Use the "Hint" or "50/50" lifelines to keep your streak alive.' },
            { icon: Flame, color: '#ef4444', title: 'Streak Bonuses', desc: 'Answer 3 or more correctly in a row to earn multiplier points and climb faster.' },
            { icon: Trophy, color: '#10b981', title: 'Global Rankings', desc: 'Compete for the top spot on our real-time leaderboard. Every second counts.' },
          ].map((f, i) => (
            <div key={i} style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 16, padding: '32px 24px' }}>
              <div style={{ width: 48, height: 48, background: f.color + '12', border: `1px solid ${f.color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon style={{ width: 24, height: 24, color: f.color }} />
              </div>
              <h3 style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Panel */}
        <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 20, padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Ready to test your brain?</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>No installation required. Play for free directly in your browser.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', itemsCenter: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
              <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} /> 10+ Categories
            </div>
            <div style={{ display: 'flex', itemsCenter: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
              <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} /> Real-time results
            </div>
            <div style={{ display: 'flex', itemsCenter: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
              <CheckCircle style={{ width: 16, height: 16, color: '#10b981' }} /> Admin moderated
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;
