import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Eye, EyeOff, Edit2, FolderOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => { setForm({ name: '', description: '' }); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, form);
      } else {
        await api.post('/admin/categories', form);
      }
      resetForm();
      fetchCategories();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditId(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category and ALL its questions?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const togglePublish = async (cat) => {
    try {
      await api.put(`/admin/categories/${cat._id}`, { published: !cat.published });
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  const inputStyle = { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '9px 12px', color: '#e2e8f0', fontSize: 13, width: '100%', outline: 'none' };

  return (
    <div className="mobile-padding-sm" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>Categories</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Create categories and add questions.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(v => !v); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '9px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            <Plus style={{ width: 15, height: 15 }} />
            New Category
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background: '#1c1c28', border: '1px solid #6366f1', borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>{editId ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: 17, height: 17 }} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Category Name</label>
                <input required type="text" style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter category name" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Description (optional)</label>
                <input type="text" style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter short description" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ flex: 1, background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  {editId ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 18px', background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, color: '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 32, height: 32, border: '4px solid #2a2a3a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, padding: 48, textAlign: 'center' }}>
            <FolderOpen style={{ width: 36, height: 36, color: '#2a2a3a', margin: '0 auto 12px' }} />
            <p style={{ color: '#475569', fontSize: 14 }}>No categories yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map(cat => (
              <div key={cat._id} className="mobile-column" style={{ background: '#1c1c28', border: '1px solid #2a2a3a', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  {/* Published indicator */}
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.published ? '#10b981' : '#475569', flexShrink: 0 }} />

                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</p>
                    <p style={{ color: '#64748b', fontSize: 12, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.questionCount || 0} Q · {cat.description || 'No description'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, width: '100%', justifyContent: 'flex-end', marginTop: 4 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="mobile-width-full">
                    <Link
                      to={`/admin/categories/${cat._id}/questions`}
                      style={{ background: '#1a1a2e', border: '1px solid #3730a3', borderRadius: 8, padding: '6px 12px', color: '#818cf8', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      Questions <ChevronRight style={{ width: 12, height: 12 }} />
                    </Link>

                    <button 
                      onClick={() => togglePublish(cat)} 
                      style={{ 
                        background: cat.published ? '#10b98115' : '#1e1e2e', 
                        border: `1px solid ${cat.published ? '#10b981' : '#2a2a3a'}`, 
                        borderRadius: 6, padding: '4px 10px', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                        color: cat.published ? '#10b981' : '#64748b',
                        fontSize: 11, fontWeight: 700 
                      }}
                    >
                      {cat.published ? <Eye style={{ width: 14, height: 14 }} /> : <EyeOff style={{ width: 14, height: 14 }} />}
                      <span className="mobile-hide">{cat.published ? 'Published' : 'Draft'}</span>
                    </button>

                    <button onClick={() => handleEdit(cat)} style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#64748b' }}>
                      <Edit2 style={{ width: 14, height: 14 }} />
                    </button>

                    <button onClick={() => handleDelete(cat._id)} style={{ background: '#111118', border: '1px solid #ef444430', border: '1px solid #ef444460', borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) {
           .mobile-width-full { width: 100% !important; justify-content: space-between !important; }
        }
      `}</style>
    </div>
  );
};

export default ManageCategories;
