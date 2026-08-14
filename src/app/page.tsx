'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { generateRandomNickname } from '@/lib/utils/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Users } from 'lucide-react';

const DEFAULT_NAMES = ['', '', '', ''];

export default function HomePage() {
  const router = useRouter();
  const { startGame, state } = useGame();
  const [names, setNames] = useState<string[]>([...DEFAULT_NAMES]);
  const [playerCount, setPlayerCount] = useState(4);

  const hasOngoing = state.phase !== 'setup' && state.players.length > 0;

  // 当前激活的玩家昵称（trim后）
  const activeNames = useMemo(
    () => names.slice(0, playerCount).map(n => n.trim()),
    [names, playerCount],
  );

  // 检查去重：找出所有重复的索引
  const duplicateIndices = useMemo(() => {
    const dupSet = new Set<number>();
    for (let i = 0; i < activeNames.length; i++) {
      if (!activeNames[i]) continue;
      for (let j = 0; j < activeNames.length; j++) {
        if (i !== j && activeNames[i] === activeNames[j]) {
          dupSet.add(i);
        }
      }
    }
    return dupSet;
  }, [activeNames]);

  const allFilled = activeNames.every(n => n.length > 0);
  const hasDuplicates = duplicateIndices.size > 0;
  const canStart = allFilled && !hasDuplicates && playerCount >= 2;

  function updateName(index: number, value: string) {
    const next = [...names];
    next[index] = value;
    setNames(next);
  }

  function randomizeOne(index: number) {
    const next = [...names];
    // 收集当前已上屏的昵称（排除自身）
    const usedNames = new Set(
      next.map((n, i) => (i !== index ? n.trim() : '')).filter(Boolean),
    );
    // 持续随机直到不重复（安全上限防死循环）
    let nickname: string;
    let attempts = 0;
    do {
      nickname = generateRandomNickname();
      attempts++;
    } while (usedNames.has(nickname) && attempts < 200);
    next[index] = nickname;
    setNames(next);
  }

  function handleStart() {
    const uniqueNames = [...new Set(activeNames)];
    if (uniqueNames.length < 2) return;
    startGame(uniqueNames);
    router.push('/game');
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      {hasOngoing && (
        <div className="w-full max-w-md mx-auto mb-3 p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-3">
          <div className="text-sm min-w-0">
            <p className="font-medium truncate">检测到进行中的牌局</p>
            <p className="text-xs text-muted-foreground">
              {state.players.length} 人 · {state.phase === 'settlement' ? '已结算' : '记分中'}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => router.push(state.phase === 'settlement' ? '/settlement' : '/game')}
          >
            继续
          </Button>
        </div>
      )}
      <Card className="w-full max-w-md mx-auto shadow-lg border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-3xl">
            🀄
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            麻将计分器
          </CardTitle>
          <CardDescription className="text-base">
            线下打麻将 · 简单记分
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* 人数选择 */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
              disabled={playerCount <= 2}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[100px] justify-center">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium tabular-nums">{playerCount} 人局</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPlayerCount(Math.min(8, playerCount + 1))}
              disabled={playerCount >= 8}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* 玩家名称输入 */}
          <div className="space-y-3">
            {Array.from({ length: playerCount }).map((_, i) => {
              const isDuplicate = duplicateIndices.has(i);
              return (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center text-sm font-medium text-muted-foreground shrink-0">
                      {i + 1}
                    </span>
                    <Input
                      placeholder={`玩家 ${i + 1}`}
                      value={names[i] ?? ''}
                      onChange={e => updateName(i, e.target.value)}
                      className={`flex-1 ${isDuplicate ? 'border-destructive ring-1 ring-destructive/30' : ''}`}
                      maxLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => randomizeOne(i)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:bg-accent transition-colors"
                      title="随机昵称"
                    >
                      🎲
                    </button>
                  </div>
                  {isDuplicate && (
                    <p className="text-xs text-destructive mt-1 ml-8">
                      昵称重复，请修改
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full h-12 text-base"
            disabled={!canStart}
            onClick={handleStart}
          >
            开始游戏
          </Button>
          {!allFilled && (
            <p className="text-xs text-muted-foreground">
              请为所有玩家填写昵称
            </p>
          )}
          {allFilled && hasDuplicates && (
            <p className="text-xs text-destructive">
              昵称存在重复，请修改
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
