import React from 'react';
import { STORE_ITEMS } from '../constants';
import { StoreItem } from '../types';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  effect: any;
  icon: string;
}
interface StoreProps {
  userBalance: { coins: number; gems: number };
  refreshData: () => void;
}

const Store: React.FC<StoreProps> = ({ userBalance, refreshData }) => {

  const handlePurchase = async (item: StoreItem) => {
    // 1. Verifica saldo
    if (item.currency === 'coins' && userBalance.coins < item.price) {
      alert("Moedas insuficientes! Jogue mais.");
      return;
    }
    if (item.currency === 'gems' && userBalance.gems < item.price) {
      alert("Gemas insuficientes! Adquira na loja.");
      return;
    }

    // 2. Chama API de Compra (Você precisará criar essa rota api/store/buy)
    try {
      const res = await fetch('/api/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (res.ok) {
        alert(`Você comprou: ${item.name}!`);
        refreshData(); // Atualiza o saldo na tela
      } else {
        alert("Erro na compra.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-black text-white">
      <h2 className="text-3xl text-purple-400 font-bold mb-6">MERCADO NEGRO CYBERPUNK</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORE_ITEMS.map((item) => (
          <div key={item.id} className="border border-green-500 p-4 rounded-xl hover:bg-green-900/20 transition">
            <div className="text-4xl mb-2">{item.icon}</div>
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p className="text-gray-400 text-sm h-12">{item.description}</p>
            <button
              onClick={() => handlePurchase(item)}
              className="mt-4 w-full bg-purple-600 py-2 rounded font-bold hover:bg-purple-500"
            >
              Comprar ({item.price} {item.currency === 'coins' ? 'Moedas' : 'Gemas'})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;