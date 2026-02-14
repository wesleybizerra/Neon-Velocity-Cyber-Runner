// src/types.ts

// TEM QUE TER A PALAVRA 'export' AQUI EMBAIXO
export enum GameState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  PLAYING = 'PLAYING',
  STORE = 'STORE'
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  effect: { type: string; value: any };
  icon: string;
}

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
  benefits: any[];
}

export interface MatchResult {
  score: number;
  coinsEarned: number;
  xpEarned: number;
  orbsCollected?: number;
}