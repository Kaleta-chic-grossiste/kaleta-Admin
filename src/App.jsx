import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Menu from './pages/Menu';
import Commandes from './pages/Commandes';
import Galerie from './pages/Galerie';
import Evenements from './pages/Evenements';
import Bannieres from './pages/Bannieres';
import AccueilAdmin from './pages/AccueilAdmin';
import WhatsApp from './pages/WhatsApp';
import MenuAdmin from './pages/MenuAdmin';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [badges, setBadges] = useState({ reservations: 0, commandes: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchBadges();

    // Realtime notifications
    const channel = supabase.channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, () => {
        setBadges(prev => ({ ...prev, reservations: prev.reservations + 1 }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'commandes' }, () => {
        setBadges(prev => ({ ...prev, commandes: prev.commandes + 1 }));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

  const fetchBadges = async () => {
    const [r, c] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('statut', 'en attente'),
      supabase.from('commandes').select('*', { count: 'exact', head: true }).eq('statut', 'nouvelle'),
    ]);
    setBadges({ reservations: r.count || 0, commandes: c.count || 0 });
  };

  const clearBadge = (type) => {
    setBadges(prev => ({ ...prev, [type]: 0 }));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#0B0B0B',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#39FF5A', letterSpacing: 4 }}>KALETA</div>
        <div style={{ color: '#888', marginTop: 8, fontSize: 13 }}>Chargement...</div>
      </div>
    </div>
  );

  if (!session) return <Login />;

  const pages = { dashboard: Dashboard, reservations: Reservations, menu: MenuAdmin, commandes: Commandes, galerie: Galerie, evenements: Evenements, bannieres: Bannieres, accueil: AccueilAdmin, whatsapp: WhatsApp };
  const PageComponent = pages[page] || Dashboard;

  return (
    <Layout page={page} setPage={(p) => { setPage(p); if (p === 'reservations') clearBadge('reservations'); if (p === 'commandes') clearBadge('commandes'); }} badges={badges}>
      <PageComponent />
    </Layout>
  );
}
