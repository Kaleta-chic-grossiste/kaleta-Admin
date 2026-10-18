import { useState } from 'react';
import { supabase } from '../supabase';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',     icon: '📊' },
  { id: 'accueil',      label: 'Accueil App',   icon: '🏠' },
  { id: 'reservations', label: 'Réservations',  icon: '📅' },
  { id: 'commandes',    label: 'Commandes',      icon: '🛒' },
  { id: 'menu',         label: 'Menu',           icon: '🍽️' },
  { id: 'galerie',      label: 'Galerie',        icon: '🖼️' },
  { id: 'bannieres',    label: 'Bannières',      icon: '🎠' },
  { id: 'evenements',   label: 'Événements',     icon: '🎉' },
  { id: 'whatsapp',     label: 'WhatsApp',       icon: '💬' },
];

export default function Layout({ children, page, setPage, badges = {} }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0B0B' }}>
      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 240 : 70, minHeight: '100vh',
        background: '#111', borderRight: '1px solid #1a1a1a',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s', overflow: 'hidden',
        position: 'fixed', top: 0, left: 0, zIndex: 100,
      }}>
        {/* LOGO */}
        <div style={{
          padding: sidebarOpen ? '24px 20px' : '24px 14px',
          borderBottom: '1px solid #1a1a1a',
        }}>
          {sidebarOpen ? (
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#39FF5A', letterSpacing: 3 }}>KALETA</div>
              <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, marginTop: 2 }}>ADMIN PANEL</div>
            </div>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 900, color: '#39FF5A' }}>K</div>
          )}
        </div>

        {/* TOGGLE */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          background: 'none', border: 'none', color: '#555',
          padding: '10px', textAlign: 'right', fontSize: 18,
          margin: '8px 8px 0',
        }}>
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* NAV */}
        <nav style={{ flex: 1, padding: '8px 10px' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: '12px 14px', borderRadius: 10,
                background: page === item.id ? '#0d2a14' : 'transparent',
                border: page === item.id ? '1px solid #39FF5A22' : '1px solid transparent',
                color: page === item.id ? '#39FF5A' : '#666',
                fontSize: 14, fontWeight: page === item.id ? 700 : 500,
                marginBottom: 4, textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                position: 'relative',
              }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
              {sidebarOpen && badges[item.id] > 0 && (
                <span style={{
                  background: '#ff4444', color: '#fff',
                  borderRadius: 10, fontSize: 10, fontWeight: 800,
                  padding: '2px 7px', minWidth: 18, textAlign: 'center',
                }}>{badges[item.id]}</span>
              )}
              {!sidebarOpen && badges[item.id] > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  background: '#ff4444', borderRadius: '50%',
                  width: 8, height: 8,
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div style={{ padding: '16px 10px', borderTop: '1px solid #1a1a1a' }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: 12, padding: '12px 14px', borderRadius: 10,
            background: 'transparent', border: '1px solid #2a0a0a',
            color: '#ff4444', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        marginLeft: sidebarOpen ? 240 : 70,
        flex: 1, padding: 30,
        transition: 'margin-left 0.3s',
        minHeight: '100vh',
      }}>
        {children}
      </div>
    </div>
  );
}
