import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, LogOut, ChevronRight, BarChart2, Target, Percent, Lightbulb, Zap, Flame } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TIMER_SECONDS = 30;

const Quiz = () => {
  const location = useLocation();
  const categoryId   = location.state?.categoryId;
  const categoryName = location.state?.categoryName;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions]     = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayAnswers, setDisplayAnswers] = useState([]);
  const [selected, setSelected]       = useState(null); 
  const [score, setScore]             = useState(0);
  const [streak, setStreak]           = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [timeLeft, setTimeLeft]       = useState(TIMER_SECONDS);
  const [finished, setFinished]       = useState(false);
  const [loading, setLoading]         = useState(true);
  const [history, setHistory]         = useState([]);

  // Lifelines
  const [lifelines, setLifelines] = useState({ hint: true, fiftyFifty: true });
  const [showHint, setShowHint]   = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState([]);

  const timerRef = useRef(null);
  const advancingRef = useRef(false);

  const fetchBatch = useCallback(async () => {
    try {
      const res = await api.get(`/student/questions?category=${categoryId}&limit=12`);
      if (res.data.length > 0) {
        setQuestions(res.data);
      } else {
        alert('No questions found in this category.');
        navigate('/categories');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    if (!categoryId) { navigate('/categories'); return; }
    fetchBatch();
  }, [categoryId, fetchBatch, navigate]);

  useEffect(() => {
    if (questions.length === 0 || currentIndex >= questions.length) {
      if (!loading && questions.length > 0 && currentIndex >= questions.length) {
        setFinished(true);
        saveScore();
      }
      return;
    }
    const q = questions[currentIndex];
    const all = [q.correct_answer, ...q.incorrect_answers];
    setDisplayAnswers(all.sort(() => Math.random() - 0.5));
    setSelected(null);
    setShowHint(false);
    setHiddenAnswers([]);
    setTimeLeft(TIMER_SECONDS);
    advancingRef.current = false;
  }, [currentIndex, questions, loading]);

  useEffect(() => {
    if (finished || selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAdvance(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, selected, finished]);

  const handleAdvance = (answer) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    clearInterval(timerRef.current);

    const q = questions[currentIndex];
    const isCorrect = answer === q.correct_answer;
    
    let pointsToAdd = 0;
    if (isCorrect) {
      // Base points
      pointsToAdd = 10;

      // SPEED BONUS: If answer in < 10 seconds (timeLeft > 20)
      const speedBonus = timeLeft > 20 ? 5 : 0;
      pointsToAdd += speedBonus;

      // STREAK MULTIPLIER: 3 correct = x2, 6 correct = x3
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      let multiplier = 1;
      if (newStreak >= 6) multiplier = 3;
      else if (newStreak >= 3) multiplier = 2;

      pointsToAdd = pointsToAdd * multiplier;
      
      setBonusPoints(prev => prev + (pointsToAdd - 10)); // Track anything over base 10
      setScore(s => s + pointsToAdd);
    } else {
      setStreak(0);
    }

    setSelected(answer ?? 'TIMEOUT');
    setHistory(h => [...h, { 
      question: q.question, 
      selected: answer, 
      correct: q.correct_answer, 
      isCorrect,
      points: pointsToAdd
    }]);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setFinished(true);
        let finalScore = score + pointsToAdd;
        
        // PERFECT SCORE BONUS: If accuracy is 100%
        const currentHistory = [...history, { 
          question: q.question, selected: answer, correct: q.correct_answer, isCorrect, points: pointsToAdd
        }];
        const isPerfect = currentHistory.every(h => h.isCorrect);
        if (isPerfect) {
          finalScore += 50;
          setBonusPoints(prev => prev + 50);
        }

        saveScore(finalScore, currentHistory);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 1600);
  };

  const saveScore = async (finalScore = score, finalHistory = history) => {
    if (!user) return;
    try {
      await api.post('/student/submit-score', {
        studentId: user.id,
        score: finalScore,
        category: categoryName,
        totalQuestions: questions.length,
        timeTaken: (TIMER_SECONDS * (currentIndex + 1)) - timeLeft,
        history: finalHistory
      });
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const useLifeline = (type) => {
    if (!lifelines[type] || selected !== null) return;
    
    if (type === 'hint') {
      setShowHint(true);
      setLifelines(prev => ({ ...prev, hint: false }));
    } else if (type === 'fiftyFifty') {
      const q = questions[currentIndex];
      const incorrects = displayAnswers.filter(a => a !== q.correct_answer);
      const toHide = incorrects.sort(() => Math.random() - 0.5).slice(0, 2);
      setHiddenAnswers(toHide);
      setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111118' }}>
      <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (finished) {
    const accuracy = history.length > 0 ? Math.round((history.filter(h => h.isCorrect).length / history.length) * 100) : 0;
    
    // RANK CALCULATION
    let rank = "Beginner";
    if (score >= 300) rank = "Legendary Master";
    else if (score >= 200) rank = "Mastermind";
    else if (score >= 100) rank = "Quiz Genius";
    else if (score >= 50) rank = "Scholar";

    return (
      <div className="mobile-padding-sm" style={{ padding: '40px 24px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: '#1a1a2e', border: '2px solid #3730a3', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Zap style={{ width: 32, height: 32, color: '#818cf8' }} />
          </div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: 28, marginBottom: 8 }}>{rank}!</h2>
          <p style={{ color: '#64748b' }}>Quiz complete in <b>{categoryName}</b></p>
        </div>

        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, padding: '20px 10px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Score</p>
            <p style={{ color: 'white', fontWeight: 900, fontSize: 24, margin: 0 }}>{score}</p>
            {bonusPoints > 0 && <p style={{ color: '#10b981', fontSize: 10, marginTop: 4 }}>+{bonusPoints} Bonus</p>}
          </div>
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, padding: '20px 10px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Accuracy</p>
            <p style={{ color: 'white', fontWeight: 900, fontSize: 24, margin: 0 }}>{accuracy}%</p>
          </div>
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, padding: '20px 10px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Streak</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Flame style={{ width: 16, height: 16, color: '#f59e0b' }} />
              <p style={{ color: 'white', fontWeight: 900, fontSize: 24, margin: 0 }}>{history.reduce((max, h) => h.isCorrect ? Math.max(max, streak) : max, 0)}</p>
            </div>
          </div>
        </div>

        <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #2a2a3a', background: '#16161f' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>Question Summary</p>
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {history.map((h, i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: i < history.length - 1 ? '1px solid #111118' : 'none', display: 'flex', gap: 12 }}>
                {h.isCorrect ? <CheckCircle2 style={{ width: 18, height: 18, color: '#10b981', flexShrink: 0 }} /> : <XCircle style={{ width: 18, height: 18, color: '#ef4444', flexShrink: 0 }} />}
                <div>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{h.question}</p>
                  <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>
                    {h.isCorrect ? `Correct: ${h.selected}` : `Correct: ${h.correct} (You: ${h.selected === 'TIMEOUT' ? 'Time out' : h.selected})`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/categories')} style={{ width: '100%', background: '#6366f1', color: 'white', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
          Back to Categories
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="mobile-padding-sm" style={{ padding: '24px', maxWidth: 680, margin: '0 auto' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{categoryName}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock style={{ width: 14, height: 14, color: timeLeft <= 10 ? '#ef4444' : '#6366f1' }} />
              <span style={{ color: timeLeft <= 10 ? '#ef4444' : 'white', fontWeight: 800, fontSize: 16 }}>{timeLeft}s</span>
            </div>
            {streak >= 3 && (
              <div style={{ background: '#2a1a10', border: '1px solid #f59e0b', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame style={{ width: 14, height: 14, color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>x{streak}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Your Score</p>
          <p style={{ color: 'white', fontWeight: 900, fontSize: 24, margin: 0 }}>{score}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: '#1c1c28', height: 6, borderRadius: 10, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#6366f1', width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Question Card */}
      <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 16, padding: '32px 24px', marginBottom: 20, textAlign: 'center' }}>
        <p style={{ color: 'white', fontSize: 20, fontWeight: 800, lineHeight: 1.4, margin: 0 }}>{q.question}</p>
        
        {showHint && q.hint && (
          <div style={{ marginTop: 20, padding: '12px', background: '#1a1910', border: '1px solid #f59e0b40', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <Lightbulb style={{ width: 16, height: 16, color: '#f59e0b' }} />
            <p style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600, margin: 0 }}>Hint: {q.hint}</p>
          </div>
        )}
      </div>

      {/* Lifelines bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }} className="mobile-column">
        <button 
          onClick={() => useLifeline('hint')} 
          disabled={!lifelines.hint || selected !== null || !q.hint}
          style={{ 
            flex: 1, height: 42, background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: (lifelines.hint && q.hint) ? '#f59e0b' : '#334155',
            fontSize: 13, fontWeight: 700, opacity: (lifelines.hint && q.hint) ? 1 : 0.5
          }}
        >
          <Lightbulb style={{ width: 16, height: 16 }} /> Hint
        </button>
        <button 
          onClick={() => useLifeline('fiftyFifty')} 
          disabled={!lifelines.fiftyFifty || selected !== null}
          style={{ 
            flex: 1, height: 42, background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: lifelines.fiftyFifty ? '#10b981' : '#334155',
            fontSize: 13, fontWeight: 700, opacity: lifelines.fiftyFifty ? 1 : 0.5
          }}
        >
          <Zap style={{ width: 16, height: 16 }} /> 50/50
        </button>
      </div>

      {/* Answers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="mobile-grid-1">
        {displayAnswers.map((ans, i) => {
          const isSelected = selected === ans;
          const isCorrect  = ans === q.correct_answer;
          const isWrong    = isSelected && !isCorrect;
          const isHidden   = hiddenAnswers.includes(ans);

          if (isHidden) return <div key={i} className="mobile-hide" style={{ height: 50 }} />;

          let border = '#2a2a3a';
          let background = '#1c1c28';
          let color = '#cbd5e1';

          if (selected !== null) {
            if (isCorrect) { border = '#10b981'; background = '#10b98110'; color = '#10b981'; }
            else if (isWrong) { border = '#ef4444'; background = '#ef444410'; color = '#ef4444'; }
            else { color = '#334155'; }
          }

          return (
            <button
              key={i}
              onClick={() => handleAdvance(ans)}
              disabled={selected !== null}
              style={{
                padding: '16px', borderRadius: 10, border: `1px solid ${border}`, background, color,
                fontWeight: 700, fontSize: 13, textAlign: 'center', cursor: selected === null ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (selected === null) e.currentTarget.style.borderColor = '#6366f1'; }}
              onMouseLeave={e => { if (selected === null) e.currentTarget.style.borderColor = '#2a2a3a'; }}
            >
              {ans}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={() => { if (window.confirm('Quit quiz?')) navigate('/categories'); }} style={{ background: 'none', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
          <LogOut style={{ width: 14, height: 14 }} /> Quit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;
