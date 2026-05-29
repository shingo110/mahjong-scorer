'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Trophy, Undo2, ScrollText } from 'lucide-react';
import NumberPad from './number-pad';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function GamePage() {
  const router = useRouter();
  const { state, activePlayer, dispatch, reset, settle } = useGame();
  const { players, activePlayerIndex } = state;
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // 如果没玩家，回首页
  useEffect(() => {
    if (players.length === 0) {
      router.replace('/');
    }
  }, [players.length, router]);
  if (players.length === 0) return null;

  const maxScore = Math.max(...players.map(p => p.score), 0);
  const minScore = Math.min(...players.map(p => p.score), 0);
  const range = maxScore - minScore || 1;

  return (
    <div className="flex flex-1 flex-col h-dvh">
      {/* ─── 顶部：玩家分数条 ─── */}
      <div className="flex-shrink-0 flex gap-2 p-3 pb-2 overflow-x-auto">
        {players.map((p, i) => {
          const isActive = i === activePlayerIndex;
          const barHeight = range > 0
            ? Math.max(8, ((p.score - minScore) / range) * 100)
            : 50;

          return (
            <button
              key={p.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_PLAYER', index: i })}
              className={`
                flex flex-col items-center gap-1.5 min-w-[72px] flex-1 rounded-xl p-3
                transition-all duration-200
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                  : 'bg-card text-card-foreground hover:bg-accent border border-border/50'
                }
              `}
            >
              <span className="text-xs font-medium truncate max-w-[64px]">
                {p.name}
              </span>
              <span className="text-xl font-bold tabular-nums leading-none">
                {p.score}
              </span>
              <div className="w-full h-1.5 rounded-full bg-background/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-current opacity-60 transition-all duration-300"
                  style={{ width: `${barHeight}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── 中间：活跃玩家大分数 ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-h-0">
        <p className="text-sm text-muted-foreground mb-1">当前记分</p>
        <p className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tight text-foreground">
          {activePlayer?.score ?? 0}
        </p>
        <p className="text-lg text-muted-foreground mt-1">
          {activePlayer?.name}
        </p>
      </div>

      {/* ─── 底部：数字面板 ─── */}
      <div className="flex-shrink-0 px-3 pb-3">
        <NumberPad />
      </div>

      {/* ─── 底部操作栏 ─── */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => setShowBackConfirm(true)}
        >
          <Undo2 className="h-4 w-4" />
          返回
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => router.push('/history')}
        >
          <ScrollText className="h-4 w-4" />
          记录
        </Button>

        <Button
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => {
            settle();
            router.push('/settlement');
          }}
        >
          <Trophy className="h-4 w-4" />
          结算
        </Button>
      </div>

      {/* ─── 返回确认弹窗 ─── */}
      <Dialog open={showBackConfirm} onOpenChange={setShowBackConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>确认返回？</DialogTitle>
            <DialogDescription>
              返回将清空当前所有计分记录，确定要返回吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => setShowBackConfirm(false)}
            >
              不返回
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              onClick={() => {
                setShowBackConfirm(false);
                reset();
              }}
            >
              确认返回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
