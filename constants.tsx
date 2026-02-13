
import { StoreItem } from './types';

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'pack-starter',
    name: 'Kit Iniciante',
    description: '500 Moedas + Boost de XP 1.2x por 7 dias.',
    priceCents: 500,
    benefitType: 'coins',
    benefitValue: 500,
    icon: '🎁'
  },
  {
    id: 'pack-speedster',
    name: 'Combo Velocista',
    description: '1500 Moedas + Skin Exclusiva Neon-Blue.',
    priceCents: 1000,
    benefitType: 'coins',
    benefitValue: 1500,
    icon: '⚡'
  },
  {
    id: 'pack-elite',
    name: 'Passe de Elite',
    description: '3000 Moedas + 2x XP por 15 dias + Acesso VIP.',
    priceCents: 1500,
    benefitType: 'vip',
    benefitValue: 1,
    icon: '🏆'
  },
  {
    id: 'pack-vault',
    name: 'Cofre Mega',
    description: '6000 Moedas + Efeito de Rastro Ultra Raro.',
    priceCents: 2000,
    benefitType: 'coins',
    benefitValue: 6000,
    icon: '💰'
  },
  {
    id: 'pack-legend',
    name: 'Lenda Cyberpunk',
    description: '15.000 Moedas + Status VIP Vitalício + Multiplicador 1.5x.',
    priceCents: 3000,
    benefitType: 'coins',
    benefitValue: 15000,
    icon: '🌌'
  }
];

export const DAILY_MISSIONS = [
  { id: 1, text: 'Colete 500 Orbs', reward: 100, goal: 500 },
  { id: 2, text: 'Sobreviva 120 segundos', reward: 150, goal: 120 },
  { id: 3, text: 'Atinja o Nível 5 hoje', reward: 200, goal: 5 }
];
