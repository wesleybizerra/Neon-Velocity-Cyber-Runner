import React, { useState } from 'react';
import { STORE_ITEMS, REAL_MONEY_ITEMS } from '../constants';
import { StoreItem } from '../types';

interface StoreProps {
  userBalance: { coins: number; gems: number };
  refreshData: () => void;
  userId?: string; // Precisamos do ID do usuário para o pagamento
}

const Store: React.FC<StoreProps> = ({ userBalance, refreshData, userId }) => {
  const [activeTab, setActiveTab] = useState<'ingame' | 'realmoney'>('realmoney');

  // Compra com Moedas/Gemas do Jogo
  const handleIngamePurchase = async (item: StoreItem) => {
    if (item.currency === 'coins' && userBalance.coins < item.price) {
      alert("Moedas insuficientes! Jogue mais.");
      return;
    }
    if (item.currency === 'gems' && userBalance.gems < item.price) {
      alert("Gemas insuficientes! Compre na Loja de Créditos.");
      return;
    }

    try {
      const res = await fetch('/api/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (res.ok) {
        alert(`Você comprou: ${item.name}!`);
        refreshData();
      } else {
        alert("Erro na compra.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Compra com Dinheiro Real (Mercado Pago)
  const handleRealMoneyPurchase = async (item: any) => {
    if (!userId) {
      alert("Você precisa estar logado para comprar!");
      return;
    }

    try {
      const res = await fetch('/api/mp/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.name,
          price: item.price,
          quantity: 1,
          userId: userId // Envia o ID para vincular o pagamento
        }),
      });

      const data = await res.json();
      if (data.init_point) {
        // Redireciona para o Mercado Pago
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com Mercado Pago.");
    }
  };

  return (
    <div className="p-4 bg-black/90 rounded-xl text-white max-w-6xl mx-auto border border-zinc-800">

      {/* Abas de Navegação */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('realmoney')}
          className={`px-8 py-3 rounded-full font-orbitron font-bold transition-all ${activeTab === 'realmoney' ? 'bg-gradient-to-r from-green-500 to-emerald-700 text-white scale-105 shadow-lg shadow-green-500/50' : 'bg-zinc-800 text-zinc-400'}`}
        >
          💎 LOJA DE CRÉDITOS (R$)
        </button>
        <button
          onClick={() => setActiveTab('ingame')}
          className={`px-8 py-3 rounded-full font-orbitron font-bold transition-all ${activeTab === 'ingame' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105 shadow-lg shadow-purple-500/50' : 'bg-zinc-800 text-zinc-400'}`}
        >
          💀 MERCADO NEGRO (ITENS)
        </button>
      </div>

      {/* Conteúdo da Loja de Dinheiro Real */}
      {activeTab === 'realmoney' && (
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-green-400 font-bold font-orbitron">COMPRAR GEMAS E MOEDAS</h2>
            <p className="text-gray-400">Pagamento seguro via Mercado Pago (PIX, Cartão)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REAL_MONEY_ITEMS.map((item) => (
              <div key={item.id} className="relative bg-zinc-900 border-2 border-green-500/30 p-6 rounded-2xl hover:border-green-400 hover:scale-105 transition-all duration-300 shadow-xl group">
                {item.price >= 30 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold px-4 py-1 rounded-full text-xs animate-pulse">
                    MELHOR OFERTA
                  </div>
                )}
                <div className="text-6xl mb-6 text-center">{item.icon}</div>
                <h3 className="text-2xl font-bold font-orbitron text-center mb-2">{item.name}</h3>

                <div className="bg-black/50 p-4 rounded-lg mb-6 space-y-2">
                  <p className="flex justify-between text-cyan-400 font-bold"><span>💎 Gemas:</span> <span>+{item.benefits.gems}</span></p>
                  <p className="flex justify-between text-yellow-400 font-bold"><span>💰 Moedas:</span> <span>+{item.benefits.coins}</span></p>
                  <p className="text-xs text-center text-purple-400 mt-2 border-t border-zinc-700 pt-2 uppercase font-bold">{item.benefits.bonus}</p>
                </div>

                <button
                  onClick={() => handleRealMoneyPurchase(item)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-900/50 transition-all flex items-center justify-center gap-2"
                >
                  COMPRAR POR R$ {item.price.toFixed(2)}
                </button>
                <div className="mt-3 flex justify-center gap-2 grayscale opacity-50">
                  <span className="text-xs">💳 Cartão</span>
                  <span className="text-xs">💠 PIX</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da Loja do Jogo (Antiga) */}
      {activeTab === 'ingame' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {STORE_ITEMS.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl hover:border-purple-500 transition-all group">
              <div className="text-5xl mb-4 text-center">{item.icon}</div>
              <h3 className="text-xl font-bold font-orbitron mb-2 text-center">{item.name}</h3>
              <p className="text-gray-400 text-sm h-12 text-center mb-4">{item.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                <span className={`font-bold text-lg ${item.currency === 'coins' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                  {item.price} {item.currency === 'coins' ? '🪙' : '💎'}
                </span>
                <button
                  onClick={() => handleIngamePurchase(item)}
                  className={`px-4 py-2 rounded font-bold uppercase text-xs tracking-wider transition-colors ${item.currency === 'coins'
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-black'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-black'
                    }`}
                >
                  ADQUIRIR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;