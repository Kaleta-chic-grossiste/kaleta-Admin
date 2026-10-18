import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

/* ─────────────────────────────────────────
   STYLES — même design system qu'AccueilAdmin
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

.db * { box-sizing: border-box; margin: 0; padding: 0; }
.db {
  font-family: 'Geist', -apple-system, sans-serif;
  --bg:   #070709;
  --s1:   #0D0D14;
  --s2:   #13131E;
  --s3:   #1A1A28;
  --s4:   #212134;
  --bd:   rgba(255,255,255,0.06);
  --bdh:  rgba(255,255,255,0.11);
  --v:    #39FF5A;
  --vd:   rgba(57,255,90,0.08);
  --vb:   rgba(57,255,90,0.2);
  --vg:   rgba(57,255,90,0.05);
  --o:    #FF9F1C;
  --od:   rgba(255,159,28,0.08);
  --ob:   rgba(255,159,28,0.2);
  --r:    #FF4D5E;
  --rd:   rgba(255,77,94,0.08);
  --rb:   rgba(255,77,94,0.2);
  --p:    #a78bfa;
  --pd:   rgba(167,139,250,0.08);
  --pb:   rgba(167,139,250,0.2);
  --b:    #38bdf8;
  --bd2:  rgba(56,189,248,0.08);
  --bb:   rgba(56,189,248,0.2);
  --i0:   #F2F2F5;
  --i1:   #C8C8D4;
  --i2:   #8A8A9A;
  --i3:   #52526A;
  --i4:   #2E2E44;
  color: var(--i1);
  padding-bottom: 60px;
}

/* ── LOADER ── */
.db-loader {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 60vh; gap: 14px;
}
.db-spinner {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid rgba(57,255,90,0.12);
  border-top-color: var(--v);
  animation: dbSpin .65s linear infinite;
}
@keyframes dbSpin { to { transform: rotate(360deg); } }
.db-loader-txt { font-size: 13px; color: var(--i3); }

/* ── HEADER ── */
.db-header {
  padding: 32px 32px 0;
  display: flex; align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}
.db-title {
  font-size: 22px; font-weight: 600;
  letter-spacing: -.03em; color: var(--i0); line-height: 1.1;
}
.db-sub { font-size: 12.5px; color: var(--i3); margin-top: 5px; }
.db-date {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: 8px;
  background: var(--s2); border: 1px solid var(--bd);
  font-size: 12px; font-weight: 500; color: var(--i3);
  white-space: nowrap;
}
.db-date-dot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--v);
  animation: dbPulse 2s ease infinite;
}
@keyframes dbPulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ── STAT GRID ── */
.db-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 32px;
  margin-bottom: 28px;
}
.db-stat {
  background: var(--s1);
  border: 1px solid var(--bd);
  border-radius: 14px;
  padding: 18px 20px;
  position: relative; overflow: hidden;
  cursor: default;
  transition: border-color .2s, background .15s;
}
.db-stat:hover { border-color: var(--bdh); background: var(--s2); }
.db-stat::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: var(--line);
}
.db-stat-icon {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px; flex-shrink: 0;
}
.db-stat-val {
  font-family: 'Geist Mono', monospace;
  font-size: 30px; font-weight: 500;
  line-height: 1; letter-spacing: -.02em;
  color: var(--i0);
}
.db-stat-label {
  font-size: 10px; font-weight: 700; color: var(--i3);
  text-transform: uppercase; letter-spacing: .09em; margin-top: 7px;
}
.db-stat-sub { font-size: 11.5px; margin-top: 4px; font-weight: 500; }

/* ── GRID ── */
.db-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 0 32px; }
.db-col { display: flex; flex-direction: column; gap: 14px; }

/* ── CARD ── */
.db-card {
  background: var(--s1); border: 1px solid var(--bd);
  border-radius: 16px; overflow: hidden;
  transition: border-color .2s;
}
.db-card:hover { border-color: var(--bdh); }
.db-card-head {
  padding: 17px 22px 15px;
  border-bottom: 1px solid var(--bd);
  display: flex; align-items: center; justify-content: space-between;
}
.db-card-title {
  font-size: 13.5px; font-weight: 600; color: var(--i0);
  display: flex; align-items: center; gap: 9px;
}
.db-card-icon {
  width: 27px; height: 27px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.db-card-body { padding: 20px 22px; }
.db-card-footer {
  padding: 12px 22px;
  border-top: 1px solid var(--bd);
  font-size: 12px; color: var(--i3);
  display: flex; align-items: center; justify-content: space-between;
}

/* ── LIST ROWS ── */
.db-row {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--bd);
  transition: opacity .15s;
}
.db-row:last-child { border-bottom: none; padding-bottom: 0; }
.db-row:first-child { padding-top: 0; }
.db-row-avatar {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
  font-family: 'Geist Mono', monospace;
}
.db-row-info { flex: 1; min-width: 0; }
.db-row-name { font-size: 13.5px; font-weight: 600; color: var(--i0); margin-bottom: 2px; }
.db-row-meta { font-size: 11.5px; color: var(--i3); }
.db-row-right { flex-shrink: 0; text-align: right; }
.db-row-price {
  font-family: 'Geist Mono', monospace;
  font-size: 13px; font-weight: 500; color: var(--i1); margin-bottom: 4px;
}

/* ── BADGES ── */
.db-badge {
  display: inline-flex; align-items: center;
  padding: 3px 9px; border-radius: 999px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: .04em; text-transform: lowercase;
  white-space: nowrap;
}
.db-badge.green  { background: var(--vd); color: #4DFF6E; border: 1px solid var(--vb); }
.db-badge.orange { background: var(--od); color: #FFB84D; border: 1px solid var(--ob); }
.db-badge.red    { background: var(--rd); color: #FF6B78; border: 1px solid var(--rb); }
.db-badge.gray   { background: var(--s3); color: var(--i2); border: 1px solid var(--bd); }

/* ── INFO STRIP ── */
.db-info-strip {
  margin: 0 32px;
  padding: 14px 20px;
  background: var(--s1); border: 1px solid var(--bd);
  border-radius: 12px;
  display: flex; align-items: center; gap: 16px;
}
.db-info-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--vd); border: 1px solid var(--vb);
  display: flex; align-items: center; justify-content: center;
  color: var(--v); flex-shrink: 0;
}
.db-info-name { font-size: 13.5px; font-weight: 600; color: var(--i0); margin-bottom: 2px; }
.db-info-addr { font-size: 12px; color: var(--i3); }
.db-info-right {
  margin-left: auto; display: flex; gap: 8px;
}
.db-info-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 999px;
  background: var(--s2); border: 1px solid var(--bd);
  font-size: 11.5px; font-weight: 500; color: var(--i2);
}

/* ── EMPTY ── */
.db-empty {
  padding: 28px 20px; text-align: center;
  border-radius: 10px; border: 1px dashed var(--bd);
}
.db-empty p { font-size: 13px; color: var(--i3); }
`;

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const I = ({ size = 15, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={1.75}
    strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const ICalendar  = () => <I><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></I>;
const ICart      = () => <I><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></I>;
const IMenu      = () => <I><path d="M3 12h18M3 6h18M3 18h18" /></I>;
const IPhoto     = () => <I><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></I>;
const IMapPin    = () => <I d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />;
const IPhone     = () => <I><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.5v2.42z" /></I>;
const IArrowRight = () => <I><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></I>;
const ITrendUp   = () => <I><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></I>;

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const statutBadge = (s) => {
  if (!s) return 'gray';
  const v = s.toLowerCase();
  if (v === 'confirmée' || v === 'prête' || v === 'livrée') return 'green';
  if (v === 'en attente' || v === 'nouvelle' || v === 'en cours') return 'orange';
  if (v === 'annulée') return 'red';
  return 'gray';
};

const initials = (name = '') => {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const AVATAR_COLORS = [
  { bg: 'rgba(57,255,90,0.1)',   color: '#39FF5A',  border: 'rgba(57,255,90,0.2)' },
  { bg: 'rgba(255,159,28,0.1)',  color: '#FF9F1C',  border: 'rgba(255,159,28,0.2)' },
  { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa',  border: 'rgba(167,139,250,0.2)' },
  { bg: 'rgba(56,189,248,0.1)',  color: '#38bdf8',  border: 'rgba(56,189,248,0.2)' },
];
const avatarColor = (name = '') =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
function StatCard({ icon, iconBg, iconColor, lineBg, label, value, sub, subColor }) {
  return (
    <div className="db-stat" style={{ '--line': lineBg }}>
      <div className="db-stat-icon" style={{ background: iconBg, border: `1px solid ${iconColor}33`, color: iconColor }}>
        {icon}
      </div>
      <div className="db-stat-val">{value}</div>
      <div className="db-stat-label">{label}</div>
      {sub && <div className="db-stat-sub" style={{ color: subColor || 'var(--i3)' }}>{sub}</div>}
    </div>
  );
}

function Card({ title, icon, iconBg, iconColor, action, footer, children }) {
  return (
    <div className="db-card">
      <div className="db-card-head">
        <span className="db-card-title">
          <div className="db-card-icon"
            style={{ background: iconBg, border: `1px solid ${iconColor}33`, color: iconColor }}>
            {icon}
          </div>
          {title}
        </span>
        {action}
      </div>
      <div className="db-card-body">{children}</div>
      {footer && <div className="db-card-footer">{footer}</div>}
    </div>
  );
}

function ReservationRow({ r }) {
  const av = avatarColor(r.nom);
  return (
    <div className="db-row">
      <div className="db-row-avatar"
        style={{ background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>
        {initials(r.nom)}
      </div>
      <div className="db-row-info">
        <div className="db-row-name">{r.nom}</div>
        <div className="db-row-meta">
          {r.date} · {r.heure} · {r.personnes} pers.{r.table_type ? ` · ${r.table_type}` : ''}
        </div>
      </div>
      <div className="db-row-right">
        <span className={`db-badge ${statutBadge(r.statut)}`}>{r.statut || '—'}</span>
      </div>
    </div>
  );
}

function CommandeRow({ c }) {
  const av = avatarColor(c.nom_client || 'C');
  return (
    <div className="db-row">
      <div className="db-row-avatar"
        style={{ background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>
        {initials(c.nom_client || 'CL')}
      </div>
      <div className="db-row-info">
        <div className="db-row-name">{c.nom_client || 'Client'}</div>
        <div className="db-row-meta">
          {Array.isArray(c.items) ? c.items.length : 0} article{(Array.isArray(c.items) && c.items.length > 1) ? 's' : ''}
        </div>
      </div>
      <div className="db-row-right">
        <div className="db-row-price">{c.total?.toLocaleString()} CFA</div>
        <span className={`db-badge ${statutBadge(c.statut)}`}>{c.statut || '—'}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Dashboard() {
  const [stats, setStats] = useState({ reservations: 0, commandes: 0, menu: 0, galerie: 0 });
  const [recentReservations, setRecentReservations] = useState([]);
  const [recentCommandes, setRecentCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const [r, c, m, g] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('commandes').select('*', { count: 'exact', head: true }),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('galerie').select('*', { count: 'exact', head: true }),
    ]);
    setStats({
      reservations: r.count || 0,
      commandes:    c.count || 0,
      menu:         m.count || 0,
      galerie:      g.count || 0,
    });
    const { data: res } = await supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5);
    const { data: cmd } = await supabase.from('commandes').select('*').order('created_at', { ascending: false }).limit(5);
    setRecentReservations(res || []);
    setRecentCommandes(cmd || []);
    setLoading(false);
  };

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  if (loading) return (
    <div className="db">
      <style>{STYLES}</style>
      <div className="db-loader">
        <div className="db-spinner" />
        <p className="db-loader-txt">Chargement…</p>
      </div>
    </div>
  );

  return (
    <div className="db">
      <style>{STYLES}</style>

      {/* ── HEADER ── */}
      <div className="db-header">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-sub">Bienvenue sur l'interface admin de Kaleta</p>
        </div>
        <div className="db-date">
          <div className="db-date-dot" />
          {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="db-stats">
        <StatCard
          icon={<ICalendar />}
          iconBg="rgba(57,255,90,0.08)" iconColor="#39FF5A"
          lineBg="rgba(57,255,90,0.5)"
          label="Réservations" value={stats.reservations}
          sub="Total" subColor="var(--i3)"
        />
        <StatCard
          icon={<ICart />}
          iconBg="rgba(255,159,28,0.08)" iconColor="#FF9F1C"
          lineBg="rgba(255,159,28,0.5)"
          label="Commandes" value={stats.commandes}
          sub="Total" subColor="var(--i3)"
        />
        <StatCard
          icon={<IMenu />}
          iconBg="rgba(167,139,250,0.08)" iconColor="#a78bfa"
          lineBg="rgba(167,139,250,0.5)"
          label="Plats au menu" value={stats.menu}
          sub="Articles" subColor="var(--i3)"
        />
        <StatCard
          icon={<IPhoto />}
          iconBg="rgba(56,189,248,0.08)" iconColor="#38bdf8"
          lineBg="rgba(56,189,248,0.5)"
          label="Photos" value={stats.galerie}
          sub="Galerie" subColor="var(--i3)"
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="db-grid-2">
        {/* RÉSERVATIONS */}
        <Card
          title="Dernières réservations"
          icon={<ICalendar />}
          iconBg="rgba(57,255,90,0.08)" iconColor="#39FF5A"
          footer={
            <>
              <span>{recentReservations.length} affichées</span>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#39FF5A', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                Voir tout <IArrowRight />
              </a>
            </>
          }
        >
          {recentReservations.length === 0
            ? <div className="db-empty"><p>Aucune réservation pour l'instant</p></div>
            : recentReservations.map(r => <ReservationRow key={r.id} r={r} />)
          }
        </Card>

        {/* COMMANDES */}
        <Card
          title="Dernières commandes"
          icon={<ICart />}
          iconBg="rgba(255,159,28,0.08)" iconColor="#FF9F1C"
          footer={
            <>
              <span>{recentCommandes.length} affichées</span>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#FF9F1C', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                Voir tout <IArrowRight />
              </a>
            </>
          }
        >
          {recentCommandes.length === 0
            ? <div className="db-empty"><p>Aucune commande pour l'instant</p></div>
            : recentCommandes.map(c => <CommandeRow key={c.id} c={c} />)
          }
        </Card>
      </div>

      {/* ── INFO STRIP ── */}
      <div style={{ marginTop: 14 }}>
        <div className="db-info-strip">
          <div className="db-info-icon"><IMapPin /></div>
          <div>
            <div className="db-info-name">Restaurant Kaleta · Terrasse Lounge</div>
            <div className="db-info-addr">Deux Lions, en face du Lycée d'Agbé · Lomé, Togo</div>
          </div>
          <div className="db-info-right">
            <div className="db-info-pill">
              <IPhone />
              91 00 84 84
            </div>
            <div className="db-info-pill" style={{ color: 'var(--v)', borderColor: 'var(--vb)' }}>
              <ITrendUp />
              En ligne
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}