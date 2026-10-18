import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

.mn * { box-sizing: border-box; margin: 0; padding: 0; }
.mn {
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
  --od:  rgba(255,159,28,0.08);
  --ob:  rgba(255,159,28,0.2);
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
.mn-loader { display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:14px; }
.mn-spinner { width:26px;height:26px;border-radius:50%;border:2px solid rgba(57,255,90,.12);border-top-color:var(--v);animation:mnSpin .65s linear infinite; }
@keyframes mnSpin { to{transform:rotate(360deg)} }
.mn-loader-txt { font-size:13px;color:var(--i3); }

/* ── HEADER ── */
.mn-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px; }
.mn-title { font-size:22px;font-weight:600;letter-spacing:-.03em;color:var(--i0); }
.mn-sub { font-size:12.5px;color:var(--i3);margin-top:5px; }
.mn-count-pill {
  display:flex;align-items:center;gap:8px;padding:8px 16px;
  border-radius:9px;background:var(--s2);border:1px solid var(--bd);
  font-size:12.5px;color:var(--i3);white-space:nowrap;
}
.mn-count-val { font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--i0); }

/* ── TABS ── */
.mn-tabs {
  display:flex;gap:0;margin-bottom:24px;
  background:var(--s1);border:1px solid var(--bd);border-radius:12px;padding:4px;
  width:fit-content;
}
.mn-tab {
  padding:9px 20px;border-radius:9px;font-size:13px;font-weight:600;
  cursor:pointer;border:none;background:transparent;
  color:var(--i3);font-family:'Geist',sans-serif;transition:all .15s;white-space:nowrap;
}
.mn-tab:hover { color:var(--i1); }
.mn-tab.on { background:var(--s3);color:var(--i0);box-shadow:0 1px 4px rgba(0,0,0,0.3); }

/* ── SECTION HEADER ── */
.mn-section-head { display:flex;align-items:center;justify-content:space-between;margin-bottom:18px; }
.mn-section-title { font-size:15px;font-weight:600;color:var(--i0); }

/* ── BUTTONS ── */
.mn-btn {
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 18px;border-radius:9px;background:var(--v);color:#040a06;
  font-size:13px;font-weight:700;font-family:'Geist',sans-serif;
  border:none;cursor:pointer;transition:opacity .15s,transform .1s;
}
.mn-btn:hover { opacity:.88; }
.mn-btn:active { transform:scale(.97); }
.mn-btn.ghost {
  background:transparent;color:var(--i2);
  border:1px solid var(--bd);
}
.mn-btn.ghost:hover { background:var(--s3);color:var(--i0); }
.mn-btn.danger {
  background:var(--rd);color:var(--r);
  border:1px solid var(--rb);
}
.mn-btn.purple {
  background:var(--pd);color:var(--p);
  border:1px solid var(--pb);
}
.mn-btn.sm { padding:7px 13px;font-size:12px; }

/* ── CARD ── */
.mn-card {
  background:var(--s1);border:1px solid var(--bd);
  border-radius:14px;overflow:hidden;margin-bottom:14px;
  transition:border-color .2s;
}
.mn-card:hover { border-color:var(--bdh); }
.mn-card-head {
  padding:16px 20px 14px;border-bottom:1px solid var(--bd);
  display:flex;align-items:center;justify-content:space-between;
}
.mn-card-title {
  font-size:14px;font-weight:600;color:var(--i0);
  display:flex;align-items:center;gap:9px;
}
.mn-card-icon {
  width:27px;height:27px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.mn-card-body { padding:20px; }

/* ── FORM ── */
.mn-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
.mn-grid-3 { display:grid;grid-template-columns:1fr 2fr auto;gap:12px;align-items:flex-end; }
.mn-field { position:relative; }
.mn-field label {
  position:absolute;left:13px;top:50%;transform:translateY(-50%);
  font-size:13px;color:var(--i3);pointer-events:none;
  background:var(--s1);padding:0 4px;transition:all .14s;z-index:1;
  font-family:'Geist',sans-serif;white-space:nowrap;
}
.mn-field input:focus~label,
.mn-field input:not(:placeholder-shown)~label,
.mn-field select:focus~label,
.mn-field textarea:focus~label,
.mn-field textarea:not(:placeholder-shown)~label {
  top:0;transform:translateY(-50%);
  font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--v);
}
.mn-input {
  width:100%;padding:12px 13px;background:var(--bg);
  border:1px solid var(--bd);border-radius:10px;
  color:var(--i0);font-size:13.5px;font-family:'Geist',sans-serif;
  outline:none;transition:border-color .15s,box-shadow .15s;
}
.mn-input:focus { border-color:var(--vb);box-shadow:0 0 0 3px var(--vg); }
.mn-input::placeholder { color:transparent; }
.mn-plain {
  width:100%;padding:12px 13px;background:var(--bg);
  border:1px solid var(--bd);border-radius:10px;
  color:var(--i0);font-size:13.5px;font-family:'Geist',sans-serif;
  outline:none;transition:border-color .15s,box-shadow .15s;
}
.mn-plain:focus { border-color:var(--vb);box-shadow:0 0 0 3px var(--vg); }
.mn-flabel {
  font-size:9.5px;font-weight:700;color:var(--i3);
  text-transform:uppercase;letter-spacing:.09em;
  display:block;margin-bottom:7px;
}
.mn-notice {
  display:flex;align-items:flex-start;gap:10px;
  padding:12px 16px;border-radius:10px;
  background:var(--vd);border:1px solid var(--vb);
  font-size:12.5px;color:#6BFF85;line-height:1.55;margin-bottom:18px;
}

/* ── IMAGE PREVIEW ── */
.mn-img-preview {
  width:100%;height:180px;object-fit:cover;
  border-radius:10px;margin-top:12px;
  border:1px solid var(--bd);
}
.mn-img-placeholder {
  width:100%;height:180px;
  background:var(--s3);border:1px dashed var(--bd);
  border-radius:10px;margin-top:12px;
  display:flex;align-items:center;justify-content:center;
  color:var(--i3);font-size:13px;
}

/* ── PLAT GRID ── */
.mn-plat-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:14px;
}
.mn-plat-card {
  background:var(--s2);border:1px solid var(--bd);
  border-radius:12px;overflow:hidden;transition:border-color .2s,transform .15s;
}
.mn-plat-card:hover { border-color:var(--bdh);transform:translateY(-1px); }
.mn-plat-img {
  width:100%;height:150px;object-fit:cover;
  display:block;background:var(--s3);
}
.mn-plat-img-placeholder {
  width:100%;height:150px;background:var(--s3);
  display:flex;align-items:center;justify-content:center;
  color:var(--i3);font-size:13px;
}
.mn-plat-info { padding:12px 14px; }
.mn-plat-cat {
  display:inline-flex;padding:3px 9px;border-radius:999px;
  font-size:10px;font-weight:700;margin-bottom:8px;
}
.mn-plat-name { font-size:14px;font-weight:600;color:var(--i0);margin-bottom:3px; }
.mn-plat-desc { font-size:12px;color:var(--i3);margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.mn-plat-price { font-family:'Geist Mono',monospace;font-size:14px;font-weight:600;color:var(--v); }
.mn-plat-actions { display:flex;gap:8px;padding:0 14px 12px; }

/* ── CATÉGORIE ROW ── */
.mn-cat-row {
  display:flex;align-items:center;gap:14px;
  padding:14px 18px;background:var(--s1);
  border:1px solid var(--bd);border-radius:12px;
  margin-bottom:8px;transition:border-color .2s;
}
.mn-cat-row:hover { border-color:var(--bdh); }
.mn-cat-color {
  width:38px;height:38px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.mn-cat-dot { width:16px;height:16px;border-radius:50%; }
.mn-cat-name { font-size:14px;font-weight:600;color:var(--i0); }
.mn-cat-count { font-size:12px;color:var(--i3);margin-top:2px; }

/* ── JOUR BLOCK ── */
.mn-jour {
  background:var(--s1);border:1px solid var(--bd);
  border-radius:14px;overflow:hidden;margin-bottom:12px;
  transition:border-color .2s;
}
.mn-jour.today { border-color:rgba(57,255,90,.25); }
.mn-jour-head {
  display:flex;align-items:center;gap:12px;
  padding:14px 18px;border-bottom:1px solid var(--bd);
}
.mn-jour.today .mn-jour-head { background:rgba(57,255,90,.04); }
.mn-jour-name { font-size:14px;font-weight:700;color:var(--i0); }
.mn-jour-name.today { color:var(--v); }
.mn-today-badge {
  font-size:9.5px;font-weight:800;text-transform:uppercase;
  letter-spacing:.08em;padding:3px 9px;border-radius:999px;
  background:var(--v);color:#040a06;
}
.mn-jour-count { font-size:12px;color:var(--i3);margin-left:auto;font-family:'Geist Mono',monospace; }
.mn-jour-body { padding:14px; }
.mn-jour-empty { font-size:13px;color:var(--i3);padding:8px 0; }
.mn-jour-plats { display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px; }
.mn-jour-plat {
  background:var(--bg);border:1px solid var(--bd);
  border-radius:10px;overflow:hidden;position:relative;
  transition:border-color .15s;
}
.mn-jour-plat:hover { border-color:var(--bdh); }
.mn-jour-plat-img {
  width:100%;height:110px;object-fit:cover;
  display:block;background:var(--s3);
}
.mn-jour-plat-info { padding:8px 10px; }
.mn-jour-plat-name { font-size:12.5px;font-weight:600;color:var(--i0);margin-bottom:2px; }
.mn-jour-plat-price { font-family:'Geist Mono',monospace;font-size:12px;font-weight:500;color:var(--v); }
.mn-jour-plat-del {
  position:absolute;top:6px;right:6px;
  width:24px;height:24px;border-radius:7px;
  background:rgba(0,0,0,.7);border:none;
  color:var(--r);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s;
}
.mn-jour-plat-del:hover { background:rgba(255,77,94,.2); }

/* ── MENU DU JOUR ── */
.mn-mdj-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px; }
.mn-mdj-card {
  background:var(--s2);border:1px solid rgba(57,255,90,.18);
  border-radius:12px;overflow:hidden;transition:border-color .2s,transform .15s;
}
.mn-mdj-card:hover { border-color:rgba(57,255,90,.35);transform:translateY(-1px); }
.mn-mdj-badge {
  display:inline-flex;align-items:center;gap:5px;
  font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;
  background:var(--v);color:#040a06;
  padding:3px 9px;border-radius:999px;
}

/* ── EMPTY ── */
.mn-empty { padding:40px 20px;text-align:center; }
.mn-empty p { font-size:13px;color:var(--i3);margin-top:10px; }
`;

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const JOURS = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const I = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IBook    = () => <I><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></I>;
const ITag     = () => <I><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></I>;
const ICal     = () => <I><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></I>;
const IStar    = () => <I><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></I>;
const IPlus    = () => <I size={13}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;
const IEdit    = () => <I size={13}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></I>;
const ITrash   = () => <I size={13}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></I>;
const IX       = () => <I size={11}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>;
const IUpload  = () => <I size={13}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></I>;
const IInfo    = () => <I size={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></I>;

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const todayJourIndex = () => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
};

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function MenuAdmin() {
  const [tab, setTab]                         = useState('historique');
  const [historique, setHistorique]           = useState([]);
  const [categories, setCategories]           = useState([]);
  const [menuGeneral, setMenuGeneral]         = useState({});
  const [menuDuJour, setMenuDuJour]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [uploading, setUploading]             = useState(false);
  const fileRef                               = useRef();

  const [showNewPlat, setShowNewPlat]         = useState(false);
  const [newPlat, setNewPlat]                 = useState({ nom: '', description: '', prix: '', prix_alt: '', categorie_id: '', image_url: '' });
  const [editingPlat, setEditingPlat]         = useState(null);
  const [newCat, setNewCat]                   = useState({ nom: '', couleur: '#39FF5A' });
  const [showNewCat, setShowNewCat]           = useState(false);
  const [selectedJour, setSelectedJour]       = useState('LUNDI');
  const [selectedPlatGeneral, setSelectedPlatGeneral] = useState('');
  const [selectedPlatJour, setSelectedPlatJour]       = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [h, c, mg, mdj] = await Promise.all([
      supabase.from('historique_plats').select('*, categories_plats(nom, couleur)').order('created_at', { ascending: false }),
      supabase.from('categories_plats').select('*').order('ordre'),
      supabase.from('menu_general').select('*, historique_plats(*, categories_plats(nom, couleur))').order('ordre'),
      supabase.from('menu_du_jour').select('*, historique_plats(*, categories_plats(nom, couleur))').eq('date', new Date().toISOString().split('T')[0]).order('ordre'),
    ]);
    setHistorique(h.data || []);
    setCategories(c.data || []);
    const obj = {};
    JOURS.forEach(j => { obj[j] = []; });
    (mg.data || []).forEach(item => { if (obj[item.jour]) obj[item.jour].push(item); });
    setMenuGeneral(obj);
    setMenuDuJour(mdj.data || []);
    setLoading(false);
  };

  const handleUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `menu/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('kaleta-media').upload(filename, file);
    if (error) { alert('Erreur: ' + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('kaleta-media').getPublicUrl(filename);
    callback(data.publicUrl);
    setUploading(false);
  };

  const savePlat = async () => {
    if (!newPlat.nom || !newPlat.prix) return;
    const cat = categories.find(c => c.id === newPlat.categorie_id);
    const payload = { ...newPlat, prix: parseInt(newPlat.prix), categorie_nom: cat?.nom || '' };
    if (editingPlat) {
      await supabase.from('historique_plats').update(payload).eq('id', editingPlat);
    } else {
      await supabase.from('historique_plats').insert(payload);
    }
    setNewPlat({ nom: '', description: '', prix: '', prix_alt: '', categorie_id: '', image_url: '' });
    setEditingPlat(null);
    setShowNewPlat(false);
    fetchAll();
  };

  const deletePlat = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return;
    await supabase.from('historique_plats').delete().eq('id', id);
    fetchAll();
  };

  const editPlat = (plat) => {
    setNewPlat({ nom: plat.nom, description: plat.description || '', prix: plat.prix?.toString(), prix_alt: plat.prix_alt || '', categorie_id: plat.categorie_id || '', image_url: plat.image_url || '' });
    setEditingPlat(plat.id);
    setShowNewPlat(true);
    setTab('historique');
  };

  const saveCat = async () => {
    if (!newCat.nom) return;
    await supabase.from('categories_plats').insert({ ...newCat, ordre: categories.length + 1 });
    setNewCat({ nom: '', couleur: '#39FF5A' });
    setShowNewCat(false);
    fetchAll();
  };

  const deleteCat = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await supabase.from('categories_plats').delete().eq('id', id);
    fetchAll();
  };

  const addToMenuGeneral = async () => {
    if (!selectedPlatGeneral) return;
    await supabase.from('menu_general').insert({ jour: selectedJour, plat_id: selectedPlatGeneral, ordre: (menuGeneral[selectedJour]?.length || 0) + 1 });
    setSelectedPlatGeneral('');
    fetchAll();
  };

  const removeFromMenuGeneral = async (id) => {
    await supabase.from('menu_general').delete().eq('id', id);
    fetchAll();
  };

  const addToMenuDuJour = async () => {
    if (!selectedPlatJour) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('menu_du_jour').insert({ date: today, plat_id: selectedPlatJour, mis_en_relief: true, ordre: menuDuJour.length + 1 });
    setSelectedPlatJour('');
    fetchAll();
  };

  const removeFromMenuDuJour = async (id) => {
    await supabase.from('menu_du_jour').delete().eq('id', id);
    fetchAll();
  };

  const TABS = [
    { id: 'historique', label: 'Historique', icon: <IBook /> },
    { id: 'categories', label: 'Catégories', icon: <ITag /> },
    { id: 'general',    label: 'Menu général', icon: <ICal /> },
    { id: 'jour',       label: 'Menu du jour', icon: <IStar /> },
  ];

  if (loading) return (
    <div className="mn">
      <style>{STYLES}</style>
      <div className="mn-loader"><div className="mn-spinner" /><p className="mn-loader-txt">Chargement…</p></div>
    </div>
  );

  return (
    <div className="mn">
      <style>{STYLES}</style>

      {/* HEADER */}
      <div className="mn-header">
        <div>
          <h1 className="mn-title">Gestion du menu</h1>
          <p className="mn-sub">Gérez l'historique, les catégories et les menus de la semaine</p>
        </div>
        <div className="mn-count-pill">
          <IBook />
          <span className="mn-count-val">{historique.length}</span>
          plats dans l'historique
        </div>
      </div>

      {/* TABS */}
      <div className="mn-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`mn-tab${tab === t.id ? ' on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HISTORIQUE ── */}
      {tab === 'historique' && (
        <div>
          <div className="mn-section-head">
            <span className="mn-section-title">
              {historique.length} plat{historique.length !== 1 ? 's' : ''} enregistrés
            </span>
            <button className="mn-btn" onClick={() => { setShowNewPlat(!showNewPlat); setEditingPlat(null); setNewPlat({ nom: '', description: '', prix: '', prix_alt: '', categorie_id: '', image_url: '' }); }}>
              <IPlus /> Nouveau plat
            </button>
          </div>

          {showNewPlat && (
            <div className="mn-card" style={{ marginBottom: 20 }}>
              <div className="mn-card-head">
                <span className="mn-card-title">
                  <div className="mn-card-icon" style={{ background: 'var(--pd)', border: '1px solid var(--pb)', color: 'var(--p)' }}>
                    {editingPlat ? <IEdit /> : <IPlus />}
                  </div>
                  {editingPlat ? 'Modifier le plat' : 'Nouveau plat'}
                </span>
              </div>
              <div className="mn-card-body">
                <div className="mn-grid-2" style={{ marginBottom: 14 }}>
                  <div className="mn-field">
                    <input className="mn-input" placeholder="Nom du plat" value={newPlat.nom} onChange={e => setNewPlat({ ...newPlat, nom: e.target.value })} />
                    <label>Nom *</label>
                  </div>
                  <div className="mn-field">
                    <input className="mn-input" type="number" placeholder="Prix en CFA" value={newPlat.prix} onChange={e => setNewPlat({ ...newPlat, prix: e.target.value })} />
                    <label>Prix (CFA) *</label>
                  </div>
                  <div className="mn-field">
                    <input className="mn-input" placeholder="Prix alternatif" value={newPlat.prix_alt} onChange={e => setNewPlat({ ...newPlat, prix_alt: e.target.value })} />
                    <label>Prix alternatif</label>
                  </div>
                  <div>
                    <span className="mn-flabel">Catégorie</span>
                    <select className="mn-plain" value={newPlat.categorie_id} onChange={e => setNewPlat({ ...newPlat, categorie_id: e.target.value })}>
                      <option value="">Sélectionner une catégorie…</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <span className="mn-flabel">Description</span>
                  <textarea
                    className="mn-plain" rows={2}
                    placeholder="Description du plat…"
                    value={newPlat.description}
                    onChange={e => setNewPlat({ ...newPlat, description: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <span className="mn-flabel">Image du plat</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="mn-plain" style={{ flex: 1 }}
                      placeholder="URL de l'image…"
                      value={newPlat.image_url}
                      onChange={e => setNewPlat({ ...newPlat, image_url: e.target.value })}
                    />
                    <button className="mn-btn purple sm" onClick={() => fileRef.current.click()}>
                      <IUpload /> {uploading ? 'Envoi…' : 'Choisir'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => handleUpload(e, url => setNewPlat(p => ({ ...p, image_url: url })))}
                    />
                  </div>
                  {newPlat.image_url
                    ? <img src={newPlat.image_url} alt="preview" className="mn-img-preview" />
                    : <div className="mn-img-placeholder">Aperçu de l'image</div>
                  }
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="mn-btn" onClick={savePlat} disabled={!newPlat.nom || !newPlat.prix}>
                    {editingPlat ? 'Mettre à jour' : 'Ajouter à l\'historique'}
                  </button>
                  <button className="mn-btn ghost" onClick={() => { setShowNewPlat(false); setEditingPlat(null); }}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {historique.length === 0 ? (
            <div className="mn-card"><div className="mn-empty"><IBook /><p>Aucun plat — créez le premier !</p></div></div>
          ) : (
            <div className="mn-plat-grid">
              {historique.map(plat => {
                const cat = plat.categories_plats;
                return (
                  <div key={plat.id} className="mn-plat-card">
                    {plat.image_url
                      ? <img src={plat.image_url} alt={plat.nom} className="mn-plat-img" onError={e => { e.target.style.display = 'none'; }} />
                      : <div className="mn-plat-img-placeholder">Pas de photo</div>
                    }
                    <div className="mn-plat-info">
                      {cat && (
                        <div className="mn-plat-cat"
                          style={{ background: cat.couleur + '18', color: cat.couleur, border: `1px solid ${cat.couleur}33` }}>
                          {cat.nom}
                        </div>
                      )}
                      <div className="mn-plat-name">{plat.nom}</div>
                      {plat.description && <div className="mn-plat-desc">{plat.description}</div>}
                      <div className="mn-plat-price">{plat.prix?.toLocaleString()} CFA</div>
                    </div>
                    <div className="mn-plat-actions">
                      <button className="mn-btn purple sm" style={{ flex: 1 }} onClick={() => editPlat(plat)}>
                        <IEdit /> Modifier
                      </button>
                      <button className="mn-btn danger sm" onClick={() => deletePlat(plat.id)}>
                        <ITrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CATÉGORIES ── */}
      {tab === 'categories' && (
        <div>
          <div className="mn-section-head">
            <span className="mn-section-title">{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</span>
            <button className="mn-btn" onClick={() => setShowNewCat(!showNewCat)}>
              <IPlus /> Nouvelle catégorie
            </button>
          </div>

          {showNewCat && (
            <div className="mn-card" style={{ marginBottom: 18 }}>
              <div className="mn-card-head">
                <span className="mn-card-title">
                  <div className="mn-card-icon" style={{ background: 'var(--vd)', border: '1px solid var(--vb)', color: 'var(--v)' }}>
                    <ITag />
                  </div>
                  Nouvelle catégorie
                </span>
              </div>
              <div className="mn-card-body">
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
                  <div className="mn-field" style={{ flex: 1 }}>
                    <input className="mn-input" placeholder="Nom" value={newCat.nom} onChange={e => setNewCat({ ...newCat, nom: e.target.value })} />
                    <label>Nom de la catégorie</label>
                  </div>
                  <div>
                    <span className="mn-flabel">Couleur</span>
                    <input type="color" value={newCat.couleur}
                      onChange={e => setNewCat({ ...newCat, couleur: e.target.value })}
                      style={{ width: 48, height: 46, borderRadius: 9, border: '1px solid var(--bd)', cursor: 'pointer', background: 'none', padding: 2 }}
                    />
                  </div>
                  <button className="mn-btn" onClick={saveCat}>Créer</button>
                </div>
              </div>
            </div>
          )}

          {categories.length === 0 ? (
            <div className="mn-card"><div className="mn-empty"><ITag /><p>Aucune catégorie</p></div></div>
          ) : categories.map(cat => (
            <div key={cat.id} className="mn-cat-row">
              <div className="mn-cat-color" style={{ background: cat.couleur + '18', border: `2px solid ${cat.couleur}44` }}>
                <div className="mn-cat-dot" style={{ background: cat.couleur }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mn-cat-name">{cat.nom}</div>
                <div className="mn-cat-count">
                  {historique.filter(p => p.categorie_id === cat.id).length} plat{historique.filter(p => p.categorie_id === cat.id).length !== 1 ? 's' : ''}
                </div>
              </div>
              <button className="mn-btn danger sm" onClick={() => deleteCat(cat.id)}>
                <ITrash /> Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── MENU GÉNÉRAL ── */}
      {tab === 'general' && (
        <div>
          <div className="mn-section-head">
            <span className="mn-section-title">Menu de la semaine</span>
          </div>

          <div className="mn-card" style={{ marginBottom: 20 }}>
            <div className="mn-card-head">
              <span className="mn-card-title">
                <div className="mn-card-icon" style={{ background: 'var(--vd)', border: '1px solid var(--vb)', color: 'var(--v)' }}>
                  <ICal />
                </div>
                Assigner un plat à un jour
              </span>
            </div>
            <div className="mn-card-body">
              <div className="mn-grid-3">
                <div>
                  <span className="mn-flabel">Jour</span>
                  <select className="mn-plain" value={selectedJour} onChange={e => setSelectedJour(e.target.value)}>
                    {JOURS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <span className="mn-flabel">Plat — {historique.length} disponibles</span>
                  <select className="mn-plain" value={selectedPlatGeneral} onChange={e => setSelectedPlatGeneral(e.target.value)}>
                    <option value="">Choisir un plat…</option>
                    {historique.map(p => <option key={p.id} value={p.id}>{p.nom} — {p.prix?.toLocaleString()} CFA</option>)}
                  </select>
                </div>
                <button className="mn-btn" onClick={addToMenuGeneral} disabled={!selectedPlatGeneral}>
                  <IPlus /> Ajouter
                </button>
              </div>
            </div>
          </div>

          {JOURS.map((jour, idx) => {
            const isToday = idx === todayJourIndex();
            return (
              <div key={jour} className={`mn-jour${isToday ? ' today' : ''}`}>
                <div className="mn-jour-head">
                  <span className={`mn-jour-name${isToday ? ' today' : ''}`}>{jour}</span>
                  {isToday && <span className="mn-today-badge">Aujourd'hui</span>}
                  <span className="mn-jour-count">{menuGeneral[jour]?.length || 0} plat{(menuGeneral[jour]?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
                <div className="mn-jour-body">
                  {!menuGeneral[jour]?.length ? (
                    <p className="mn-jour-empty">Aucun plat assigné pour ce jour</p>
                  ) : (
                    <div className="mn-jour-plats">
                      {menuGeneral[jour].map(mg => {
                        const plat = mg.historique_plats;
                        return (
                          <div key={mg.id} className="mn-jour-plat">
                            {plat?.image_url
                              ? <img src={plat.image_url} alt={plat?.nom} className="mn-jour-plat-img" />
                              : <div className="mn-jour-plat-img" style={{ background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'var(--i3)', fontSize: 12 }}>Pas de photo</span></div>
                            }
                            <div className="mn-jour-plat-info">
                              <div className="mn-jour-plat-name">{plat?.nom}</div>
                              <div className="mn-jour-plat-price">{plat?.prix?.toLocaleString()} CFA</div>
                            </div>
                            <button className="mn-jour-plat-del" onClick={() => removeFromMenuGeneral(mg.id)}>
                              <IX />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MENU DU JOUR ── */}
      {tab === 'jour' && (
        <div>
          <div className="mn-section-head">
            <div>
              <span className="mn-section-title">Menu du jour</span>
              <p style={{ fontSize: 12.5, color: 'var(--i3)', marginTop: 4 }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="mn-notice">
            <IInfo />
            Les plats du jour sont mis en relief pour les clients et expirent automatiquement à l'heure de fermeture.
          </div>

          <div className="mn-card" style={{ marginBottom: 20 }}>
            <div className="mn-card-head">
              <span className="mn-card-title">
                <div className="mn-card-icon" style={{ background: 'var(--vd)', border: '1px solid var(--vb)', color: 'var(--v)' }}>
                  <IStar />
                </div>
                Ajouter un plat du jour
              </span>
            </div>
            <div className="mn-card-body">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <span className="mn-flabel">Choisir depuis l'historique</span>
                  <select className="mn-plain" value={selectedPlatJour} onChange={e => setSelectedPlatJour(e.target.value)}>
                    <option value="">Choisir un plat…</option>
                    {historique.map(p => <option key={p.id} value={p.id}>{p.nom} — {p.prix?.toLocaleString()} CFA</option>)}
                  </select>
                </div>
                <button className="mn-btn" onClick={addToMenuDuJour} disabled={!selectedPlatJour}>
                  <IPlus /> Ajouter
                </button>
              </div>
            </div>
          </div>

          {menuDuJour.length === 0 ? (
            <div className="mn-card">
              <div className="mn-empty"><IStar /><p>Aucun plat du jour — choisissez depuis l'historique</p></div>
            </div>
          ) : (
            <div className="mn-mdj-grid">
              {menuDuJour.map(mdj => {
                const plat = mdj.historique_plats;
                return (
                  <div key={mdj.id} className="mn-mdj-card">
                    {plat?.image_url
                      ? <img src={plat.image_url} alt={plat?.nom} className="mn-plat-img" />
                      : <div className="mn-plat-img-placeholder">Pas de photo</div>
                    }
                    <div className="mn-plat-info">
                      <div style={{ marginBottom: 8 }}>
                        <span className="mn-mdj-badge"><IStar /> Du jour</span>
                      </div>
                      <div className="mn-plat-name">{plat?.nom}</div>
                      {plat?.description && <div className="mn-plat-desc">{plat.description}</div>}
                      <div className="mn-plat-price">{plat?.prix?.toLocaleString()} CFA</div>
                    </div>
                    <div className="mn-plat-actions">
                      <button className="mn-btn danger sm" style={{ flex: 1 }} onClick={() => removeFromMenuDuJour(mdj.id)}>
                        <ITrash /> Retirer du menu
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}