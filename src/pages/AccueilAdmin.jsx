import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  .ka-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ka-root {
    font-family: 'DM Sans', sans-serif;
    background: #080809;
    color: #EBEBED;
    min-height: 100vh;
    padding: 0 0 80px;
  }

  /* ── NAV TABS ── */
  .ka-tabs {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(8,8,9,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: stretch;
    gap: 0;
    padding: 0 32px;
  }
  .ka-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #555560;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color 0.18s, border-color 0.18s;
    white-space: nowrap;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    font-family: inherit;
  }
  .ka-tab:hover { color: #EBEBED; }
  .ka-tab.active { color: #39FF5A; border-bottom-color: #39FF5A; }
  .ka-tab svg { flex-shrink: 0; }

  /* ── PAGE HEADER ── */
  .ka-header {
    padding: 36px 32px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  .ka-header-title {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #EBEBED;
    line-height: 1.1;
  }
  .ka-header-sub {
    font-size: 13px;
    color: #555560;
    margin-top: 6px;
  }
  .ka-live {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(57,255,90,0.08);
    border: 1px solid rgba(57,255,90,0.2);
    font-size: 11px;
    font-weight: 700;
    color: #39FF5A;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .ka-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #39FF5A;
    animation: kaPulse 2s ease-in-out infinite;
  }
  @keyframes kaPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  /* ── CONTENT AREA ── */
  .ka-content { padding: 0 32px; }

  /* ── STAT ROW ── */
  .ka-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
  }
  .ka-stat {
    background: #0F0F12;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
  }
  .ka-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent-line, rgba(57,255,90,0.3));
  }
  .ka-stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #555560;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 10px;
  }
  .ka-stat-value {
    font-family: 'DM Mono', monospace;
    font-size: 28px;
    font-weight: 500;
    color: #EBEBED;
    line-height: 1;
  }
  .ka-stat-sub {
    font-size: 11px;
    color: #555560;
    margin-top: 6px;
  }

  /* ── CARD ── */
  .ka-card {
    background: #0F0F12;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .ka-card-head {
    padding: 20px 24px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ka-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #EBEBED;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ka-card-title svg { color: #555560; }
  .ka-card-body { padding: 24px; }

  /* ── FLOATING LABEL INPUT ── */
  .ka-field {
    position: relative;
    margin-bottom: 16px;
  }
  .ka-field label {
    position: absolute;
    left: 14px;
    top: 14px;
    font-size: 13px;
    color: #555560;
    pointer-events: none;
    transition: all 0.15s ease;
    background: #0F0F12;
    padding: 0 4px;
    font-family: 'DM Sans', sans-serif;
  }
  .ka-field input:focus ~ label,
  .ka-field input:not(:placeholder-shown) ~ label,
  .ka-field select:focus ~ label,
  .ka-field textarea:focus ~ label,
  .ka-field textarea:not(:placeholder-shown) ~ label {
    top: -8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #39FF5A;
  }
  .ka-input {
    width: 100%;
    padding: 13px 14px;
    background: #080809;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #EBEBED;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .ka-input:focus { border-color: rgba(57,255,90,0.4); }
  .ka-input::placeholder { color: transparent; }
  .ka-input-plain {
    width: 100%;
    padding: 13px 14px;
    background: #080809;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #EBEBED;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .ka-input-plain:focus { border-color: rgba(57,255,90,0.4); }

  /* ── INLINE ROW FIELD ── */
  .ka-row-field {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    margin-bottom: 16px;
  }
  .ka-row-field .ka-field { flex: 1; margin-bottom: 0; }
  .ka-row-field .ka-field-group { flex: 1; }

  /* ── COLOR FIELD ── */
  .ka-color-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .ka-color-thumb {
    width: 46px; height: 46px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .ka-color-thumb input[type=color] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
  }

  /* ── GRID ── */
  .ka-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ka-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* ── BUTTONS ── */
  .ka-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 10px;
    background: #39FF5A;
    color: #050905;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    letter-spacing: 0.01em;
  }
  .ka-btn-primary:hover { opacity: 0.9; }
  .ka-btn-primary:active { transform: scale(0.98); }

  .ka-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #8A8A95;
    font-size: 12px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .ka-btn-ghost:hover { background: rgba(255,255,255,0.08); color: #EBEBED; }

  .ka-btn-save {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 14px;
    border-radius: 10px;
    background: rgba(57,255,90,0.1);
    border: 1px solid rgba(57,255,90,0.22);
    color: #39FF5A;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .ka-btn-save:hover { background: rgba(57,255,90,0.18); }

  .ka-btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    border-radius: 8px;
    background: rgba(255,68,85,0.08);
    border: 1px solid rgba(255,68,85,0.18);
    color: #FF4455;
    font-size: 12px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .ka-btn-danger:hover { background: rgba(255,68,85,0.15); }

  /* ── PRESET CHIPS ── */
  .ka-presets { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .ka-preset {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    background: #080809;
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: all 0.15s;
    font-size: 12px;
    font-weight: 500;
    color: #8A8A95;
    font-family: 'DM Sans', sans-serif;
  }
  .ka-preset:hover { border-color: rgba(57,255,90,0.3); color: #EBEBED; }
  .ka-preset-dots { display: flex; gap: 3px; }
  .ka-preset-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* ── COLOR PREVIEW BAR ── */
  .ka-color-preview {
    height: 6px;
    border-radius: 3px;
    margin-top: 10px;
    transition: background 0.2s;
  }

  /* ── SLOGAN LIST ── */
  .ka-slogan-list { display: flex; flex-direction: column; gap: 8px; }
  .ka-slogan-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06);
    background: #080809;
    transition: border-color 0.2s;
    position: relative;
  }
  .ka-slogan-item.active {
    border-color: rgba(57,255,90,0.25);
    background: rgba(57,255,90,0.03);
  }
  .ka-slogan-item.active::after {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: #39FF5A;
  }
  .ka-slogan-text { flex: 1; min-width: 0; }
  .ka-slogan-l1 { font-size: 13px; color: #8A8A95; font-style: italic; line-height: 1.5; }
  .ka-slogan-l2 { font-size: 13px; color: #39FF5A; font-style: italic; font-weight: 600; line-height: 1.5; }
  .ka-slogan-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .ka-active-badge {
    font-size: 10px;
    font-weight: 800;
    color: #39FF5A;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(57,255,90,0.1);
    border: 1px solid rgba(57,255,90,0.2);
  }

  /* ── CHEF CARD ── */
  .ka-chef-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06);
    background: #080809;
    margin-bottom: 8px;
    transition: border-color 0.2s;
  }
  .ka-chef-item.expired { border-color: rgba(255,68,85,0.2); background: rgba(255,68,85,0.02); }
  .ka-chef-emoji {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: #1A1A1E;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  .ka-chef-info { flex: 1; min-width: 0; }
  .ka-chef-name { font-size: 14px; font-weight: 600; color: #EBEBED; margin-bottom: 3px; }
  .ka-chef-desc { font-size: 12px; color: #555560; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ka-chef-meta { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
  .ka-chef-price {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #39FF5A;
  }
  .ka-time-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #555560;
  }
  .ka-time-tag.expired { background: rgba(255,68,85,0.08); border-color: rgba(255,68,85,0.2); color: #FF4455; }

  /* ── DIVIDER ── */
  .ka-divider {
    display: flex; align-items: center; gap: 14px;
    margin: 22px 0 20px;
  }
  .ka-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .ka-divider-label { font-size: 10px; font-weight: 700; color: #555560; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }

  /* ── EMPTY STATE ── */
  .ka-empty {
    padding: 32px 20px;
    text-align: center;
    border-radius: 12px;
    border: 1px dashed rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.01);
  }
  .ka-empty p { font-size: 13px; color: #555560; }

  /* ── SECTION PANEL ── */
  .ka-panel { animation: kaFadeIn 0.2s ease; }
  @keyframes kaFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  /* ── NOTICE ── */
  .ka-notice {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 10px;
    background: rgba(57,255,90,0.06);
    border: 1px solid rgba(57,255,90,0.15);
    font-size: 12px;
    color: #55CC66;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  .ka-notice svg { flex-shrink: 0; margin-top: 1px; }

  .ka-notice-warn {
    background: rgba(255,159,28,0.06);
    border-color: rgba(255,159,28,0.2);
    color: #CC8822;
  }
  .ka-notice-warn svg { color: #FF9F1C; }
  .ka-notice svg { color: #39FF5A; }

  /* ── SOCIAL GRID ── */
  .ka-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* ── LOADING ── */
  .ka-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 16px;
  }
  .ka-spinner {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(57,255,90,0.15);
    border-top-color: #39FF5A;
    animation: kaSpin 0.7s linear infinite;
  }
  @keyframes kaSpin { to { transform: rotate(360deg); } }
  .ka-loading-text { font-size: 13px; color: #555560; }

  /* ── FOCUS INPUT ── */
  .ka-input:focus-visible, .ka-input-plain:focus-visible { box-shadow: 0 0 0 3px rgba(57,255,90,0.1); }
`;

/* ─────────────────────────────────────────────
   TABS CONFIG
───────────────────────────────────────────── */
const TABS = [
  { id: 'couleurs',  label: 'Couleurs',           icon: <PaletteIcon /> },
  { id: 'infos',     label: 'Informations',        icon: <InfoIcon /> },
  { id: 'slogans',   label: 'Slogans',             icon: <QuoteIcon /> },
  { id: 'taglines',  label: 'Taglines',            icon: <SparkIcon /> },
  { id: 'chef',      label: 'Sélection du chef',   icon: <ChefIcon /> },
];

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function AccueilAdmin() {
  const [activeTab, setActiveTab] = useState('couleurs');
  const [params, setParams]               = useState({});
  const [slogans, setSlogans]             = useState([]);
  const [taglines, setTaglines]           = useState([]);
  const [historiquePlats, setHistoriquePlats] = useState([]);
  const [selectionChef, setSelectionChef] = useState([]);
  const [loading, setLoading]             = useState(true);

  const [newSlogan, setNewSlogan]         = useState({ ligne1: '', ligne2: '' });
  const [newTagline, setNewTagline]       = useState('');
  const [selectedPlatId, setSelectedPlatId] = useState('');
  const [heureFinChef, setHeureFinChef]   = useState('22:00');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [p, s, t, hp, sc] = await Promise.all([
      supabase.from('parametres').select('*'),
      supabase.from('slogans').select('*').eq('type', 'slogan').order('created_at', { ascending: false }),
      supabase.from('slogans').select('*').eq('type', 'tagline').order('created_at', { ascending: false }),
      supabase.from('historique_plats').select('*, categories_plats(nom, couleur)').order('nom'),
      supabase.from('selection_chef').select('*').eq('visible', true).order('created_at', { ascending: false }),
    ]);
    const paramsObj = {};
    (p.data || []).forEach(item => { paramsObj[item.cle] = item; });
    setParams(paramsObj);
    setSlogans(s.data || []);
    setTaglines(t.data || []);
    setHistoriquePlats(hp.data || []);
    setSelectionChef(sc.data || []);
    setLoading(false);
  };

  const updateParam = async (cle, valeur) => {
    await supabase.from('parametres').update({ valeur, updated_at: new Date() }).eq('cle', cle);
    fetchAll();
  };

  const saveParam = async (cle) => {
    const val = params[cle]?.valeur;
    if (!val) return;
    await updateParam(cle, val);
  };

  const setParamLocal = (cle, valeur) =>
    setParams(prev => ({ ...prev, [cle]: { ...prev[cle], valeur } }));

  /* SLOGANS */
  const addSlogan = async () => {
    if (!newSlogan.ligne1) return;
    await supabase.from('slogans').insert({
      texte_ligne1: newSlogan.ligne1,
      texte_ligne2: newSlogan.ligne2,
      type: 'slogan', actif: false,
    });
    setNewSlogan({ ligne1: '', ligne2: '' });
    fetchAll();
  };
  const activerSlogan = async (slogan) => {
    await supabase.from('slogans').update({ actif: false }).eq('type', 'slogan');
    await supabase.from('slogans').update({ actif: true }).eq('id', slogan.id);
    await updateParam('slogan_actif', `${slogan.texte_ligne1}|${slogan.texte_ligne2 || ''}`);
    fetchAll();
  };
  const supprimerSlogan = async (id) => {
    if (!confirm('Supprimer ?')) return;
    await supabase.from('slogans').delete().eq('id', id);
    fetchAll();
  };

  /* TAGLINES */
  const addTagline = async () => {
    if (!newTagline) return;
    await supabase.from('slogans').insert({ texte_ligne1: newTagline, type: 'tagline', actif: false });
    setNewTagline('');
    fetchAll();
  };
  const activerTagline = async (tagline) => {
    await supabase.from('slogans').update({ actif: false }).eq('type', 'tagline');
    await supabase.from('slogans').update({ actif: true }).eq('id', tagline.id);
    await updateParam('tagline', tagline.texte_ligne1);
    fetchAll();
  };

  /* CHEF */
  const addSelectionChef = async () => {
    if (!selectedPlatId) return;
    const plat = historiquePlats.find(p => p.id === selectedPlatId);
    if (!plat) return;
    await supabase.from('selection_chef').insert({
      menu_item_id: plat.id,
      nom: plat.nom,
      description: plat.description,
      prix: plat.prix,
      emoji: plat.emoji || '🍽️',
      tag: plat.categories_plats?.nom || '',
      heure_fin: heureFinChef,
      image_url: plat.image_url || null,
      visible: true,
    });
    setSelectedPlatId('');
    fetchAll();
  };
  const supprimerSelectionChef = async (id) => {
    await supabase.from('selection_chef').delete().eq('id', id);
    fetchAll();
  };

  /* ── RENDER ── */
  if (loading) return (
    <div className="ka-root">
      <style>{css}</style>
      <div className="ka-loading">
        <div className="ka-spinner" />
        <p className="ka-loading-text">Chargement…</p>
      </div>
    </div>
  );

  const activeSlogan  = slogans.find(s => s.actif);
  const activeTagline = taglines.find(t => t.actif);
  const expiredCount  = selectionChef.filter(item => {
    const [h, m] = (item.heure_fin || '22:00').split(':');
    const fin = new Date(); fin.setHours(+h, +m, 0);
    return new Date() > fin;
  }).length;

  return (
    <div className="ka-root">
      <style>{css}</style>

      {/* ── HEADER ── */}
      <div className="ka-header">
        <div>
          <h1 className="ka-header-title">Accueil</h1>
          <p className="ka-header-sub">Gérez le contenu affiché sur l'écran principal de l'app</p>
        </div>
        <div className="ka-live">
          <div className="ka-live-dot" />
          Connecté
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="ka-content">
        <div className="ka-stats">
          <StatCard label="Slogans" value={slogans.length} sub={activeSlogan ? 'actif' : 'aucun actif'} color="#39FF5A" />
          <StatCard label="Taglines" value={taglines.length} sub={activeTagline ? 'actif' : 'aucun actif'} color="#39FF5A" />
          <StatCard label="Sélection chef" value={selectionChef.length} sub={expiredCount > 0 ? `${expiredCount} expiré${expiredCount > 1 ? 's' : ''}` : 'tout actif'} color={expiredCount > 0 ? '#FF4455' : '#39FF5A'} />
          <StatCard label="Plats catalogue" value={historiquePlats.length} sub="disponibles" color="#FF9F1C" />
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="ka-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`ka-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PANELS ── */}
      <div className="ka-content" style={{ paddingTop: 28 }}>

        {/* ── COULEURS ── */}
        {activeTab === 'couleurs' && (
          <div className="ka-panel">
            <div className="ka-notice">
              <NoticeIcon />
              Les couleurs s'appliquent en temps réel sur l'app mobile à la prochaine ouverture. Les présets appliquent les deux simultanément.
            </div>

            <div className="ka-card">
              <div className="ka-card-head">
                <span className="ka-card-title"><PaletteIcon /> Thèmes prédéfinis</span>
              </div>
              <div className="ka-card-body">
                <div className="ka-presets">
                  {[
                    { label: 'Vert Kaleta',  primary: '#39FF5A', secondary: '#FF9F1C' },
                    { label: 'Orange',       primary: '#FF9F1C', secondary: '#39FF5A' },
                    { label: 'Bleu Nuit',    primary: '#38bdf8', secondary: '#FF9F1C' },
                    { label: 'Or Premium',   primary: '#F5C842', secondary: '#FF9F1C' },
                    { label: 'Rose Lounge',  primary: '#F57BCB', secondary: '#FF9F1C' },
                    { label: 'Violet',       primary: '#a78bfa', secondary: '#FF9F1C' },
                  ].map(preset => (
                    <button key={preset.label} className="ka-preset"
                      onClick={async () => {
                        setParamLocal('couleur_principale', preset.primary);
                        setParamLocal('couleur_secondaire', preset.secondary);
                        await supabase.from('parametres').update({ valeur: preset.primary }).eq('cle', 'couleur_principale');
                        await supabase.from('parametres').update({ valeur: preset.secondary }).eq('cle', 'couleur_secondaire');
                        fetchAll();
                      }}>
                      <div className="ka-preset-dots">
                        <div className="ka-preset-dot" style={{ background: preset.primary }} />
                        <div className="ka-preset-dot" style={{ background: preset.secondary }} />
                      </div>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ka-grid-2">
              {[
                { cle: 'couleur_principale', label: 'Couleur principale', fallback: '#39FF5A' },
                { cle: 'couleur_secondaire', label: 'Couleur secondaire',  fallback: '#FF9F1C' },
              ].map(f => (
                <div className="ka-card" key={f.cle}>
                  <div className="ka-card-head">
                    <span className="ka-card-title">{f.label}</span>
                  </div>
                  <div className="ka-card-body">
                    <div className="ka-color-row">
                      <div className="ka-color-thumb" style={{ background: params[f.cle]?.valeur || f.fallback }}>
                        <input type="color"
                          value={params[f.cle]?.valeur || f.fallback}
                          onChange={e => setParamLocal(f.cle, e.target.value)}
                        />
                      </div>
                      <input
                        className="ka-input-plain"
                        style={{ flex: 1 }}
                        value={params[f.cle]?.valeur || f.fallback}
                        onChange={e => setParamLocal(f.cle, e.target.value)}
                      />
                      <button className="ka-btn-save" onClick={() => saveParam(f.cle)}>
                        <SaveIcon />
                      </button>
                    </div>
                    <div className="ka-color-preview" style={{ background: params[f.cle]?.valeur || f.fallback }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INFOS ── */}
        {activeTab === 'infos' && (
          <div className="ka-panel">
            <div className="ka-card">
              <div className="ka-card-head">
                <span className="ka-card-title"><InfoIcon /> Contact & localisation</span>
              </div>
              <div className="ka-card-body">
                <div className="ka-grid-2">
                  {[
                    { cle: 'localisation', label: 'Localisation', placeholder: 'Deux Lions, en face du Lycée…' },
                    { cle: 'telephone',    label: 'Téléphone',     placeholder: '91 00 84 84' },
                  ].map(f => (
                    <div key={f.cle} className="ka-row-field">
                      <div className="ka-field" style={{ flex: 1 }}>
                        <input
                          className="ka-input"
                          placeholder={f.placeholder}
                          value={params[f.cle]?.valeur || ''}
                          onChange={e => setParamLocal(f.cle, e.target.value)}
                        />
                        <label>{f.label}</label>
                      </div>
                      <button className="ka-btn-save" onClick={() => saveParam(f.cle)}><SaveIcon /></button>
                    </div>
                  ))}
                </div>

                <Divider label="Horaires" />
                <div className="ka-notice ka-notice-warn">
                  <NoticeIcon />
                  L'heure de fermeture masque automatiquement la sélection du chef.
                </div>
                <div className="ka-grid-2">
                  {[
                    { cle: 'horaire_ouverture',  label: "Ouverture" },
                    { cle: 'horaire_fermeture',  label: 'Fermeture' },
                  ].map(f => (
                    <div key={f.cle} className="ka-row-field">
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#555560', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{f.label}</p>
                        <input type="time" className="ka-input-plain"
                          value={params[f.cle]?.valeur || ''}
                          onChange={e => setParamLocal(f.cle, e.target.value)}
                        />
                      </div>
                      <button className="ka-btn-save" onClick={() => saveParam(f.cle)}><SaveIcon /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ka-card">
              <div className="ka-card-head">
                <span className="ka-card-title"><LinkIcon /> Réseaux sociaux & liens</span>
              </div>
              <div className="ka-card-body">
                <div className="ka-social-grid">
                  {[
                    { cle: 'whatsapp_numero',  label: 'WhatsApp',      placeholder: '22891008484' },
                    { cle: 'adresse_complete', label: 'Adresse',        placeholder: 'Adresse complète…' },
                    { cle: 'google_maps_url',  label: 'Google Maps',    placeholder: 'https://maps.google.com/…' },
                    { cle: 'facebook_url',     label: 'Facebook',       placeholder: 'https://facebook.com/…' },
                    { cle: 'instagram_url',    label: 'Instagram',      placeholder: 'https://instagram.com/…' },
                    { cle: 'tiktok_url',       label: 'TikTok',         placeholder: 'https://tiktok.com/…' },
                  ].map(f => (
                    <div key={f.cle} className="ka-row-field">
                      <div className="ka-field" style={{ flex: 1 }}>
                        <input
                          className="ka-input"
                          placeholder={f.placeholder}
                          value={params[f.cle]?.valeur || ''}
                          onChange={e => setParamLocal(f.cle, e.target.value)}
                        />
                        <label>{f.label}</label>
                      </div>
                      <button className="ka-btn-save" onClick={() => saveParam(f.cle)}><SaveIcon /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SLOGANS ── */}
        {activeTab === 'slogans' && (
          <div className="ka-panel">
            <div className="ka-card" style={{ marginBottom: 16 }}>
              <div className="ka-card-head">
                <span className="ka-card-title"><PlusCircleIcon /> Nouveau slogan</span>
              </div>
              <div className="ka-card-body">
                <div style={{ marginBottom: 12 }}>
                  <div className="ka-field">
                    <input className="ka-input" placeholder="Ligne 1"
                      value={newSlogan.ligne1}
                      onChange={e => setNewSlogan({ ...newSlogan, ligne1: e.target.value })}
                    />
                    <label>Ligne 1</label>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div className="ka-field">
                    <input className="ka-input" placeholder="Ligne 2 (optionnel)"
                      value={newSlogan.ligne2}
                      onChange={e => setNewSlogan({ ...newSlogan, ligne2: e.target.value })}
                    />
                    <label>Ligne 2 (optionnel)</label>
                  </div>
                </div>
                {newSlogan.ligne1 && (
                  <div style={{
                    padding: '14px 18px', borderRadius: 10, marginBottom: 16,
                    background: 'rgba(57,255,90,0.04)', border: '1px solid rgba(57,255,90,0.12)',
                  }}>
                    <p style={{ fontSize: 11, color: '#555560', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 6 }}>Aperçu</p>
                    <p style={{ fontSize: 13, color: '#8A8A95', fontStyle: 'italic' }}>"{newSlogan.ligne1}</p>
                    {newSlogan.ligne2 && <p style={{ fontSize: 13, color: '#39FF5A', fontStyle: 'italic', fontWeight: 600 }}>{newSlogan.ligne2}"</p>}
                  </div>
                )}
                <button className="ka-btn-primary" onClick={addSlogan} disabled={!newSlogan.ligne1}
                  style={{ opacity: newSlogan.ligne1 ? 1 : 0.4 }}>
                  <PlusIcon /> Ajouter à l'historique
                </button>
              </div>
            </div>

            <div className="ka-card">
              <div className="ka-card-head">
                <span className="ka-card-title"><HistoryIcon /> Historique · {slogans.length}</span>
              </div>
              <div className="ka-card-body">
                {slogans.length === 0
                  ? <Empty label="Aucun slogan pour l'instant" />
                  : <div className="ka-slogan-list">
                    {slogans.map(s => (
                      <div key={s.id} className={`ka-slogan-item${s.actif ? ' active' : ''}`}>
                        <div className="ka-slogan-text">
                          <p className="ka-slogan-l1">"{s.texte_ligne1}</p>
                          {s.texte_ligne2 && <p className="ka-slogan-l2">{s.texte_ligne2}"</p>}
                        </div>
                        <div className="ka-slogan-actions">
                          {s.actif
                            ? <span className="ka-active-badge">Actif</span>
                            : <button className="ka-btn-ghost" onClick={() => activerSlogan(s)}>Activer</button>
                          }
                          <button className="ka-btn-danger" onClick={() => supprimerSlogan(s.id)}
                            style={{ padding: '8px 10px', fontSize: 13 }}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ── TAGLINES ── */}
        {activeTab === 'taglines' && (
          <div className="ka-panel">
            <div className="ka-card" style={{ marginBottom: 16 }}>
              <div className="ka-card-head">
                <span className="ka-card-title"><PlusCircleIcon /> Nouvelle tagline</span>
              </div>
              <div className="ka-card-body">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div className="ka-field" style={{ flex: 1, marginBottom: 0 }}>
                    <input className="ka-input" placeholder="Tagline"
                      value={newTagline}
                      onChange={e => setNewTagline(e.target.value)}
                    />
                    <label>Texte de la tagline</label>
                  </div>
                  <button className="ka-btn-primary" onClick={addTagline} disabled={!newTagline}
                    style={{ opacity: newTagline ? 1 : 0.4, flexShrink: 0 }}>
                    <PlusIcon /> Ajouter
                  </button>
                </div>
              </div>
            </div>

            <div className="ka-card">
              <div className="ka-card-head">
                <span className="ka-card-title"><HistoryIcon /> Historique · {taglines.length}</span>
              </div>
              <div className="ka-card-body">
                {taglines.length === 0
                  ? <Empty label="Aucune tagline pour l'instant" />
                  : <div className="ka-slogan-list">
                    {taglines.map(t => (
                      <div key={t.id} className={`ka-slogan-item${t.actif ? ' active' : ''}`}>
                        <div className="ka-slogan-text">
                          <p style={{ fontSize: 13, color: '#EBEBED', fontWeight: 500 }}>{t.texte_ligne1}</p>
                        </div>
                        <div className="ka-slogan-actions">
                          {t.actif
                            ? <span className="ka-active-badge">Actif</span>
                            : <button className="ka-btn-ghost" onClick={() => activerTagline(t)}>Activer</button>
                          }
                          <button className="ka-btn-danger" onClick={() => supprimerSlogan(t.id)}
                            style={{ padding: '8px 10px', fontSize: 13 }}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ── CHEF ── */}
        {activeTab === 'chef' && (
          <div className="ka-panel">
            <div className="ka-card" style={{ marginBottom: 16 }}>
              <div className="ka-card-head">
                <span className="ka-card-title"><PlusCircleIcon /> Ajouter un plat</span>
              </div>
              <div className="ka-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 16, marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#555560', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                      Plat — {historiquePlats.length} disponibles
                    </p>
                    <select className="ka-input-plain" value={selectedPlatId} onChange={e => setSelectedPlatId(e.target.value)}>
                      <option value="">Sélectionner…</option>
                      {historiquePlats.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nom} — {p.prix?.toLocaleString()} CFA{p.categories_plats ? ` · ${p.categories_plats.nom}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#555560', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Heure de fin</p>
                    <input type="time" className="ka-input-plain" value={heureFinChef} onChange={e => setHeureFinChef(e.target.value)} />
                  </div>
                </div>
                <button className="ka-btn-primary" onClick={addSelectionChef} disabled={!selectedPlatId}
                  style={{ opacity: selectedPlatId ? 1 : 0.4 }}>
                  <PlusIcon /> Ajouter à la sélection
                </button>
              </div>
            </div>

            <div className="ka-card">
              <div className="ka-card-head">
                <span className="ka-card-title"><ChefIcon /> Sélection active · {selectionChef.length}</span>
                {expiredCount > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(255,68,85,0.1)', color: '#FF4455', border: '1px solid rgba(255,68,85,0.2)',
                  }}>
                    {expiredCount} expiré{expiredCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="ka-card-body">
                {selectionChef.length === 0
                  ? <Empty label="Aucun plat sélectionné" />
                  : selectionChef.map(item => {
                    const [h, m] = (item.heure_fin || '22:00').split(':');
                    const fin = new Date(); fin.setHours(+h, +m, 0);
                    const expired = new Date() > fin;
                    return (
                      <div key={item.id} className={`ka-chef-item${expired ? ' expired' : ''}`}>
                        {/* IMAGE DU PLAT */}
                        <div style={{
                          width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
                          flexShrink: 0, background: '#0F0F12',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.nom}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <div style={{ display: item.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                            {item.emoji || '🍽️'}
                          </div>
                        </div>
                        <div className="ka-chef-info">
                          <div className="ka-chef-name">{item.nom}</div>
                          <div className="ka-chef-desc">{item.description}</div>
                          <div className="ka-chef-meta">
                            <span className="ka-chef-price">{item.prix?.toLocaleString()} CFA</span>
                            <span className={`ka-time-tag${expired ? ' expired' : ''}`}>
                              <ClockIcon size={10} />
                              {expired ? 'Expiré' : `Jusqu'à ${item.heure_fin}`}
                            </span>
                          </div>
                        </div>
                        <button className="ka-btn-danger" onClick={() => supprimerSelectionChef(item.id)}>
                          Retirer
                        </button>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function StatCard({ label, value, sub, color }) {
  return (
    <div className="ka-stat" style={{ '--accent-line': color + '55' }}>
      <p className="ka-stat-label">{label}</p>
      <p className="ka-stat-value" style={{ color }}>{value}</p>
      <p className="ka-stat-sub">{sub}</p>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div className="ka-divider">
      <div className="ka-divider-line" />
      <span className="ka-divider-label">{label}</span>
      <div className="ka-divider-line" />
    </div>
  );
}

function Empty({ label }) {
  return (
    <div className="ka-empty"><p>{label}</p></div>
  );
}

/* ─────────────────────────────────────────────
   ICONS (SVG inline)
───────────────────────────────────────────── */
function Ico({ d, size = 15, children, vb = '0 0 24 24' }) {
  return (
    <svg width={size} height={size} viewBox={vb} fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {d ? <path d={d} /> : children}
    </svg>
  );
}
function PaletteIcon()     { return <Ico size={14}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path strokeWidth={1.8} d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></Ico>; }
function InfoIcon()        { return <Ico size={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Ico>; }
function QuoteIcon()       { return <Ico size={14} d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />; }
function SparkIcon()       { return <Ico size={14} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />; }
function ChefIcon()        { return <Ico size={14}><path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 0119 0A4 4 0 0118 13.87V21H6v-7.13z"/><line x1="6" y1="17" x2="18" y2="17"/></Ico>; }
function SaveIcon()        { return <Ico size={15}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Ico>; }
function PlusIcon()        { return <Ico size={14}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ico>; }
function TrashIcon()       { return <Ico size={14}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></Ico>; }
function PlusCircleIcon()  { return <Ico size={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></Ico>; }
function HistoryIcon()     { return <Ico size={14}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-3.56L1 10"/></Ico>; }
function LinkIcon()        { return <Ico size={14}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></Ico>; }
function ClockIcon({ size = 13 }) { return <Ico size={size}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Ico>; }
function NoticeIcon()      { return <Ico size={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Ico>; }