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

export const REAL_MONEY_ITEMS = [
  {
    id: 'pack_iniciante',
    name: 'PACK INICIANTE',
    description: 'O kit básico para começar bem.',
    price: 5.00, // Reais
    benefits: {
      gems: 100,
      coins: 1000,
      bonus: 'Sem bônus extra'
    },
    icon: '🎒'
  },
  {
    id: 'pack_mediano',
    name: 'PACK MEDIANO',
    description: 'Excelente custo benefício para evoluir rápido.',
    price: 10.00, // Reais
    benefits: {
      gems: 200,
      coins: 2000,
      bonus: '+10% Ganhos de Moeda (Permanente)'
    },
    icon: '🚀'
  },
  {
    id: 'pack_profissional',
    name: 'PACK PROFISSIONAL',
    description: 'Para quem leva a corrida a sério.',
    price: 15.00, // Reais
    benefits: {
      gems: 300,
      coins: 3000,
      bonus: '+15% Ganhos de Moeda (Permanente)'
    },
    icon: '👟'
  },
  {
    id: 'pack_superior',
    name: 'PACK SUPERIOR',
    description: 'Domine o ranking com facilidade.',
    price: 20.00, // Reais
    benefits: {
      gems: 400,
      coins: 4000,
      bonus: '+20% Ganhos de Moeda (Permanente)'
    },
    icon: '🔥'
  },
  {
    id: 'pack_ultra', // Mudei o ID para não dar conflito
    name: 'PACK ULTRA', // Mudei o nome para diferenciar
    description: 'Velocidade máxima e recursos abundantes.',
    price: 25.00, // Reais
    benefits: {
      gems: 500,
      coins: 5000,
      bonus: '+25% Ganhos de Moeda (Permanente)'
    },
    icon: '⏩'
  },
  { // AQUI ESTAVA FALTANDO ESTA CHAVE
    id: 'pack_legend',
    name: 'PACK LENDA CYBER',
    description: 'O pacote supremo. Poder total.',
    price: 30.00, // Reais
    benefits: {
      gems: 700,
      coins: 7000,
      bonus: 'ACESSO VIP + Dobro de Score (Permanente)'
    },
    icon: '👑'
  }
];