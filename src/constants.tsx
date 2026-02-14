
import { StoreItem } from './types';

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'cpu_v1',
    name: 'Neural CPU v1',
    description: 'Melhora seu processamento: +10% de Score em todas as partidas.',
    price: 500,
    currency: 'coins', // Compra com moedas do jogo
    effect: { type: 'scoreMultiplier', value: 0.1 },
    icon: '🧠'
  },
  {
    id: 'miner_v1',
    name: 'Crypto Miner',
    description: 'Minera enquanto corre: +20% de Moedas ganhas por partida.',
    price: 15,
    currency: 'gems', // Compra com dinheiro real (Gemas)
    effect: { type: 'coinMultiplier', value: 0.2 },
    icon: '⛏️'
  },
  {
    id: 'vip_pass',
    name: 'ACESSO VIP',
    description: 'Status Lendário: Dobra TODOS os ganhos e libera área exclusiva.',
    price: 30,
    currency: 'gems', // Compra com dinheiro real
    effect: { type: 'vip', value: true },
    icon: '👑'
  }
];

export const DAILY_MISSIONS = [
  { id: 1, text: 'Colete 500 Orbs', reward: 100, goal: 500 },
  { id: 2, text: 'Sobreviva 120 segundos', reward: 150, goal: 120 },
  { id: 3, text: 'Atinja o Nível 5 hoje', reward: 200, goal: 5 }
];
