'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { calculateSettlement, getWinnersAndLosers } from '@/lib/utils/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw, Home, ArrowRight } from 'lucide-react';

export default function SettlementPage() {
  const router = useRouter();
  const { state } = useGame();
  const { players } = state;

  // 没数据回首页 — 用空状态展示，避免导航冲突
  if (players.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <p className="text-muted-foreground">暂无结算数据</p>
        <Button className="mt-4" onClick={() => router.push('/')}>
          <Home className="h-4 w-4 mr-2" />
          返回首页
        </Button>
      </div>
    );
  }

  const settlements = calculateSettlement(players);
  const { winner, loser } = getWinnersAndLosers(players);

  // 按分数从高到低排序
  const ranked = [...players].sort((a, b) => b.score - a.score);

  function handlePlayAgain() {
    router.push('/');
  }

  return (
    <div className="flex flex-1 flex-col p-4 gap-4 max-w-lg mx-auto w-full overflow-y-auto">
      {/* 标题 */}
      <div className="text-center pt-2 pb-1">
        <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-1" />
        <h1 className="text-2xl font-bold">结算</h1>
        <p className="text-sm text-muted-foreground">牌局结束，来看结果</p>
      </div>

      {/* ─── 1. 荣誉榜：大赢家 / 大输家 ─── */}
      {(winner || loser) && (
        <div className="grid grid-cols-2 gap-3">
          {winner && (
            <Card className="bg-success/5 border-success/20">
              <CardContent className="py-4 text-center">
                <p className="text-lg mb-1">🏆</p>
                <p className="text-xs text-muted-foreground mb-1">大赢家</p>
                <p className="text-lg font-bold text-success">{winner.name}</p>
                <p className="text-sm text-muted-foreground">+{winner.score}</p>
              </CardContent>
            </Card>
          )}
          {loser && (
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="py-4 text-center">
                <p className="text-lg mb-1">😅</p>
                <p className="text-xs text-muted-foreground mb-1">大输家</p>
                <p className="text-lg font-bold text-destructive">{loser.name}</p>
                <p className="text-sm text-muted-foreground">{loser.score}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ─── 2. 最终排名 ─── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">最终排名</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ranked.map((p, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const prefix = i < 3 ? medals[i] : `#${i + 1}`;

            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3 bg-card border border-border/50"
              >
                <span className="text-lg w-8 text-center">{prefix}</span>
                <span className="flex-1 font-medium">{p.name}</span>
                <span
                  className={`text-lg font-bold tabular-nums ${
                    p.score > 0 ? 'text-success' : p.score < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {p.score > 0 ? '+' : ''}{p.score}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ─── 3. 转账说明 ─── */}
      {settlements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">转账说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {settlements.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl bg-card border border-border/50 px-4 py-3"
              >
                <span className="font-medium text-destructive">{s.from}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-success">{s.to}</span>
                <span className="ml-auto font-bold tabular-nums text-foreground">
                  ¥{s.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-2 pb-4">
        <Button
          variant="outline"
          className="flex-1 gap-1.5"
          onClick={() => router.push('/game')}
        >
          <RotateCcw className="h-4 w-4" />
          返回记分
        </Button>
        <Button
          className="flex-1 gap-1.5"
          onClick={handlePlayAgain}
        >
          <Home className="h-4 w-4" />
          再来一局
        </Button>
      </div>
    </div>
  );
}
