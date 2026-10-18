import { useState } from 'react';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email ou mot de passe incorrect');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0B0B0B', padding: 20,
    }}>
      <div style={{
        background: '#1E1E1E', borderRadius: 20, padding: 40,
        width: '100%', maxWidth: 400, border: '1px solid #2a2a2a',
      }}>
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#39FF5A', letterSpacing: 4 }}>KALETA</div>
          <div style={{ color: '#888', fontSize: 12, letterSpacing: 3, marginTop: 4 }}>ADMIN · TERRASSE LOUNGE</div>
          <div style={{
            marginTop: 16, padding: '6px 16px', background: '#0d2a14',
            borderRadius: 20, display: 'inline-block',
            color: '#39FF5A', fontSize: 12, fontWeight: 700,
          }}>Interface de gestion</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#888', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@kaleta.tg"
              required
              style={{
                width: '100%', padding: '14px 16px',
                background: '#111', border: '1px solid #333',
                borderRadius: 12, color: '#F5F5F5', fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#888', fontSize: 12, fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '14px 16px',
                background: '#111', border: '1px solid #333',
                borderRadius: 12, color: '#F5F5F5', fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#2a0a0a', border: '1px solid #ff4444',
              borderRadius: 10, padding: '10px 14px',
              color: '#ff4444', fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            {loading ? 'Connexion...' : '🔐 SE CONNECTER'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, color: '#555', fontSize: 12 }}>
          Kaleta Admin v1.0 · Lomé, Togo
        </div>
      </div>
    </div>
  );
}
