import React, { useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react'; // Adicionei o signOut aqui
import { GameState, UserProfile, MatchResult } from '../src/types';
import GameEngine from '../src/components/GameEngine';
import Store from '../src/components/Store';

const HomePage: React.FC = () => {
  const [currentState, setCurrentState] = useState<GameState>(GameState.LANDING);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (currentState === GameState.LANDING || currentState === GameState.AUTH) {
          setCurrentState(GameState.DASHBOARD);
        }
      }
    } catch (e) {
      console.log("Usuário não logado");
    }
  };

  // --- FUNÇÃO DE LOGOUT NOVA ---
  const handleLogout = async () => {
    await signOut({ redirect: false }); // Desloga do NextAuth
    setUser(null); // Limpa o usuário da memória
    setCurrentState(GameState.LANDING); // Volta para a tela inicial
  };
  // -----------------------------

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === 'signup') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          alert("Conta criada com sucesso! Fazendo login automático...");
          await loginUser();
        } else {
          alert("Erro ao criar conta. Tente outro email.");
        }
      } catch (error) {
        alert("Erro de conexão.");
      }
    } else {
      await loginUser();
    }
    setIsLoading(false);
  };

  const loginUser = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password
    });

    if (!result?.error) {
      await fetchProfile();
      setCurrentState(GameState.DASHBOARD);
    } else {
      alert("Email ou senha incorretos!");
    }
  };

  const handleGameOver = async (result: MatchResult) => {
    setLastMatch(result);
    try {
      await fetch('/api/game/end-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: result.score,
          coins: result.coinsEarned
        })
      });
      await fetchProfile();
    } catch (e) {
      console.error("Erro ao salvar progresso", e);
    }
    setCurrentState(GameState.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentState) {
      case GameState.LANDING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-fadeIn">
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
          <div className="flex items-center justify-center min-h-[80vh] p-6">
            <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl border border-cyan-500/30">
              <h2 className="text-3xl font-orbitron mb-6 text-center text-cyan-400">{authMode === 'login' ? 'LOGIN' : 'CADASTRO'}</h2>
              <form className="space-y-4" onSubmit={handleAuthSubmit}>
                {authMode === 'signup' && (
                  <input type="text" placeholder="Seu Nome" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                )}
                <input type="email" placeholder="E-mail" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                <input type="password" placeholder="Senha" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />

                <button type="submit" disabled={isLoading} className="neon-btn w-full py-3 rounded-lg font-orbitron font-bold disabled:opacity-50">
                  {isLoading ? 'CARREGANDO...' : (authMode === 'login' ? 'ENTRAR' : 'CRIAR CONTA')}
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
            {/* Header do Perfil */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} className="w-16 h-16 rounded-full border-2 border-cyan-500" alt="Avatar" />
                <div>
                  <h2 className="text-2xl font-orbitron">{user?.name}</h2>
                  <p className="text-cyan-400 font-bold">LEVEL {user?.level || 1}</p>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto justify-center">
                <div className="bg-black/50 p-2 rounded-lg border border-yellow-500/30 text-yellow-400 font-bold flex flex-col items-center min-w-[100px]">
                  <span className="text-[10px] text-yellow-600 uppercase tracking-widest">Moedas</span>
                  <span className="text-xl">💰 {user?.coins || 0}</span>
                </div>
                <div className="bg-black/50 p-2 rounded-lg border border-cyan-500/30 text-cyan-400 font-bold flex flex-col items-center min-w-[100px]">
                  <span className="text-[10px] text-cyan-600 uppercase tracking-widest">Gemas</span>
                  <span className="text-xl">💎 {user?.gems || 0}</span>
                </div>
              </div>
            </div>

            {/* Menu Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <button onClick={() => setCurrentState(GameState.PLAYING)} className="h-64 rounded-3xl bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-2 border-cyan-500/30 font-orbitron text-4xl hover:scale-[1.02] transition-transform text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] group">
                <span className="group-hover:text-cyan-400 transition-colors">INICIAR CORRIDA</span>
              </button>
              <button onClick={() => setCurrentState(GameState.STORE)} className="h-64 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 font-orbitron text-4xl hover:scale-[1.02] transition-transform text-white shadow-[0_0_30px_rgba(168,85,247,0.2)] group">
                <span className="group-hover:text-purple-400 transition-colors">LOJA CYBER</span>
              </button>
            </div>

            {/* Botão Sair no Dashboard (Mobile Friendly) */}
            <div className="text-center md:hidden">
              <button onClick={handleLogout} className="text-red-500 font-bold border border-red-500/30 px-6 py-2 rounded-full hover:bg-red-500/10">
                SAIR DA CONTA
              </button>
            </div>
          </div>
        );
      case GameState.PLAYING:
        return <GameEngine onGameOver={handleGameOver} isPaused={isGamePaused} />;
      case GameState.STORE:
        return (
          <div className="py-10">
            <button onClick={() => {
              fetchProfile();
              setCurrentState(GameState.DASHBOARD);
            }} className="mb-10 ml-10 text-zinc-500 font-orbitron hover:text-white transition-colors">← VOLTAR AO DASHBOARD</button>
            <Store
              refreshData={fetchProfile}
              userBalance={{ coins: user?.coins || 0, gems: user?.gems || 0 }}
              userId={user?.id}
            />
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

        {/* Barra Superior - Info do Usuário e Botão Sair */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm font-orbitron text-zinc-400">OPERADOR: {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 px-3 py-1 rounded text-xs font-bold transition-all"
            >
              SAIR
            </button>
          </div>
        ) : (
          <span className="text-xs text-zinc-600">SISTEMA OFFLINE</span>
        )}
      </nav>
      <main className="pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default HomePage;