export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export type Operation = 'add' | 'subtract';