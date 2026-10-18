import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const EMPTY = { titre: '', description: '', date: '', heure: '', visible: true };

export default function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('evenements').select('*').order('created_at', { ascending: false });
    setEvents(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.titre || !form.date) return alert('Titre et date requis');
    if (editing) {
      await supabase.from('evenements').update(form).eq('id', editing);
    } else {
      await supabase.from('evenements').insert(form);
    }
    setForm(EMPTY);
    setEditing(null);
    setShowForm(false);
    fetchEvents();
  };

  const handleEdit = (ev) => {
    setForm(ev);
    setEditing(ev.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet événement ?')) return;
    await supabase.from('evenements').delete().eq('id', id);
    fetchEvents();
  };

  const toggleVisible = async (id, val) => {
    await supabase.from('evenements').update({ visible: !val }).eq('id', id);
    fetchEvents();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>🎉 Événements</h1>
          <p style={{ color: '#666', fontSize: 13 }}>{events.length} événement(s)</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}>
          + Ajouter un événement
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 800 }}>{editing ? '✏️ Modifier' : '➕ Nouvel événement'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Titre *', key: 'titre', placeholder: 'Soirée DJ, Brunch dominical...' },
              { label: 'Date *', key: 'date', placeholder: 'Ex: 14 Mai 2026' },
              { label: 'Heure', key: 'heure', placeholder: 'Ex: 20h00' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Détails de l'événement..." rows={3}
              style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleSave}>{editing ? '✅ Mettre à jour' : '✅ Créer'}</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Annuler</button>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: '#555' }}>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: '#555', padding: 40 }}>Aucun événement — créez le premier !</div>
          ) : events.map(ev => (
            <div key={ev.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderColor: ev.visible ? '#2a2a2a' : '#ff444422' }}>
              <div style={{ fontSize: 32 }}>🎉</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{ev.titre}</div>
                <div style={{ color: '#FF9F1C', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>📅 {ev.date}{ev.heure ? ` · ${ev.heure}` : ''}</div>
                {ev.description && <div style={{ color: '#666', fontSize: 13 }}>{ev.description}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleVisible(ev.id, ev.visible)}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: ev.visible ? '#0d2a14' : '#2a2a2a',
                    color: ev.visible ? '#39FF5A' : '#666',
                    border: '1px solid #333',
                  }}>{ev.visible ? '👁 Visible' : '🚫 Caché'}</button>
                <button onClick={() => handleEdit(ev)}
                  style={{ padding: '7px 14px', background: '#1a1a2a', border: '1px solid #333', borderRadius: 8, color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(ev.id)}
                  style={{ padding: '7px 12px', background: '#2a0a0a', border: '1px solid #ff444433', borderRadius: 8, color: '#ff4444', fontSize: 13, cursor: 'pointer' }}>
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
