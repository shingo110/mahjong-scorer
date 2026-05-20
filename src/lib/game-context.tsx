'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Player } from './types';

/* ─── 游戏状态定义 ─── */

export interface GameState {
  /** 游戏阶段 */
  phase: 'setup' | 'playing' | 'settlement';
  /** 玩家列表 */
  players: Player[];
  /** 当前操作的玩家索引 */
  activePlayerIndex: number;
  /** 历史记录（每一条是一次操作） */
  history: ScoreLog[];
}

export interface ScoreLog {
  playerId: string;
  delta: number;
  timestamp: number;
}

/* ─── Action 类型 ─── */

type GameAction =
  | { type: 'SET_PLAYERS'; players: string[] }
  | { type: 'SET_ACTIVE_PLAYER'; index: number }
  | { type: 'ADD_SCORE'; playerId: string; delta: number }
  | { type: 'SETTLE' }
  | { type: 'RESET' };

/* ─── Reducer ─── */

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return {
        ...state,
        phase: 'playing',
        players: action.players.map((name, i) => ({
          id: `p${i}`,
          name,
          score: 0,
        })),
        activePlayerIndex: 0,
        history: [],
      };

    case 'SET_ACTIVE_PLAYER':
      return { ...state, activePlayerIndex: action.index };

    case 'ADD_SCORE': {
      const players = state.players.map(p => {
        if (p.id !== action.playerId) return p;
        return { ...p, score: p.score + action.delta };
      });
      return {
        ...state,
        players,
        history: [
          ...state.history,
          { playerId: action.playerId, delta: action.delta, timestamp: Date.now() },
        ],
      };
    }

    case 'SETTLE':
      return { ...state, phase: 'settlement' };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

/* ─── 初始状态 ─── */

const initialState: GameState = {
  phase: 'setup',
  players: [],
  activePlayerIndex: 0,
  history: [],
};

/* ─── Context ─── */

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  activePlayer: Player | null;
  /** 为当前活跃玩家加分 */
  scoreActivePlayer: (delta: number) => void;
  /** 开始游戏 */
  startGame: (names: string[]) => void;
  /** 结算 */
  settle: () => void;
  /** 重新开始 */
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const activePlayer =
    state.players[state.activePlayerIndex] ?? null;

  const scoreActivePlayer = useCallback(
    (delta: number) => {
      if (!activePlayer) return;
      dispatch({ type: 'ADD_SCORE', playerId: activePlayer.id, delta });
    },
    [activePlayer],
  );

  const startGame = useCallback((names: string[]) => {
    dispatch({ type: 'SET_PLAYERS', players: names });
  }, []);

  const settle = useCallback(() => {
    dispatch({ type: 'SETTLE' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <GameContext.Provider
      value={{ state, dispatch, activePlayer, scoreActivePlayer, startGame, settle, reset }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
