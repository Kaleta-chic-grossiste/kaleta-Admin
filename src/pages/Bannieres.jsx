import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

export default function Bannieres() {
  const [bannieres, setBannieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ url: '', label: '', ordre: 0 });
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchBannieres(); }, []);

  const fetchBannieres = async () => {
    const { data } = await supabase.from('bannieres').select('*').order('ordre');
    setBannieres(data || []);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `bannieres/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('kaleta-media').upload(filename, file);
    if (error) {
      alert('Erreur upload : ' + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('kaleta-media').getPublicUrl(filename);
    setForm(f => ({ ...f, url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.url) return alert('Ajoutez une image');
    await supabase.from('bannieres').insert({ ...form, visible: true });
    setForm({ url: '', label: '', ordre: 0 });
    setShowForm(false);
    fetchBannieres();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette bannière ?')) return;
    await supabase.from('bannieres').delete().eq('id', id);
    fetchBannieres();
  };

  const toggleVisible = async (id, val) => {
    await supabase.from('bannieres').update({ visible: !val }).eq('id', id);
    fetchBannieres();
  };

  const updateOrdre = async (id, ordre) => {
    await supabase.from('bannieres').update({ ordre: parseInt(ordre) }).eq('id', id);
    fetchBannieres();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>🖼️ Bannières Accueil</h1>
          <p style={{ color: '#666', fontSize: 13 }}>
            {bannieres.length} image(s) · Ces images défilent sur l'écran d'accueil de l'app
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          + Ajouter une image
        </button>
      </div>

      {/* INFO BOX */}
      <div style={{
        background: '#0d2a14', borderRadius: 12, padding: 14,
        border: '1px solid #39FF5A22', marginBottom: 24,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <div style={{ color: '#39FF5A', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Comment ça marche ?</div>
          <div style={{ color: '#666', fontSize: 12 }}>
            Ajoutez des images ici → elles apparaissent automatiquement dans le carrousel de l'app mobile.
            L'ordre détermine la position. Masquer une image la retire sans la supprimer.
          </div>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 800 }}>➕ Nouvelle bannière</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>LÉGENDE (optionnel)</label>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                placeholder="Ex: Vue terrasse de nuit"
                style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>ORDRE D'AFFICHAGE</label>
              <input type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })}
                placeholder="0, 1, 2..."
                style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}
              />
            </div>
          </div>

          {/* IMAGE */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>IMAGE *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                placeholder="URL de l'image ou uploadez depuis votre appareil..."
                style={{ flex: 1, padding: '10px 14px', background: '#111', border: '1px solid #333', borderRadius: 10, color: '#F5F5F5', fontSize: 14 }}
              />
              <button onClick={() => fileRef.current.click()}
                style={{
                  padding: '10px 18px', background: '#1a1a2a',
                  border: '1px solid #a78bfa44', borderRadius: 10,
                  color: '#a78bfa', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>
                {uploading ? '⏳ Upload...' : '📁 Choisir'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
            </div>
          </div>

          {/* PREVIEW */}
          {form.url && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: '#666', fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>APERÇU</label>
              <img src={form.url} alt="preview"
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, border: '1px solid #333' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handleSave}>✅ Ajouter au carrousel</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setForm({ url: '', label: '', ordre: 0 }); }}>Annuler</button>
          </div>
        </div>
      )}

      {/* BANNIÈRES LIST */}
      {loading ? <p style={{ color: '#555' }}>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bannieres.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
              <div style={{ color: '#555', fontSize: 15, marginBottom: 16 }}>Aucune bannière — le carrousel utilise les images par défaut</div>
              <button className="btn-primary" onClick={() => setShowForm(true)}>Ajouter la première image</button>
            </div>
          ) : bannieres.map((b, idx) => (
            <div key={b.id} style={{
              background: '#1E1E1E', borderRadius: 14, overflow: 'hidden',
              border: `1px solid ${b.visible ? '#2a2a2a' : '#ff444422'}`,
              display: 'flex', gap: 0,
            }}>
              {/* IMAGE */}
              <div style={{ width: 220, flexShrink: 0, position: 'relative' }}>
                <img src={b.url} alt={b.label}
                  style={{ width: '100%', height: 130, objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/220x130/1E1E1E/555?text=Image'; }}
                />
                {!b.visible && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: '#ff4444', fontWeight: 800, fontSize: 13 }}>🚫 MASQUÉ</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  background: 'rgba(0,0,0,0.7)', borderRadius: 6,
                  padding: '3px 8px',
                }}>
                  <span style={{ color: '#39FF5A', fontSize: 11, fontWeight: 700 }}>#{idx + 1}</span>
                </div>
              </div>

              {/* INFOS */}
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.label || 'Sans légende'}</div>
                  <div style={{ color: '#555', fontSize: 12, wordBreak: 'break-all' }}>{b.url.slice(0, 60)}...</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  {/* ORDRE */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#666', fontSize: 12 }}>Ordre :</span>
                    <input type="number" defaultValue={b.ordre}
                      onBlur={e => updateOrdre(b.id, e.target.value)}
                      style={{
                        width: 60, padding: '4px 8px', background: '#111',
                        border: '1px solid #333', borderRadius: 6,
                        color: '#F5F5F5', fontSize: 13, textAlign: 'center',
                      }}
                    />
                  </div>

                  <button onClick={() => toggleVisible(b.id, b.visible)}
                    style={{
                      padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: b.visible ? '#0d2a14' : '#2a2a2a',
                      color: b.visible ? '#39FF5A' : '#666',
                      border: `1px solid ${b.visible ? '#39FF5A33' : '#333'}`,
                    }}>{b.visible ? '👁 Visible' : '🚫 Masqué'}</button>

                  <button onClick={() => handleDelete(b.id)}
                    style={{
                      padding: '7px 16px', background: '#2a0a0a',
                      border: '1px solid #ff444433', borderRadius: 8,
                      color: '#ff4444', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>🗑 Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
