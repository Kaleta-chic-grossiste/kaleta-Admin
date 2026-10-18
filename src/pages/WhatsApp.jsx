import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_WA_SERVER_URL || 'http://localhost:3001';

const TYPES = ['TOUS', 'RÉSERVATION', 'COMMANDE', 'INFO', 'GÉNÉRAL', 'ENVOYÉ'];

const TYPE_CONFIG = {
  'RÉSERVATION': { bg: '#0d2a14', color: '#39FF5A', icon: '📅' },
  'COMMANDE':    { bg: '#2a1800', color: '#FF9F1C', icon: '🛒' },
  'INFO':        { bg: '#001a2a', color: '#38bdf8', icon: 'ℹ️' },
  'GÉNÉRAL':     { bg: '#1a1a2a', color: '#a78bfa', icon: '💬' },
  'ENVOYÉ':      { bg: '#1a1a1a', color: '#888',    icon: '↗️' },
};

export default function WhatsAppPage() {
  const [socket, setSocket]           = useState(null);
  const [status, setStatus]           = useState({ connected: false, message: 'Connexion...' });
  const [qrCode, setQrCode]           = useState(null);
  const [messages, setMessages]       = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat]   = useState(null);
  const [reply, setReply]             = useState('');
  const [filterType, setFilterType]   = useState('TOUS');
  const [search, setSearch]           = useState('');
  const [sending, setSending]         = useState(false);
  const messagesEndRef                = useRef(null);

  // ── CONNEXION SOCKET ──────────────────────────────
  useEffect(() => {
    const s = io(SERVER_URL, { transports: ['websocket', 'polling'] });
    setSocket(s);

    s.on('connect', () => console.log('✅ Connecté au serveur'));
    s.on('disconnect', () => console.log('❌ Déconnecté du serveur'));

    s.on('status', (data) => {
      setStatus(data);
      if (data.connected) setQrCode(null);
    });

    s.on('qr', (qr) => setQrCode(qr));

    s.on('messages_loaded', (msgs) => {
      setMessages(msgs);
      buildConversations(msgs);
    });

    s.on('new_message', (msg) => {
      setMessages(prev => {
        const updated = [msg, ...prev.filter(m => m.id !== msg.id)];
        buildConversations(updated);
        return updated;
      });
    });

    s.on('message_sent', (msg) => {
      setMessages(prev => {
        const updated = [msg, ...prev.filter(m => m.id !== msg.id)];
        buildConversations(updated);
        return updated;
      });
    });

    s.on('error', (err) => alert('Erreur: ' + err));

    return () => s.disconnect();
  }, []);

  // ── CONSTRUIRE CONVERSATIONS ───────────────────────
  const buildConversations = (msgs) => {
    const convMap = {};
    msgs.forEach(msg => {
      const key = msg.isFromMe ? msg.from : msg.from;
      if (!convMap[key] || msg.timestamp > convMap[key].lastMessage.timestamp) {
        convMap[key] = {
          id: key,
          number: msg.fromNumber,
          name: msg.fromName,
          lastMessage: msg,
          unread: msgs.filter(m => m.from === key && !m.isRead && !m.isFromMe).length,
          type: msg.isFromMe ? 'ENVOYÉ' : msg.type,
        };
      }
    });
    const sorted = Object.values(convMap).sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
    setConversations(sorted);
  };

  // ── MESSAGES DU CHAT ACTIF ─────────────────────────
  const chatMessages = activeChat
    ? messages.filter(m => m.from === activeChat || (m.isFromMe && m.from === activeChat))
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  // ── CONVERSATIONS FILTRÉES ─────────────────────────
  const filteredConversations = conversations.filter(conv => {
    const matchType = filterType === 'TOUS' || conv.type === filterType;
    const matchSearch = !search ||
      conv.name?.toLowerCase().includes(search.toLowerCase()) ||
      conv.number?.includes(search) ||
      conv.lastMessage?.body?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // ── ENVOYER MESSAGE ───────────────────────────────
  const sendMessage = () => {
    if (!reply.trim() || !activeChat || !socket) return;
    setSending(true);
    socket.emit('send_message', { to: activeChat, message: reply.trim() });
    setReply('');
    setTimeout(() => setSending(false), 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── SCROLL BAS ────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (ts) => new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  // ── DÉCONNECTER ───────────────────────────────────
  const disconnect = () => {
    if (confirm('Déconnecter WhatsApp ?')) socket?.emit('disconnect_whatsapp');
  };

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>💬 WhatsApp</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status.connected ? '#39FF5A' : '#ff4444' }} />
            <p style={{ color: '#666', fontSize: 13 }}>
              {status.connected ? `Connecté${status.name ? ` — ${status.name}` : ''}${status.phone ? ` (${status.phone})` : ''}` : status.message}
            </p>
          </div>
        </div>
        {status.connected && (
          <button onClick={disconnect}
            style={{ padding: '8px 16px', background: '#2a0a0a', border: '1px solid #ff444433', borderRadius: 8, color: '#ff4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Déconnecter
          </button>
        )}
      </div>

      {/* QR CODE */}
      {!status.connected && qrCode && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }}>
          <div style={{ background: '#1E1E1E', borderRadius: 20, padding: 30, border: '1px solid #2a2a2a', textAlign: 'center' }}>
            <h2 style={{ color: '#F5F5F5', marginBottom: 8, fontSize: 18, fontWeight: 800 }}>Connecter WhatsApp</h2>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>Ouvrez WhatsApp sur votre téléphone → Appareils liés → Scanner le QR</p>
            <img src={qrCode} alt="QR Code WhatsApp" style={{ width: 250, height: 250, borderRadius: 12 }} />
            <p style={{ color: '#555', fontSize: 12, marginTop: 16 }}>Ce QR expire dans 60 secondes — rechargez si nécessaire</p>
          </div>
        </div>
      )}

      {/* INITIALISATION */}
      {!status.connected && !qrCode && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
          <div style={{ fontSize: 48 }}>📱</div>
          <p style={{ color: '#888', fontSize: 15 }}>{status.message}</p>
          <button onClick={() => socket?.emit('reconnect_whatsapp')}
            style={{ padding: '10px 24px', background: '#39FF5A', border: 'none', borderRadius: 10, color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>
            Reconnecter
          </button>
        </div>
      )}

      {/* INTERFACE PRINCIPALE */}
      {status.connected && (
        <div style={{ display: 'flex', flex: 1, gap: 0, background: '#1E1E1E', borderRadius: 14, overflow: 'hidden', border: '1px solid #2a2a2a' }}>

          {/* ── SIDEBAR CONVERSATIONS ── */}
          <div style={{ width: 320, borderRight: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column' }}>

            {/* SEARCH */}
            <div style={{ padding: 12, borderBottom: '1px solid #2a2a2a' }}>
              <input
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, color: '#F5F5F5', fontSize: 13 }}
              />
            </div>

            {/* FILTRES */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a2a', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: filterType === t ? '#39FF5A' : '#2a2a2a',
                    color: filterType === t ? '#000' : '#888',
                    border: 'none',
                  }}>{t}</button>
              ))}
            </div>

            {/* LISTE CONVERSATIONS */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', color: '#555' }}>
                  {conversations.length === 0 ? 'Aucun message reçu' : 'Aucun résultat'}
                </div>
              ) : filteredConversations.map(conv => {
                const cfg = TYPE_CONFIG[conv.type] || TYPE_CONFIG['GÉNÉRAL'];
                const isActive = activeChat === conv.id;
                return (
                  <div key={conv.id}
                    onClick={() => { setActiveChat(conv.id); socket?.emit('mark_read', { chatId: conv.id }); }}
                    style={{
                      padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #2a2a2a',
                      background: isActive ? '#111' : 'transparent',
                      borderLeft: isActive ? `3px solid #39FF5A` : '3px solid transparent',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* AVATAR */}
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.bg, border: `1px solid ${cfg.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                          {cfg.icon}
                        </div>
                        <div>
                          <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: 13 }}>{conv.name}</div>
                          <div style={{ color: '#555', fontSize: 11 }}>{conv.number}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#555', fontSize: 10 }}>{formatDate(conv.lastMessage.timestamp)}</div>
                        {conv.unread > 0 && (
                          <div style={{ background: '#39FF5A', borderRadius: 10, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginTop: 2 }}>
                            <span style={{ color: '#000', fontSize: 10, fontWeight: 800 }}>{conv.unread}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ color: '#666', fontSize: 12, marginLeft: 44 }} >{conv.lastMessage.body?.slice(0, 50)}{conv.lastMessage.body?.length > 50 ? '...' : ''}</div>
                    <div style={{ marginLeft: 44, marginTop: 4 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {conv.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── ZONE MESSAGES ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!activeChat ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 48 }}>💬</div>
                <p style={{ color: '#555', fontSize: 15 }}>Sélectionnez une conversation</p>
              </div>
            ) : (
              <>
                {/* HEADER CHAT */}
                {(() => {
                  const conv = conversations.find(c => c.id === activeChat);
                  const cfg = TYPE_CONFIG[conv?.type] || TYPE_CONFIG['GÉNÉRAL'];
                  return (
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: cfg.bg, border: `1px solid ${cfg.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {cfg.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: 15 }}>{conv?.name}</div>
                        <div style={{ color: '#555', fontSize: 12 }}>📞 {conv?.number}</div>
                      </div>
                      <a href={`https://wa.me/${conv?.number}`} target="_blank" rel="noreferrer"
                        style={{ padding: '8px 14px', background: '#25D366', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        Ouvrir WA
                      </a>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                        {conv?.type}
                      </span>
                    </div>
                  );
                })()}

                {/* MESSAGES */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {chatMessages.map((msg, i) => (
                    <div key={msg.id || i} style={{ display: 'flex', justifyContent: msg.isFromMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '10px 14px', borderRadius: msg.isFromMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: msg.isFromMe ? '#39FF5A22' : '#2a2a2a',
                        border: `1px solid ${msg.isFromMe ? '#39FF5A44' : '#333'}`,
                      }}>
                        <p style={{ color: '#F5F5F5', fontSize: 14, margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.body}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <span style={{ color: '#555', fontSize: 10 }}>{formatTime(msg.timestamp)}</span>
                          {msg.isFromMe && <span style={{ color: '#39FF5A', fontSize: 10 }}>✓✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT RÉPONSE */}
                <div style={{ padding: 12, borderTop: '1px solid #2a2a2a', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrire un message... (Entrée pour envoyer)"
                    rows={2}
                    style={{
                      flex: 1, padding: '10px 14px', background: '#111',
                      border: '1px solid #2a2a2a', borderRadius: 10,
                      color: '#F5F5F5', fontSize: 14, resize: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button onClick={sendMessage} disabled={sending || !reply.trim()}
                    style={{
                      padding: '10px 20px', background: reply.trim() ? '#39FF5A' : '#2a2a2a',
                      border: 'none', borderRadius: 10, color: reply.trim() ? '#000' : '#555',
                      fontWeight: 800, fontSize: 14, cursor: reply.trim() ? 'pointer' : 'default',
                      transition: 'all 0.2s', height: 44,
                    }}>
                    {sending ? '...' : '➤'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
