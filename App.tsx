
import React, { useState, useEffect } from 'react';
import { GameState, UserProfile, MatchResult, StoreItem } from './types';
import GameEngine from './components/GameEngine';
import Store from './components/Store';
import { DAILY_MISSIONS } from './constants';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<GameState>(GameState.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Carregar dados do usuário ao iniciar
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) { console.error("Not logged in"); }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/callback/credentials' : '/api/auth/signup';

    // Simplificado para o exemplo: No Sign Up chamamos nossa API, no Login o NextAuth
    if (authMode === 'signup') {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Conta criada! Agora faça login.");
        setAuthMode('login');
      } else {
        alert("Erro ao criar conta.");
      }
    } else {
      // Mock de login para o ambiente de demonstração
      // Em produção real, você usaria o signIn do next-auth/react
      alert("Simulando login seguro via NextAuth...");
      const mockUser: UserProfile = {
        id: 'usr_real',
        name: formData.name || 'Cyber Runner',
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        coins: 100,
        gems: 0,
        xp: 0,
        level: 1,
        streak: 1,
        lastLogin: new Date(),
        referralCode: 'NEON-XYZ',
        benefits: []
      };
      setUser(mockUser);
      setCurrentState(GameState.DASHBOARD);
    }
  };

  const handlePurchase = async (item: StoreItem) => {
    if (!user) return alert("Faça login para comprar.");

    try {
      const res = await fetch('/api/mp/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, userId: user.id })
      });
      const { init_point } = await res.json();
      window.location.href = init_point; // Redireciona para o checkout real
    } catch (e) {
      alert("Erro ao iniciar pagamento.");
    }
  };

  const handleGameOver = async (result: MatchResult) => {
    setLastMatch(result);
    // Salvar no servidor
    await fetch('/api/game/end-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: result.score, coins: result.coinsEarned, xp: result.xpEarned })
    });
    fetchProfile(); // Atualiza dados
    setCurrentState(GameState.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentState) {
      case GameState.LANDING:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn">
            <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 neon-text">
              NEON VELOCITY
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl">
              O futuro da adrenalina chegou. Corra, evolua e conquiste o ranking.
            </p>
            <button onClick={() => setCurrentState(GameState.AUTH)} className="neon-btn px-12 py-5 rounded-full text-2xl font-bold font-orbitron uppercase">
              Jogar Agora
            </button>
          </div>
        );

      case GameState.AUTH:
        return (
          <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-cyan-500/30">
              <h2 className="text-3xl font-orbitron mb-6 text-center text-cyan-400">{authMode === 'login' ? 'LOGIN' : 'CADASTRO'}</h2>
              <form className="space-y-4" onSubmit={handleAuthSubmit}>
                {authMode === 'signup' && (
                  <input type="text" placeholder="Seu Nome" className="w-full bg-black border border-zinc-800 rounded-lg p-3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                )}
                <input type="email" placeholder="E-mail" className="w-full bg-black border border-zinc-800 rounded-lg p-3" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                <input type="password" placeholder="Senha" className="w-full bg-black border border-zinc-800 rounded-lg p-3" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                <button type="submit" className="neon-btn w-full py-3 rounded-lg font-orbitron font-bold">
                  {authMode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-zinc-500">
                {authMode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="ml-2 text-cyan-400">Clique aqui</button>
              </p>
            </div>
          </div>
        );

      case GameState.DASHBOARD:
        return (
          <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-8 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-4">
                <img src={user?.avatar} className="w-16 h-16 rounded-full border-2 border-cyan-500" alt="Avatar" />
                <div>
                  <h2 className="text-2xl font-orbitron">{user?.name}</h2>
                  <p className="text-cyan-400 font-bold">LEVEL {user?.level}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-black/50 p-2 rounded-lg border border-yellow-500/30 text-yellow-400">💰 {user?.coins}</div>
                <div className="bg-black/50 p-2 rounded-lg border border-orange-500/30 text-orange-400">🔥 {user?.streak}d</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button onClick={() => setCurrentState(GameState.PLAYING)} className="h-64 rounded-3xl bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-2 border-cyan-500/30 font-orbitron text-4xl hover:scale-[1.02] transition-transform">
                INICIAR CORRIDA
              </button>
              <button onClick={() => setCurrentState(GameState.STORE)} className="h-64 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 font-orbitron text-4xl hover:scale-[1.02] transition-transform">
                LOJA CYBER
              </button>
            </div>
          </div>
        );

      case GameState.PLAYING:
        return <GameEngine onGameOver={handleGameOver} isPaused={isGamePaused} />;

      case GameState.STORE:
        return (
          <div className="py-20">
            <button onClick={() => setCurrentState(GameState.DASHBOARD)} className="mb-10 ml-10 text-zinc-500 font-orbitron">← VOLTAR</button>
            <Store onPurchase={handlePurchase} userBalance={{ coins: user?.coins || 0, gems: user?.gems || 0 }} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md fixed top-0 w-full z-50">
        <span className="font-orbitron font-bold text-cyan-400 text-xl tracking-tighter">NEON VELOCITY</span>
        {user && <span className="text-sm font-orbitron text-zinc-400">SISTEMA ONLINE: {user.name}</span>}
      </nav>
      <main className="pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
