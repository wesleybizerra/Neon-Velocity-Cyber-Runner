import React from 'react';
import { STORE_ITEMS } from '../constants';
// Importamos o tipo centralizado para não dar conflito
import { StoreItem } from '../types';

interface StoreProps {
  userBalance: { coins: number; gems: number };
  refreshData: () => void;
}

const Store: React.FC<StoreProps> = ({ userBalance, refreshData }) => {

  const handlePurchase = async (item: StoreItem) => {
    // 1. Verifica saldo localmente antes de chamar API
    if (item.currency === 'coins' && userBalance.coins < item.price) {
      alert("Moedas insuficientes! Jogue mais.");
      return;
    }
    if (item.currency === 'gems' && userBalance.gems < item.price) {
      alert("Gemas insuficientes!");
      return;
    }

    // 2. Chama API de Compra (Lógica interna do jogo)
    try {
      // Nota: Você precisará criar a rota /api/store/buy depois se ainda não criou
      // Por enquanto vamos simular ou chamar a rota se ela existir
      const res = await fetch('/api/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (res.ok) {
        alert(`Você comprou: ${item.name}!`);
        refreshData();
      } else {
        // Se a API falhar ou não existir ainda, avisa o usuário
        console.error("Erro na compra ou API não implementada");
        alert("Erro ao processar compra. Verifique se a API /api/store/buy existe.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="p-6 bg-black/80 rounded-xl text-white max-w-5xl mx-auto">
      <h2 className="text-3xl text-purple-400 font-bold mb-6 font-orbitron border-b border-purple-800 pb-4">
        MERCADO NEGRO CYBERPUNK
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORE_ITEMS.map((item) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
            <h3 className="text-xl font-bold font-orbitron mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm h-16 leading-relaxed mb-4">{item.description}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
              <span className={`font-bold text-lg ${item.currency === 'coins' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                {item.price} {item.currency === 'coins' ? '🪙' : '💎'}
              </span>
              <button
                onClick={() => handlePurchase(item)}
                className={`px-4 py-2 rounded font-bold uppercase text-xs tracking-wider transition-colors ${item.currency === 'coins'
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-black'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-black'
                  }`}
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;