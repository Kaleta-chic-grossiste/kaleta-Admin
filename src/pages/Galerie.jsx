import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

.gl * { box-sizing: border-box; margin: 0; padding: 0; }
.gl {
  font-family: 'Geist', -apple-system, sans-serif;
  --bg:  #070709;
  --s1:  #0D0D14;
  --s2:  #13131E;
  --s3:  #1A1A28;
  --s4:  #212134;
  --bd:  rgba(255,255,255,0.06);
  --bdh: rgba(255,255,255,0.11);
  --v:   #39FF5A;
  --vd:  rgba(57,255,90,0.07);
  --vb:  rgba(57,255,90,0.2);
  --vg:  rgba(57,255,90,0.04);
  --o:   #FF9F1C;
  --p:   #a78bfa;
  --pd:  rgba(167,139,250,0.08);
  --pb:  rgba(167,139,250,0.2);
  --r:   #FF4D5E;
  --rd:  rgba(255,77,94,0.08);
  --rb:  rgba(255,77,94,0.2);
  --i0:  #F2F2F5;
  --i1:  #C8C8D4;
  --i2:  #8A8A9A;
  --i3:  #52526A;
  color: var(--i1);
  padding-bottom: 60px;
}

/* ── LOADER ── */
.gl-loader { display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:14px; }
.gl-spinner { width:26px;height:26px;border-radius:50%;border:2px solid rgba(57,255,90,.12);border-top-color:var(--v);animation:glSpin .65s linear infinite; }
@keyframes glSpin { to{transform:rotate(360deg)} }
.gl-loader-txt { font-size:13px;color:var(--i3); }

/* ── HEADER ── */
.gl-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px; }
.gl-title { font-size:22px;font-weight:600;letter-spacing:-.03em;color:var(--i0); }
.gl-sub { font-size:12.5px;color:var(--i3);margin-top:5px; }
.gl-count-pill {
  display:flex;align-items:center;gap:8px;padding:8px 16px;
  border-radius:9px;background:var(--s2);border:1px solid var(--bd);
  font-size:12.5px;color:var(--i3);white-space:nowrap;
}
.gl-count-val { font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--i0); }

/* ── FORM CARD ── */
.gl-form-card {
  background:var(--s1);border:1px solid var(--bd);
  border-radius:14px;overflow:hidden;margin-bottom:20px;
}
.gl-form-head {
  padding:16px 20px 14px;border-bottom:1px solid var(--bd);
  display:flex;align-items:center;justify-content:space-between;
}
.gl-form-title {
  font-size:14px;font-weight:600;color:var(--i0);
  display:flex;align-items:center;gap:9px;
}
.gl-form-icon {
  width:27px;height:27px;border-radius:8px;
  background:var(--pd);border:1px solid var(--pb);
  display:flex;align-items:center;justify-content:center;
  color:var(--p);flex-shrink:0;
}
.gl-form-body { padding:20px; }

/* ── FORM FIELDS ── */
.gl-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px; }
.gl-field { position:relative; }
.gl-field label {
  position:absolute;left:13px;top:50%;transform:translateY(-50%);
  font-size:13px;color:var(--i3);pointer-events:none;
  background:var(--s1);padding:0 4px;transition:all .14s;z-index:1;
  font-family:'Geist',sans-serif;white-space:nowrap;
}
.gl-field input:focus~label,
.gl-field input:not(:placeholder-shown)~label,
.gl-field select:focus~label {
  top:0;transform:translateY(-50%);
  font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--v);
}
.gl-input {
  width:100%;padding:12px 13px;background:var(--bg);
  border:1px solid var(--bd);border-radius:10px;
  color:var(--i0);font-size:13.5px;font-family:'Geist',sans-serif;
  outline:none;transition:border-color .15s,box-shadow .15s;
}
.gl-input:focus { border-color:var(--vb);box-shadow:0 0 0 3px var(--vg); }
.gl-input::placeholder { color:transparent; }
.gl-plain {
  width:100%;padding:12px 13px;background:var(--bg);
  border:1px solid var(--bd);border-radius:10px;
  color:var(--i0);font-size:13.5px;font-family:'Geist',sans-serif;
  outline:none;transition:border-color .15s,box-shadow .15s;
}
.gl-plain:focus { border-color:var(--vb);box-shadow:0 0 0 3px var(--vg); }
.gl-flabel {
  font-size:9.5px;font-weight:700;color:var(--i3);
  text-transform:uppercase;letter-spacing:.09em;
  display:block;margin-bottom:7px;
}

/* ── IMAGE UPLOAD ROW ── */
.gl-upload-row { display:flex;gap:10px;margin-bottom:14px; }
.gl-preview {
  width:200px;height:140px;object-fit:cover;
  border-radius:10px;border:1px solid var(--bd);
  display:block;margin-bottom:14px;
}
.gl-preview-placeholder {
  width:200px;height:140px;
  background:var(--s3);border:1px dashed var(--bd);
  border-radius:10px;margin-bottom:14px;
  display:flex;align-items:center;justify-content:center;
  color:var(--i3);font-size:13px;
}

/* ── BUTTONS ── */
.gl-btn {
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 18px;border-radius:9px;background:var(--v);color:#040a06;
  font-size:13px;font-weight:700;font-family:'Geist',sans-serif;
  border:none;cursor:pointer;transition:opacity .15s,transform .1s;
}
.gl-btn:hover { opacity:.88; }
.gl-btn:active { transform:scale(.97); }
.gl-btn.ghost { background:transparent;color:var(--i2);border:1px solid var(--bd); }
.gl-btn.ghost:hover { background:var(--s3);color:var(--i0); }
.gl-btn.purple { background:var(--pd);color:var(--p);border:1px solid var(--pb); }
.gl-btn.danger { background:var(--rd);color:var(--r);border:1px solid var(--rb); }
.gl-btn.sm { padding:7px 13px;font-size:12px; }

/* ── FILTER BAR ── */
.gl-filters { display:flex;gap:9px;margin-bottom:20px;flex-wrap:wrap;align-items:center; }
.gl-fchip {
  padding:9px 16px;border-radius:9px;font-size:12.5px;font-weight:600;
  cursor:pointer;border:1px solid var(--bd);background:var(--s1);
  color:var(--i3);font-family:'Geist',sans-serif;transition:all .15s;white-space:nowrap;
}
.gl-fchip:hover { border-color:var(--bdh);color:var(--i1); }
.gl-fchip.on { background:var(--v);color:#040a06;border-color:transparent; }

/* ── STATS ── */
.gl-stats { display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap; }
.gl-stat-pill {
  display:inline-flex;align-items:center;gap:8px;
  padding:7px 14px;border-radius:999px;
  background:var(--s2);border:1px solid var(--bd);
  font-size:12px;font-weight:600;color:var(--i3);
}
.gl-stat-n { font-family:'Geist Mono',monospace;color:var(--i0);font-weight:700; }

/* ── PHOTO GRID ── */
.gl-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(230px,1fr));
  gap:14px;
}
.gl-photo-card {
  background:var(--s2);border:1px solid var(--bd);
  border-radius:14px;overflow:hidden;
  transition:border-color .2s,transform .15s;
  position:relative;
}
.gl-photo-card:hover { border-color:var(--bdh);transform:translateY(-2px); }
.gl-photo-card.hidden { opacity:.5;border-color:var(--rb); }

/* ── PHOTO IMAGE ── */
.gl-photo-img-wrap { position:relative;height:170px;overflow:hidden; }
.gl-photo-img {
  width:100%;height:100%;object-fit:cover;
  display:block;transition:transform .3s;
}
.gl-photo-card:hover .gl-photo-img { transform:scale(1.04); }
.gl-photo-overlay {
  position:absolute;inset:0;
  background:linear-gradient(transparent 45%,rgba(7,7,9,.88));
  pointer-events:none;
}
.gl-photo-cat-badge {
  position:absolute;top:10px;left:10px;
  display:inline-flex;padding:3px 9px;border-radius:999px;
  font-size:10px;font-weight:700;
  backdrop-filter:blur(8px);
  background:rgba(7,7,9,.6);border:1px solid rgba(255,255,255,.12);
  color:var(--i0);letter-spacing:.04em;
}
.gl-photo-info {
  position:absolute;bottom:10px;left:12px;right:12px;
}
.gl-photo-label { font-size:13.5px;font-weight:600;color:var(--i0);line-height:1.3; }
.gl-hidden-badge {
  position:absolute;top:10px;right:10px;
  font-size:9.5px;font-weight:700;
  padding:3px 9px;border-radius:999px;
  background:var(--rd);border:1px solid var(--rb);color:var(--r);
}

/* ── PHOTO ACTIONS ── */
.gl-photo-actions { display:flex;gap:8px;padding:11px 12px; }
.gl-vis-btn {
  flex:1;padding:8px;border-radius:9px;
  font-size:12px;font-weight:700;cursor:pointer;
  font-family:'Geist',sans-serif;transition:all .15s;
  display:flex;align-items:center;justify-content:center;gap:6px;
}
.gl-vis-btn.visible { background:var(--vd);border:1px solid var(--vb);color:var(--v); }
.gl-vis-btn.visible:hover { background:rgba(57,255,90,.14); }
.gl-vis-btn.hidden { background:var(--s3);border:1px solid var(--bd);color:var(--i3); }
.gl-vis-btn.hidden:hover { background:var(--s4);color:var(--i1); }

/* ── EMPTY ── */
.gl-empty {
  grid-column:1/-1;padding:60px 20px;text-align:center;
  background:var(--s1);border:1px dashed var(--bd);border-radius:14px;
}
.gl-empty p { font-size:13px;color:var(--i3);margin-top:10px; }
`;

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const CATEGORIES = ['TERRASSE', 'PLATS', 'COCKTAILS', 'ÉVÉNEMENTS'];

const CAT_COLOR = {
  TERRASSE:   { color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  PLATS:      { color: '#39FF5A', bg: 'rgba(57,255,90,0.15)' },
  COCKTAILS:  { color: '#FF9F1C', bg: 'rgba(255,159,28,0.15)' },
  ÉVÉNEMENTS: { color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
};

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const I = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IImage   = () => <I size={15}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></I>;
const IPlus    = () => <I size={13}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;
const IUpload  = () => <I size={13}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></I>;
const ITrash   = () => <I size={13}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></I>;
const IEye     = () => <I size={13}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>;
const IEyeOff  = () => <I size={13}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></I>;

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Galerie() {
  const [photos, setPhotos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter]       = useState('TOUT');
  const [form, setForm]           = useState({ label: '', categorie: 'PLATS', url: '' });
  const [showForm, setShowForm]   = useState(false);
  const fileRef                   = useRef();

  useEffect(() => { fetchPhotos(); }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('galerie').select('*').order('ordre');
    setPhotos(data || []);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `galerie/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('kaleta-media').upload(filename, file);
    if (error) { alert('Erreur upload : ' + error.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('kaleta-media').getPublicUrl(filename);
    setForm(f => ({ ...f, url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.url) return;
    await supabase.from('galerie').insert({ ...form, visible: true });
    setForm({ label: '', categorie: 'PLATS', url: '' });
    setShowForm(false);
    fetchPhotos();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette photo ?')) return;
    await supabase.from('galerie').delete().eq('id', id);
    fetchPhotos();
  };

  const toggleVisible = async (id, val) => {
    await supabase.from('galerie').update({ visible: !val }).eq('id', id);
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, visible: !val } : p));
  };

  const filtered = filter === 'TOUT' ? photos : photos.filter(p => p.categorie === filter);
  const visibleCount = photos.filter(p => p.visible).length;

  if (loading) return (
    <div className="gl">
      <style>{STYLES}</style>
      <div className="gl-loader"><div className="gl-spinner" /><p className="gl-loader-txt">Chargement…</p></div>
    </div>
  );

  return (
    <div className="gl">
      <style>{STYLES}</style>

      {/* HEADER */}
      <div className="gl-header">
        <div>
          <h1 className="gl-title">Galerie</h1>
          <p className="gl-sub">Gérez les photos affichées dans l'application</p>
        </div>
        <button className="gl-btn" onClick={() => setShowForm(!showForm)}>
          <IPlus /> Ajouter une photo
        </button>
      </div>

      {/* STATS */}
      <div className="gl-stats">
        <div className="gl-stat-pill">
          <IImage />
          <span className="gl-stat-n">{photos.length}</span> photos au total
        </div>
        <div className="gl-stat-pill">
          <IEye />
          <span className="gl-stat-n">{visibleCount}</span> visibles
        </div>
        <div className="gl-stat-pill">
          <IEyeOff />
          <span className="gl-stat-n">{photos.length - visibleCount}</span> cachées
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="gl-form-card">
          <div className="gl-form-head">
            <span className="gl-form-title">
              <div className="gl-form-icon"><IImage /></div>
              Nouvelle photo
            </span>
          </div>
          <div className="gl-form-body">
            <div className="gl-grid-2">
              <div className="gl-field">
                <input className="gl-input" placeholder="Légende" value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })} />
                <label>Légende</label>
              </div>
              <div>
                <span className="gl-flabel">Catégorie</span>
                <select className="gl-plain" value={form.categorie}
                  onChange={e => setForm({ ...form, categorie: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <span className="gl-flabel">Image</span>
              <div className="gl-upload-row">
                <input className="gl-plain" style={{ flex: 1 }}
                  placeholder="URL de l'image…"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                />
                <button className="gl-btn purple sm" onClick={() => fileRef.current.click()}>
                  <IUpload /> {uploading ? 'Envoi…' : 'Choisir'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
              </div>
              {form.url
                ? <img src={form.url} alt="preview" className="gl-preview" />
                : <div className="gl-preview-placeholder">Aperçu</div>
              }
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="gl-btn" onClick={handleSave} disabled={!form.url}>
                Ajouter à la galerie
              </button>
              <button className="gl-btn ghost" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="gl-filters">
        {['TOUT', ...CATEGORIES].map(f => (
          <button key={f} className={`gl-fchip${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="gl-grid">
        {filtered.length === 0 ? (
          <div className="gl-empty">
            <IImage />
            <p>Aucune photo dans cette catégorie</p>
          </div>
        ) : filtered.map(photo => {
          const cat = CAT_COLOR[photo.categorie] || { color: 'var(--i2)', bg: 'rgba(255,255,255,0.08)' };
          return (
            <div key={photo.id} className={`gl-photo-card${!photo.visible ? ' hidden' : ''}`}>
              <div className="gl-photo-img-wrap">
                <img src={photo.url} alt={photo.label} className="gl-photo-img"
                  onError={e => { e.target.src = 'https://via.placeholder.com/300x170/0D0D14/52526A?text=Image'; }}
                />
                <div className="gl-photo-overlay" />
                <span className="gl-photo-cat-badge"
                  style={{ color: cat.color }}>
                  {photo.categorie}
                </span>
                {!photo.visible && <span className="gl-hidden-badge">Caché</span>}
                <div className="gl-photo-info">
                  {photo.label && <div className="gl-photo-label">{photo.label}</div>}
                </div>
              </div>
              <div className="gl-photo-actions">
                <button
                  className={`gl-vis-btn ${photo.visible ? 'visible' : 'hidden'}`}
                  onClick={() => toggleVisible(photo.id, photo.visible)}
                >
                  {photo.visible ? <><IEye /> Visible</> : <><IEyeOff /> Caché</>}
                </button>
                <button className="gl-btn danger sm" onClick={() => handleDelete(photo.id)}>
                  <ITrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}