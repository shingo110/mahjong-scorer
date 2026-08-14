'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { Player } from './types';

const STORAGE_KEY = 'mahjong-game-state';

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
  | { type: 'HYDRATE'; state: GameState }
  | { type: 'SET_PLAYERS'; players: string[] }
  | { type: 'SET_ACTIVE_PLAYER'; index: number }
  | { type: 'ADD_SCORE'; playerId: string; delta: number }
  | { type: 'SETTLE' }
  | { type: 'RESET' };

/* ─── Reducer ─── */

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

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
// 注意：SSR 下所有客户端首帧必须与预渲染 HTML 完全一致，
// 因此首帧恒为 initialState，存档在挂载后通过 HYDRATE 注入，避免 hydration mismatch。

const initialState: GameState = {
  phase: 'setup',
  players: [],
  activePlayerIndex: 0,
  history: [],
};

/** 从 localStorage 读取存档（仅客户端，挂载后调用） */
function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (parsed && Array.isArray(parsed.players)) {
      return { ...initialState, ...parsed };
    }
  } catch {
    /* 脏数据：忽略，回落到初始态 */
  }
  return null;
}

/* ─── Context ─── */

interface GameContextValue {
  state: GameState;
  /** 存档是否已从 localStorage 水合完成（用于防止首帧误判空局） */
  hydrated: boolean;
  /** 当前活跃玩家 */
  activePlayer: Player | null;
  /** 为当前活跃玩家加分 */
  scoreActivePlayer: (delta: number) => void;
  /** 切换当前活跃玩家 */
  setActivePlayer: (index: number) => void;
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
  const [hydrated, setHydrated] = useState(false);

  // 挂载后水合存档（首帧保持与 SSR 一致，杜绝 hydration mismatch）
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      dispatch({ type: 'HYDRATE', state: saved });
    }
    setHydrated(true);
  }, []);

  // 持久化：水合完成后的每次状态变更同步写入 localStorage
  useEffect(() => {
    if (!hydrated) return; // 水合前禁止写回，避免覆盖存档
    try {
      if (state.phase === 'setup' && state.players.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      /* 忽略配额或隐私模式异常 */
    }
  }, [state, hydrated]);

  const activePlayer =
    state.players[state.activePlayerIndex] ?? null;

  const scoreActivePlayer = useCallback(
    (delta: number) => {
      if (!activePlayer) return;
      dispatch({ type: 'ADD_SCORE', playerId: activePlayer.id, delta });
    },
    [activePlayer],
  );

  const setActivePlayer = useCallback((index: number) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', index });
  }, []);

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
      value={{ state, hydrated, activePlayer, scoreActivePlayer, setActivePlayer, startGame, settle, reset }}
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
