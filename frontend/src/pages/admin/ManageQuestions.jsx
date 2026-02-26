import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

const emptyForm = { question: '', correct_answer: '', incorrect_answers: ['', '', ''], difficulty: 'easy', hint: '' };

const diffColor = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

const ManageQuestions = () => {
  const { catId } = useParams();
  const [questions, setQuestions]   = useState([]);
  const [catName, setCatName]       = useState('');
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [expanded, setExpanded]     = useState(null);

  const fetchData = async () => {
    try {
      const [qRes, cRes] = await Promise.all([
        api.get(`/admin/questions?category=${catId}`),
        api.get('/admin/categories'),
      ]);
      setQuestions(qRes.data);
      const cat = cRes.data.find(c => c._id === catId);
      if (cat) setCatName(cat.name);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [catId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try { await api.delete(`/admin/questions/${id}`); fetchData(); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/questions', { ...form, category: catId });
      setForm(emptyForm);
      setShowForm(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const inputStyle = { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 13, width: '100%', outline: 'none' };
  const labelStyle = { display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 5 };

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Back + Header */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/admin/categories" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Categories
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{catName || 'Questions'}</h1>
              <p style={{ color: '#64748b', fontSize: 14 }}>{questions.length} questions available</p>
            </div>
            <button
              onClick={() => { setForm(emptyForm); setShowForm(v => !v); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              <Plus style={{ width: 15, height: 15 }} />
              Add Question
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ background: '#1c1c28', border: '1px solid #6366f1', borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>New Question</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: 17, height: 17 }} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Question text</label>
                <textarea required rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Enter the question" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }} className="mobile-grid-1">
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select style={inputStyle} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Hint (optional)</label>
                  <input type="text" style={inputStyle} value={form.hint} onChange={e => setForm({ ...form, hint: e.target.value })} placeholder="Enter a hint" />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ ...labelStyle, color: '#34d399' }}>Correct answer</label>
                <input required type="text" style={{ ...inputStyle, borderColor: '#166534' }} value={form.correct_answer} onChange={e => setForm({ ...form, correct_answer: e.target.value })} placeholder="Enter the correct answer" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, color: '#f87171' }}>Wrong answers</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.incorrect_answers.map((ans, i) => (
                    <input key={i} required type="text" style={inputStyle} value={ans} onChange={e => {
                      const u = [...form.incorrect_answers]; u[i] = e.target.value;
                      setForm({ ...form, incorrect_answers: u });
                    }} placeholder={`Wrong option ${i + 1}`} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ flex: 1, background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Save Question
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 18px', background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, color: '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : questions.length === 0 ? (
          <p style={{ color: '#475569', textAlign: 'center', padding: 48 }}>No questions yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map(q => (
              <div key={q._id} style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === q._id ? null : q._id)}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: diffColor[q.difficulty] || '#64748b', flexShrink: 0 }} />
                  <p style={{ flex: 1, color: 'white', fontSize: 13, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={e => { e.stopPropagation(); handleDelete(q._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, flexShrink: 0 }} title="Delete">
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                    {expanded === q._id ? <ChevronUp style={{ width: 14, height: 14, color: '#64748b' }} /> : <ChevronDown style={{ width: 14, height: 14, color: '#64748b' }} />}
                  </div>
                </div>

                {expanded === q._id && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid #111118', background: '#16161f' }}>
                    <div style={{ h: 10 }} />
                    {q.hint && <p style={{ color: '#f59e0b', fontSize: 12, margin: '14px 0 10px', padding: '8px 10px', background: '#1a1910', border: '1px solid #78350f', borderRadius: 6 }}>💡 Hint: {q.hint}</p>}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 10 }} className="mobile-grid-1">
                      <div style={{ background: '#1a2a1a', border: '1px solid #166834', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#34d399', fontWeight: 600 }}>✓ {q.correct_answer}</div>
                      {q.incorrect_answers.map((ans, j) => (
                        <div key={j} style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#94a3b8' }}>{ans}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;
