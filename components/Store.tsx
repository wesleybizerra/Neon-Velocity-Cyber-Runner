import React from 'react';
import { STORE_ITEMS } from '../src/constants';
import { StoreItem } from '@/types';

interface StoreProps {
  onPurchase: (item: StoreItem) => void;
  userBalance: { coins: number; gems: number };
}

const Store: React.FC<StoreProps> = ({ onPurchase, userBalance }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-8 border-b border-purple-500/30 pb-4">
        <h2 className="text-3xl font-orbitron text-purple-400 neon-text">LOJA CYBERPUNK</h2>
        <div className="flex gap-4">
          <div className="bg-black/50 border border-yellow-500/50 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="text-yellow-400">💰</span>
            <span className="font-bold">{userBalance.coins}</span>
          </div>
          <div className="bg-black/50 border border-cyan-500/50 px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="text-cyan-400">💎</span>
            <span className="font-bold">{userBalance.gems}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900/80 border-2 border-zinc-800 hover:border-purple-500 rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{item.icon}</div>
            <h3 className="text-xl font-orbitron text-white mb-2">{item.name}</h3>
            <p className="text-zinc-400 text-sm mb-6 h-12 leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-2xl font-bold text-green-400">
                R$ {(item.priceCents / 100).toFixed(2)}
              </span>
              <button
                onClick={() => onPurchase(item)}
                className="neon-btn px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider"
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