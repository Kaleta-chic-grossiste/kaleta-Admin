import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

.rv * { box-sizing: border-box; margin: 0; padding: 0; }
.rv {
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
.rv-loader { display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:14px; }
.rv-spinner { width:26px;height:26px;border-radius:50%;border:2px solid rgba(57,255,90,.12);border-top-color:var(--v);animation:rvSpin .65s linear infinite; }
@keyframes rvSpin { to{transform:rotate(360deg)} }
.rv-loader-txt { font-size:13px;color:var(--i3); }

/* ── HEADER ── */
.rv-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px; }
.rv-title { font-size:22px;font-weight:600;letter-spacing:-.03em;color:var(--i0);line-height:1; }
.rv-sub { font-size:12.5px;color:var(--i3);margin-top:5px; }
.rv-total-pill {
  display:flex;align-items:center;gap:8px;
  padding:8px 16px;border-radius:9px;
  background:var(--s2);border:1px solid var(--bd);
  font-size:12.5px;color:var(--i3);white-space:nowrap;
}
.rv-total-val { font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--i0); }

/* ── SUMMARY CARDS ── */
.rv-summary { display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px; }
.rv-scard {
  display:flex;align-items:center;gap:14px;
  padding:16px 18px;border-radius:12px;border:1px solid;
  cursor:pointer;transition:opacity .15s;
}
.rv-scard:hover { opacity:.8; }
.rv-scard-n { font-family:'Geist Mono',monospace;font-size:24px;font-weight:600;line-height:1; }
.rv-scard-lbl { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-top:3px;opacity:.75; }

/* ── TOOLBAR ── */
.rv-toolbar { display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap; }
.rv-search-wrap { position:relative;flex:1;min-width:220px; }
.rv-search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--i3);pointer-events:none; }
.rv-search {
  width:100%;padding:12px 14px 12px 42px;
  background:var(--s1);border:1px solid var(--bd);
  border-radius:10px;color:var(--i0);
  font-size:13.5px;font-family:'Geist',sans-serif;
  outline:none;transition:border-color .15s,box-shadow .15s;
}
.rv-search:focus { border-color:var(--vb);box-shadow:0 0 0 3px var(--vg); }
.rv-search::placeholder { color:var(--i3); }
.rv-fchip {
  padding:11px 18px;border-radius:9px;
  font-size:12.5px;font-weight:600;cursor:pointer;
  border:1px solid var(--bd);background:var(--s1);
  color:var(--i3);font-family:'Geist',sans-serif;
  transition:all .15s;white-space:nowrap;
}
.rv-fchip:hover { border-color:var(--bdh);color:var(--i1); }
.rv-fchip.on { background:var(--v);color:#040a06;border-color:transparent; }

/* ── TABLE CARD ── */
.rv-tcard { background:var(--s1);border:1px solid var(--bd);border-radius:16px;overflow:hidden; }
.rv-tscroll { overflow-x:auto; }
.rv-table { width:100%;border-collapse:collapse;min-width:860px; }
.rv-table thead { background:var(--s2); }
.rv-table thead tr { border-bottom:1px solid var(--bd); }
.rv-table th {
  padding:14px 20px;font-size:10px;font-weight:700;
  color:var(--i3);text-transform:uppercase;letter-spacing:.1em;
  text-align:left;white-space:nowrap;
}
.rv-table tbody tr { border-bottom:1px solid var(--bd);transition:background .12s; }
.rv-table tbody tr:last-child { border-bottom:none; }
.rv-table tbody tr:hover { background:rgba(255,255,255,0.022); }
.rv-table td { padding:18px 20px;vertical-align:middle; }

/* ── CELLS ── */
.rv-cell-name { display:flex;align-items:center;gap:12px; }
.rv-av {
  width:36px;height:36px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;flex-shrink:0;
  font-family:'Geist Mono',monospace;letter-spacing:-.02em;
}
.rv-name-txt { font-size:14px;font-weight:600;color:var(--i0);white-space:nowrap; }
.rv-phone-a { font-family:'Geist Mono',monospace;font-size:13px;color:var(--v);text-decoration:none;transition:opacity .15s; }
.rv-phone-a:hover { opacity:.7; }
.rv-mono { font-family:'Geist Mono',monospace;font-size:13px;color:var(--i1);white-space:nowrap; }
.rv-pers {
  display:inline-flex;align-items:center;justify-content:center;
  width:30px;height:30px;border-radius:8px;
  background:var(--s3);border:1px solid var(--bd);
  font-family:'Geist Mono',monospace;font-size:13px;font-weight:600;color:var(--i1);
}
.rv-tchip {
  display:inline-flex;padding:4px 12px;border-radius:999px;
  font-size:11.5px;font-weight:600;
  background:var(--s3);border:1px solid var(--bd);color:var(--i2);white-space:nowrap;
}
.rv-note { font-size:12.5px;color:var(--i3);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }

/* ── STATUS SELECT ── */
.rv-ss {
  padding:6px 28px 6px 12px;border-radius:9px;
  font-size:12px;font-weight:700;font-family:'Geist',sans-serif;
  cursor:pointer;outline:none;border:1px solid;
  transition:all .15s;
  appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238A8A9A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 9px center;
}

/* ── ACTIONS ── */
.rv-acts { display:flex;gap:8px;align-items:center; }
.rv-btn-wa {
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 13px;border-radius:9px;
  background:rgba(37,211,102,.09);border:1px solid rgba(37,211,102,.22);
  color:#25D366;font-size:12px;font-weight:700;
  font-family:'Geist',sans-serif;text-decoration:none;
  transition:background .15s;white-space:nowrap;
}
.rv-btn-wa:hover { background:rgba(37,211,102,.18); }
.rv-btn-del {
  display:inline-flex;align-items:center;justify-content:center;
  width:32px;height:32px;border-radius:9px;
  background:var(--rd);border:1px solid var(--rb);
  color:var(--r);cursor:pointer;transition:background .15s;flex-shrink:0;
}
.rv-btn-del:hover { background:rgba(255,77,94,.18); }

/* ── EMPTY ── */
.rv-empty { padding:60px 20px;text-align:center; }
.rv-empty p { font-size:13.5px;color:var(--i3);margin-top:10px; }

/* ── FOOTER ── */
.rv-tfooter {
  padding:14px 22px;border-top:1px solid var(--bd);
  background:var(--s2);
  display:flex;align-items:center;justify-content:space-between;
  font-size:12.5px;color:var(--i3);
}
.rv-tfooter-mono { font-family:'Geist Mono',monospace;color:var(--i2); }
`;

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const STATUTS = ['en attente', 'confirmée', 'annulée', 'terminée'];

const ST = {
  'confirmée':  { bg: 'rgba(57,255,90,0.08)',  color: '#39FF5A', border: 'rgba(57,255,90,0.25)' },
  'en attente': { bg: 'rgba(255,159,28,0.08)', color: '#FF9F1C', border: 'rgba(255,159,28,0.25)' },
  'annulée':    { bg: 'rgba(255,77,94,0.08)',  color: '#FF4D5E', border: 'rgba(255,77,94,0.25)' },
  'terminée':   { bg: 'rgba(138,138,154,0.1)', color: '#8A8A9A', border: 'rgba(138,138,154,0.25)' },
};

const SUMMARY = [
  { key: 'confirmée',  label: 'Confirmées',  bg: 'rgba(57,255,90,0.05)',   color: '#39FF5A', border: 'rgba(57,255,90,0.18)' },
  { key: 'en attente', label: 'En attente',  bg: 'rgba(255,159,28,0.05)',  color: '#FF9F1C', border: 'rgba(255,159,28,0.18)' },
  { key: 'annulée',    label: 'Annulées',    bg: 'rgba(255,77,94,0.05)',   color: '#FF4D5E', border: 'rgba(255,77,94,0.18)' },
  { key: 'terminée',   label: 'Terminées',   bg: 'rgba(138,138,154,0.06)', color: '#8A8A9A', border: 'rgba(138,138,154,0.18)' },
];

const AVC = [
  { bg: 'rgba(57,255,90,0.12)',  color: '#39FF5A', border: 'rgba(57,255,90,0.2)' },
  { bg: 'rgba(255,159,28,0.12)', color: '#FF9F1C', border: 'rgba(255,159,28,0.2)' },
  { bg: 'rgba(167,139,250,0.12)',color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  { bg: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: 'rgba(56,189,248,0.2)' },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const avatarColor = name => AVC[(name?.charCodeAt(0) || 0) % AVC.length];
const initials    = name => {
  const p = (name || '').trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : (name || '??').slice(0, 2).toUpperCase();
};
const fmtDate = d => {
  try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const I = ({ size = 14, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const ISearch   = () => <I><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>;
const ICalendar = () => <I size={15}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></I>;
const ITrash    = () => <I size={13}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></I>;
const IWA       = () => <I size={13}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></I>;

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('tous');
  const [search, setSearch]             = useState('');

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    const { data } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    setReservations(data || []);
    setLoading(false);
  };

  const updateStatut = async (id, statut) => {
    await supabase.from('reservations').update({ statut }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut } : r));
  };

  const deleteReservation = async (id) => {
    if (!confirm('Supprimer cette réservation ?')) return;
    await supabase.from('reservations').delete().eq('id', id);
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reservations.filter(r => {
    const mf = filter === 'tous' || r.statut === filter;
    const ms = !search || r.nom?.toLowerCase().includes(search.toLowerCase()) || r.telephone?.includes(search);
    return mf && ms;
  });

  if (loading) return (
    <div className="rv">
      <style>{STYLES}</style>
      <div className="rv-loader">
        <div className="rv-spinner" />
        <p className="rv-loader-txt">Chargement…</p>
      </div>
    </div>
  );

  return (
    <div className="rv">
      <style>{STYLES}</style>

      {/* HEADER */}
      <div className="rv-header">
        <div>
          <h1 className="rv-title">Réservations</h1>
          <p className="rv-sub">Gérez et suivez toutes les réservations en temps réel</p>
        </div>
        <div className="rv-total-pill">
          <ICalendar />
          <span className="rv-total-val">{reservations.length}</span>
          réservations
        </div>
      </div>

      {/* SUMMARY */}
      <div className="rv-summary">
        {SUMMARY.map(s => (
          <div key={s.key} className="rv-scard"
            style={{ background: s.bg, borderColor: s.border, color: s.color }}
            onClick={() => setFilter(filter === s.key ? 'tous' : s.key)}>
            <div>
              <div className="rv-scard-n">
                {reservations.filter(r => r.statut === s.key).length}
              </div>
              <div className="rv-scard-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="rv-toolbar">
        <div className="rv-search-wrap">
          <span className="rv-search-icon"><ISearch /></span>
          <input
            className="rv-search"
            placeholder="Rechercher par nom ou téléphone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {['tous', ...STATUTS].map(s => (
          <button
            key={s}
            className={`rv-fchip${filter === s ? ' on' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="rv-tcard">
        <div className="rv-tscroll">
          <table className="rv-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th>Heure</th>
                <th style={{ textAlign: 'center' }}>Pers.</th>
                <th>Table</th>
                <th>Demande</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="rv-empty">
                      <ISearch />
                      <p>Aucune réservation trouvée</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(r => {
                const st  = ST[r.statut] || ST['terminée'];
                const av  = avatarColor(r.nom);
                const waMsg = encodeURIComponent(
                  `Bonjour ${r.nom}, votre réservation chez Kaleta le ${fmtDate(r.date)} à ${r.heure} est confirmée !`
                );
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="rv-cell-name">
                        <div className="rv-av"
                          style={{ background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>
                          {initials(r.nom)}
                        </div>
                        <span className="rv-name-txt">{r.nom}</span>
                      </div>
                    </td>
                    <td>
                      <a className="rv-phone-a" href={`tel:${r.telephone}`}>{r.telephone}</a>
                    </td>
                    <td className="rv-mono">{fmtDate(r.date)}</td>
                    <td className="rv-mono">{r.heure}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="rv-pers">{r.personnes}</span>
                    </td>
                    <td>
                      <span className="rv-tchip">{r.table_type || '—'}</span>
                    </td>
                    <td className="rv-note" title={r.demande}>
                      {r.demande || '—'}
                    </td>
                    <td>
                      <select
                        className="rv-ss"
                        value={r.statut}
                        onChange={e => updateStatut(r.id, e.target.value)}
                        style={{ background: st.bg, color: st.color, borderColor: st.border }}
                      >
                        {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="rv-acts">
                        <a
                          className="rv-btn-wa"
                          href={`https://wa.me/${r.telephone?.replace(/\s/g, '')}?text=${waMsg}`}
                          target="_blank" rel="noreferrer"
                        >
                          <IWA /> WA
                        </a>
                        <button className="rv-btn-del" onClick={() => deleteReservation(r.id)}>
                          <ITrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rv-tfooter">
          <span>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {filter !== 'tous' ? ` · ${filter}` : ''}
          </span>
          <span className="rv-tfooter-mono">{reservations.length} au total</span>
        </div>
      </div>
    </div>
  );
}