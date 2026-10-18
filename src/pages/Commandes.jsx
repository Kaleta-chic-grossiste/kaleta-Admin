import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

.cm * { box-sizing: border-box; margin: 0; padding: 0; }
.cm {
  font-family: 'Geist', -apple-system, sans-serif;
  --bg:  #070709;
  --s1:  #0D0D14;
  --s2:  #13131E;
  --s3:  #1A1A28;
  --bd:  rgba(255,255,255,0.06);
  --bdh: rgba(255,255,255,0.11);
  --v:   #39FF5A;
  --vd:  rgba(57,255,90,0.07);
  --vb:  rgba(57,255,90,0.2);
  --vg:  rgba(57,255,90,0.04);
  --o:   #FF9F1C;
  --od:  rgba(255,159,28,0.08);
  --ob:  rgba(255,159,28,0.2);
  --b:   #38bdf8;
  --bd2: rgba(56,189,248,0.08);
  --bb:  rgba(56,189,248,0.2);
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
.cm-loader { display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:14px; }
.cm-spinner { width:26px;height:26px;border-radius:50%;border:2px solid rgba(57,255,90,.12);border-top-color:var(--v);animation:cmSpin .65s linear infinite; }
@keyframes cmSpin { to{transform:rotate(360deg)} }
.cm-loader-txt { font-size:13px;color:var(--i3); }

/* ── HEADER ── */
.cm-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px; }
.cm-title { font-size:22px;font-weight:600;letter-spacing:-.03em;color:var(--i0); }
.cm-sub { font-size:12.5px;color:var(--i3);margin-top:5px; }
.cm-total-pill {
  display:flex;align-items:center;gap:8px;padding:8px 16px;
  border-radius:9px;background:var(--s2);border:1px solid var(--bd);
  font-size:12.5px;color:var(--i3);white-space:nowrap;
}
.cm-total-val { font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--i0); }

/* ── SUMMARY ── */
.cm-summary { display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px; }
.cm-scard {
  padding:14px 16px;border-radius:12px;border:1px solid;
  cursor:pointer;transition:opacity .15s;
}
.cm-scard:hover { opacity:.8; }
.cm-scard-n { font-family:'Geist Mono',monospace;font-size:22px;font-weight:600;line-height:1; }
.cm-scard-lbl { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-top:4px;opacity:.75; }

/* ── TOOLBAR ── */
.cm-toolbar { display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap; }
.cm-search-wrap { position:relative;flex:1;min-width:200px; }
.cm-search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--i3);pointer-events:none; }
.cm-search {
  width:100%;padding:12px 14px 12px 42px;
  background:var(--s1);border:1px solid var(--bd);
  border-radius:10px;color:var(--i0);font-size:13.5px;
  font-family:'Geist',sans-serif;outline:none;
  transition:border-color .15s,box-shadow .15s;
}
.cm-search:focus { border-color:var(--vb);box-shadow:0 0 0 3px var(--vg); }
.cm-search::placeholder { color:var(--i3); }
.cm-fchip {
  padding:11px 18px;border-radius:9px;font-size:12.5px;font-weight:600;
  cursor:pointer;border:1px solid var(--bd);background:var(--s1);
  color:var(--i3);font-family:'Geist',sans-serif;transition:all .15s;white-space:nowrap;
}
.cm-fchip:hover { border-color:var(--bdh);color:var(--i1); }
.cm-fchip.on { background:var(--v);color:#040a06;border-color:transparent; }

/* ── TABLE CARD ── */
.cm-tcard { background:var(--s1);border:1px solid var(--bd);border-radius:16px;overflow:hidden; }
.cm-tscroll { overflow-x:auto; }
.cm-table { width:100%;border-collapse:collapse;min-width:900px; }
.cm-table thead { background:var(--s2); }
.cm-table thead tr { border-bottom:1px solid var(--bd); }
.cm-table th {
  padding:14px 20px;font-size:10px;font-weight:700;
  color:var(--i3);text-transform:uppercase;letter-spacing:.1em;
  text-align:left;white-space:nowrap;
}
.cm-table tbody tr { border-bottom:1px solid var(--bd);transition:background .12s; }
.cm-table tbody tr:last-child { border-bottom:none; }
.cm-table tbody tr:hover { background:rgba(255,255,255,0.022); }
.cm-table td { padding:16px 20px;vertical-align:middle; }

/* ── CELLS ── */
.cm-cell-id {
  font-family:'Geist Mono',monospace;font-size:12.5px;
  font-weight:600;color:var(--i0);letter-spacing:.04em;white-space:nowrap;
}
.cm-cell-name { display:flex;align-items:center;gap:10px; }
.cm-av {
  width:34px;height:34px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  font-size:11.5px;font-weight:700;flex-shrink:0;
  font-family:'Geist Mono',monospace;
}
.cm-name-txt { font-size:13.5px;font-weight:600;color:var(--i0);white-space:nowrap; }
.cm-phone-a { font-family:'Geist Mono',monospace;font-size:12.5px;color:var(--v);text-decoration:none;transition:opacity .15s; }
.cm-phone-a:hover { opacity:.7; }
.cm-date { font-family:'Geist Mono',monospace;font-size:12.5px;color:var(--i2);white-space:nowrap; }
.cm-articles { font-family:'Geist Mono',monospace;font-size:12.5px;color:var(--i2);white-space:nowrap; }
.cm-total { font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:600;color:var(--v);white-space:nowrap; }

/* ── ITEMS POPOVER (tooltip) ── */
.cm-items-wrap { position:relative; }
.cm-items-btn {
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 11px;border-radius:8px;
  background:var(--s3);border:1px solid var(--bd);
  color:var(--i2);font-size:12px;font-weight:600;
  font-family:'Geist',sans-serif;cursor:pointer;transition:all .15s;
  white-space:nowrap;
}
.cm-items-btn:hover { border-color:var(--bdh);color:var(--i1); }

/* ── STATUS SELECT ── */
.cm-ss {
  padding:6px 28px 6px 12px;border-radius:9px;
  font-size:12px;font-weight:700;font-family:'Geist',sans-serif;
  cursor:pointer;outline:none;border:1px solid;transition:all .15s;
  appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238A8A9A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 9px center;
}

/* ── BADGE ── */
.cm-badge {
  display:inline-flex;align-items:center;padding:4px 11px;
  border-radius:999px;font-size:11px;font-weight:700;
  letter-spacing:.04em;border:1px solid;white-space:nowrap;
}

/* ── ACTIONS ── */
.cm-acts { display:flex;gap:7px;align-items:center; }
.cm-btn-wa {
  display:inline-flex;align-items:center;gap:5px;
  padding:7px 12px;border-radius:9px;
  background:rgba(37,211,102,.09);border:1px solid rgba(37,211,102,.22);
  color:#25D366;font-size:11.5px;font-weight:700;
  font-family:'Geist',sans-serif;text-decoration:none;
  transition:background .15s;white-space:nowrap;
}
.cm-btn-wa:hover { background:rgba(37,211,102,.18); }

/* ── EXPAND ROW ── */
.cm-expand-row { background:var(--bg); }
.cm-expand-row td { padding:0; }
.cm-expand-inner { padding:0 20px 16px 20px; }
.cm-expand-items {
  background:var(--s1);border:1px solid var(--bd);
  border-radius:12px;overflow:hidden;
}
.cm-expand-item {
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 16px;border-bottom:1px solid var(--bd);gap:12px;
}
.cm-expand-item:last-child { border-bottom:none; }
.cm-ei-left { display:flex;align-items:center;gap:10px;min-width:0; }
.cm-ei-emoji {
  width:30px;height:30px;border-radius:8px;
  background:var(--s3);border:1px solid var(--bd);
  display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;
}
.cm-ei-name { font-size:13px;color:var(--i1); }
.cm-ei-qty {
  font-family:'Geist Mono',monospace;font-size:11px;font-weight:600;
  padding:2px 7px;border-radius:6px;background:var(--s3);border:1px solid var(--bd);color:var(--i2);
}
.cm-ei-price { font-family:'Geist Mono',monospace;font-size:13px;font-weight:500;color:var(--v); }

/* ── EMPTY ── */
.cm-empty { padding:60px 20px;text-align:center; }
.cm-empty p { font-size:13.5px;color:var(--i3);margin-top:10px; }

/* ── FOOTER ── */
.cm-tfooter {
  padding:14px 22px;border-top:1px solid var(--bd);background:var(--s2);
  display:flex;align-items:center;justify-content:space-between;
  font-size:12.5px;color:var(--i3);
}
.cm-tfooter-mono { font-family:'Geist Mono',monospace;color:var(--i2); }
`;

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const STATUTS = ['nouvelle', 'en préparation', 'prête', 'livrée', 'annulée'];

const ST = {
  'nouvelle':       { bg: 'rgba(255,159,28,0.08)',  color: '#FF9F1C', border: 'rgba(255,159,28,0.25)' },
  'en préparation': { bg: 'rgba(56,189,248,0.08)',  color: '#38bdf8', border: 'rgba(56,189,248,0.25)' },
  'prête':          { bg: 'rgba(57,255,90,0.08)',   color: '#39FF5A', border: 'rgba(57,255,90,0.25)' },
  'livrée':         { bg: 'rgba(57,255,90,0.05)',   color: '#2ECC71', border: 'rgba(46,204,113,0.22)' },
  'annulée':        { bg: 'rgba(255,77,94,0.08)',   color: '#FF4D5E', border: 'rgba(255,77,94,0.25)' },
};

const SUMMARY_CFG = [
  { key: 'nouvelle',       label: 'Nouvelles',      bg: 'rgba(255,159,28,0.05)',  color: '#FF9F1C', border: 'rgba(255,159,28,0.18)' },
  { key: 'en préparation', label: 'En prép.',       bg: 'rgba(56,189,248,0.05)',  color: '#38bdf8', border: 'rgba(56,189,248,0.18)' },
  { key: 'prête',          label: 'Prêtes',         bg: 'rgba(57,255,90,0.05)',   color: '#39FF5A', border: 'rgba(57,255,90,0.18)' },
  { key: 'livrée',         label: 'Livrées',        bg: 'rgba(57,255,90,0.03)',   color: '#2ECC71', border: 'rgba(46,204,113,0.18)' },
  { key: 'annulée',        label: 'Annulées',       bg: 'rgba(255,77,94,0.05)',   color: '#FF4D5E', border: 'rgba(255,77,94,0.18)' },
];

const AVC = [
  { bg: 'rgba(57,255,90,0.12)',   color: '#39FF5A', border: 'rgba(57,255,90,0.2)' },
  { bg: 'rgba(255,159,28,0.12)',  color: '#FF9F1C', border: 'rgba(255,159,28,0.2)' },
  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  { bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8', border: 'rgba(56,189,248,0.2)' },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const avatarColor = name => AVC[(name?.charCodeAt(0) || 0) % AVC.length];
const initials    = name => {
  const p = (name || '').trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : (name || 'CL').slice(0, 2).toUpperCase();
};
const fmtDate = d => {
  try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  catch { return d; }
};
const shortId = id => '#' + (id || '').slice(0, 8).toUpperCase();

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const I = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const ICart     = () => <I size={15}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></I>;
const ISearch   = () => <I><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>;
const IChevron  = ({ open }) => <I size={13}><polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}/></I>;
const IWA       = () => <I size={13}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></I>;

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('tous');
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => { fetchCommandes(); }, []);

  const fetchCommandes = async () => {
    const { data } = await supabase.from('commandes').select('*').order('created_at', { ascending: false });
    setCommandes(data || []);
    setLoading(false);
  };

  const updateStatut = async (id, statut) => {
    await supabase.from('commandes').update({ statut }).eq('id', id);
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut } : c));
  };

  const filtered = commandes.filter(c => {
    const mf = filter === 'tous' || c.statut === filter;
    const ms = !search
      || c.nom_client?.toLowerCase().includes(search.toLowerCase())
      || c.telephone?.includes(search)
      || c.id?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  if (loading) return (
    <div className="cm">
      <style>{STYLES}</style>
      <div className="cm-loader">
        <div className="cm-spinner" />
        <p className="cm-loader-txt">Chargement…</p>
      </div>
    </div>
  );

  return (
    <div className="cm">
      <style>{STYLES}</style>

      {/* HEADER */}
      <div className="cm-header">
        <div>
          <h1 className="cm-title">Commandes</h1>
          <p className="cm-sub">Gérez et suivez toutes les commandes en temps réel</p>
        </div>
        <div className="cm-total-pill">
          <ICart />
          <span className="cm-total-val">{commandes.length}</span>
          commandes
        </div>
      </div>

      {/* SUMMARY */}
      <div className="cm-summary">
        {SUMMARY_CFG.map(s => (
          <div key={s.key} className="cm-scard"
            style={{ background: s.bg, borderColor: s.border, color: s.color }}
            onClick={() => setFilter(filter === s.key ? 'tous' : s.key)}>
            <div className="cm-scard-n">{commandes.filter(c => c.statut === s.key).length}</div>
            <div className="cm-scard-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="cm-toolbar">
        <div className="cm-search-wrap">
          <span className="cm-search-icon"><ISearch /></span>
          <input
            className="cm-search"
            placeholder="Rechercher par client, téléphone, ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {['tous', ...STATUTS].map(s => (
          <button key={s}
            className={`cm-fchip${filter === s ? ' on' : ''}`}
            onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="cm-tcard">
        <div className="cm-tscroll">
          <table className="cm-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                <th>ID</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="cm-empty">
                      <ICart />
                      <p>Aucune commande trouvée</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(c => {
                const st    = ST[c.statut] || { bg: 'rgba(138,138,154,.1)', color: '#8A8A9A', border: 'rgba(138,138,154,.25)' };
                const av    = avatarColor(c.nom_client || 'CL');
                const items = Array.isArray(c.items) ? c.items : [];
                const isOpen = expanded === c.id;
                const waMsg  = encodeURIComponent(`Bonjour${c.nom_client ? ' ' + c.nom_client : ''}, votre commande Kaleta est ${c.statut} !`);

                return (
                  <>
                    <tr key={c.id}>
                      {/* EXPAND TOGGLE */}
                      <td style={{ textAlign: 'center', paddingLeft: 12 }}>
                        <button
                          onClick={() => setExpanded(isOpen ? null : c.id)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 26, height: 26, borderRadius: 7,
                            background: isOpen ? 'var(--vd)' : 'var(--s3)',
                            border: `1px solid ${isOpen ? 'var(--vb)' : 'var(--bd)'}`,
                            color: isOpen ? 'var(--v)' : 'var(--i3)',
                            cursor: 'pointer', transition: 'all .15s',
                          }}>
                          <IChevron open={isOpen} />
                        </button>
                      </td>

                      <td className="cm-cell-id">{shortId(c.id)}</td>

                      <td>
                        <div className="cm-cell-name">
                          <div className="cm-av"
                            style={{ background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>
                            {initials(c.nom_client || 'CL')}
                          </div>
                          <span className="cm-name-txt">{c.nom_client || '—'}</span>
                        </div>
                      </td>

                      <td>
                        {c.telephone
                          ? <a className="cm-phone-a" href={`tel:${c.telephone}`}>{c.telephone}</a>
                          : <span style={{ color: 'var(--i3)', fontSize: 13 }}>—</span>
                        }
                      </td>

                      <td className="cm-date">{fmtDate(c.created_at)}</td>

                      <td>
                        <span style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: 12.5, color: 'var(--i2)',
                          padding: '4px 10px', borderRadius: 8,
                          background: 'var(--s3)', border: '1px solid var(--bd)',
                        }}>
                          {items.length} art.
                        </span>
                      </td>

                      <td className="cm-total">{c.total?.toLocaleString()} CFA</td>

                      <td>
                        <select
                          className="cm-ss"
                          value={c.statut}
                          onChange={e => updateStatut(c.id, e.target.value)}
                          style={{ background: st.bg, color: st.color, borderColor: st.border }}
                        >
                          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>

                      <td>
                        {c.telephone && (
                          <div className="cm-acts">
                            <a className="cm-btn-wa"
                              href={`https://wa.me/${c.telephone?.replace(/\s/g, '')}?text=${waMsg}`}
                              target="_blank" rel="noreferrer">
                              <IWA /> WA
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* EXPANDED ITEMS ROW */}
                    {isOpen && items.length > 0 && (
                      <tr key={`${c.id}-expand`} className="cm-expand-row">
                        <td colSpan={9}>
                          <div className="cm-expand-inner">
                            <div className="cm-expand-items">
                              {items.map((item, i) => (
                                <div key={i} className="cm-expand-item">
                                  <div className="cm-ei-left">
                                    <div className="cm-ei-emoji">{item.emoji || '🍽️'}</div>
                                    <span className="cm-ei-name">{item.name}</span>
                                    <span className="cm-ei-qty">×{item.qty}</span>
                                  </div>
                                  <span className="cm-ei-price">
                                    {(item.price * item.qty).toLocaleString()} CFA
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="cm-tfooter">
          <span>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {filter !== 'tous' ? ` · ${filter}` : ''}
          </span>
          <span className="cm-tfooter-mono">{commandes.length} au total</span>
        </div>
      </div>
    </div>
  );
}