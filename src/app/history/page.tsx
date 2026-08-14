'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { state, hydrated } = useGame();
  const { players, history } = state;

  // 没数据回首页（注意：所有 hook 必须在此之前调用，避免破坏 hooks 顺序）
  useEffect(() => {
    if (players.length === 0) {
      router.replace('/');
    }
  }, [players.length, router]);

  // 水合前占位，避免存档未载入时误判为空
  if (!hydrated) return null;
  if (players.length === 0) return null;

  // 按时间倒序排列
  const reversed = [...history].reverse();

  // 查找玩家名称
  function getPlayerName(playerId: string): string {
    return players.find(p => p.id === playerId)?.name ?? playerId;
  }

  return (
    <div className="flex flex-1 flex-col p-4 gap-4 max-w-lg mx-auto w-full overflow-y-auto">
      {/* 标题 */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/game')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">记分记录</h1>
      </div>

      {reversed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <RotateCcw className="h-10 w-10 mb-3 opacity-30" />
          <p>还没有记分记录</p>
          <p className="text-sm">返回游戏页开始记分吧</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              共 {history.length} 次操作
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {reversed.map((log, i) => {
              const ts = new Date(log.timestamp);
              const isToday = ts.toDateString() === new Date().toDateString();
              const pad = (n: number) => n.toString().padStart(2, '0');
              const time = isToday
                ? `${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}`
                : `${pad(ts.getMonth() + 1)}-${pad(ts.getDate())} ${pad(ts.getHours())}:${pad(ts.getMinutes())}`;
              const isPositive = log.delta > 0;

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-card border border-border/30"
                >
                  <span className="text-xs text-muted-foreground w-16 shrink-0 font-mono">
                    {time}
                  </span>
                  <span className="font-medium flex-1 truncate">
                    {getPlayerName(log.playerId)}
                  </span>
                  <span
                    className={`font-bold tabular-nums ${
                      isPositive ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {isPositive ? '+' : ''}{log.delta}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center pb-4">
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => router.push('/game')}
        >
          <ArrowLeft className="h-4 w-4" />
          返回记分
        </Button>
      </div>
    </div>
  );
}
