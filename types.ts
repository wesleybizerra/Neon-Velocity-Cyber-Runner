
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  streak: number;
  lastLogin: Date;
  referralCode: string;
  benefits: string[];
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  benefitType: 'coins' | 'xp_boost' | 'gems' | 'vip';
  benefitValue: number;
  icon: string;
}

export enum GameState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  PLAYING = 'PLAYING',
  STORE = 'STORE',
  LEADERBOARD = 'LEADERBOARD',
  PROFILE = 'PROFILE'
}

export interface MatchResult {
  score: number;
  coinsEarned: number;
  xpEarned: number;
  orbsCollected: number;
}
