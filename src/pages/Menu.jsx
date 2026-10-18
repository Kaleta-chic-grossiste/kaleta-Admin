import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const CATEGORIES = ['COCKTAILS', 'ENTRÉES', 'PLATS', 'DESSERTS', 'MENU SEMAINE'];
const JOURS = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
const EMPTY = { nom: '', description: '', prix: '', prix_alt: '', categorie: 'PLATS', jour: '', emoji: '🍽️', tag: '', disponible: true };

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activecat, setActivecat] = useState('PLATS');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('menu_items').select('*').order('ordre');
    setItems(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.nom || !form.prix) return alert('Nom et prix requis');
    setSaving(true);
    const payload = { ...form, prix: parseInt(form.prix) };
    if (editing) {
      await supabase.from('menu_items').update(payload).eq('id', editing);
    } else {
      await supabase.from('menu_items').insert(payload);
    }
    setForm(EMPTY);
    setEditing(null);
    setShowForm(false);
    fetchItems();
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({ ...item, prix: item.prix?.toString() });
    setEditing(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    fetchItems();
  };

  const toggleDisponible = async (id, val) => {
    await supabase.from('menu_items').update({ disponible: !val }).eq('id', id);
    fetchItems();
  };

  const filtered = items.filter(i => i.categorie === activecat);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>🍽️ Menu</h1>
          <p style={{ color: '#666', fontSize: 13 }}>{items.length} articles au total</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}>
          + Ajouter un plat
        </button>
      </div>

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActivecat(c)}
            style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: activecat === c ? '#39FF5A' : '#1E1E1E',
              color: activecat === c ? '#000' : '#666',
              border: '1px solid #2a2a2a', cursor: 'pointer',
            }}>{c}</button>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 800 }}>{editing ? '✏️ Modifier' : '➕ Nouveau plat'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Nom *', key: 'nom', placeholder: 'Ex: Burger Kaleta' },
              { label: 'Emoji', key: 'emoji', placeholder: '🍽️' },
              { label: 'Prix (CFA) *', key: 'prix', placeholder: '3000', type: 'number' },
              { label: 'Prix alternatif', key: 'prix_alt', placeholder: 'Ex: 5 000F' },
              { label: 'Tag', key: 'tag', placeholder: 'POPULAIRE, SIGNATURE...' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type || 'text'} value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}
                />
              </div>
            ))}

            <div>
              <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>CATÉGORIE</label>
              <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {form.categorie === 'MENU SEMAINE' && (
              <div>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>JOUR</label>
                <select value={form.jour} onChange={e => setForm({ ...form, jour: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}>
                  <option value="">Sélectionner...</option>
                  {JOURS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description du plat..." rows={2}
              style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement...' : editing ? '✅ Mettre à jour' : '✅ Ajouter'}
            </button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Annuler</button>
          </div>
        </div>
      )}

      {/* LIST */}
      {loading ? <p style={{ color: '#555' }}>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#555', padding: 40 }}>
              Aucun plat dans cette catégorie — <button onClick={() => setShowForm(true)} style={{ color: '#39FF5A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Ajouter le premier</button>
            </div>
          ) : filtered.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
              <span style={{ fontSize: 28 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{item.nom}</span>
                  {item.tag && <span style={{ padding: '2px 8px', background: '#2a1800', color: '#FF9F1C', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{item.tag}</span>}
                  {item.jour && <span style={{ padding: '2px 8px', background: '#1a1a2a', color: '#a78bfa', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{item.jour}</span>}
                </div>
                {item.description && <div style={{ color: '#666', fontSize: 12 }}>{item.description}</div>}
              </div>
              <div style={{ textAlign: 'right', marginRight: 10 }}>
                <div style={{ color: '#39FF5A', fontWeight: 800, fontSize: 16 }}>{item.prix?.toLocaleString()} CFA</div>
                {item.prix_alt && <div style={{ color: '#555', fontSize: 11 }}>{item.prix_alt}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => toggleDisponible(item.id, item.disponible)}
                  style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: item.disponible ? '#0d2a14' : '#2a0a0a',
                    color: item.disponible ? '#39FF5A' : '#ff4444',
                    border: `1px solid ${item.disponible ? '#39FF5A44' : '#ff444444'}`,
                  }}>{item.disponible ? '✓ Dispo' : '✗ Indispo'}</button>
                <button onClick={() => handleEdit(item)}
                  style={{ padding: '6px 12px', background: '#1a1a2a', border: '1px solid #333', borderRadius: 8, color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  ✏️ Modifier
                </button>
                <button onClick={() => handleDelete(item.id)}
                  style={{ padding: '6px 12px', background: '#2a0a0a', border: '1px solid #ff444444', borderRadius: 8, color: '#ff4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
