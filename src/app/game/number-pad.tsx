'use client';

import { useState, useCallback } from 'react';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Delete } from 'lucide-react';

export default function NumberPad() {
  const { scoreActivePlayer } = useGame();
  const [input, setInput] = useState('');

  const value = input === '' ? 0 : parseInt(input, 10);

  const handleKey = useCallback((key: string) => {
    switch (key) {
      case 'C':
        setInput('');
        break;
      case '⌫':
        setInput(prev => prev.slice(0, -1));
        break;
      default:
        setInput(prev => {
          // 归一化：去除前导零，保证显示值与实际值一致
          const next = (parseInt(prev + key, 10) || 0).toString();
          if (next.length > 5) return prev;
          return next;
        });
        break;
    }
  }, []);

  const handleAdd = useCallback(() => {
    if (value === 0) return;
    scoreActivePlayer(value);
    setInput('');
  }, [value, scoreActivePlayer]);

  const handleSubtract = useCallback(() => {
    if (value === 0) return;
    scoreActivePlayer(-value);
    setInput('');
  }, [value, scoreActivePlayer]);

  return (
    <div className="space-y-3">
      {/* 输入显示 */}
      <div className="flex items-center bg-card rounded-xl px-5 py-4 border border-border/50">
        <span className="text-2xl sm:text-3xl font-bold tabular-nums w-full text-right">
          {input === '' ? '0' : input}
        </span>
      </div>

      {/* 数字键盘：4列网格，第4列竖向排列 +/- */}
      <div className="grid grid-cols-4 gap-2">
        {/* 第1行：1 2 3 */}
        {(['1', '2', '3'] as const).map(key => (
          <Button
            key={key}
            variant="secondary"
            className="h-14 text-lg font-semibold rounded-xl bg-card hover:bg-accent text-foreground"
            onClick={() => handleKey(key)}
          >
            {key}
          </Button>
        ))}

        {/* 第1-2行跨列：+ 按钮（右侧第4列，跨2行） */}
        <Button
          variant="default"
          className="row-span-2 h-full min-h-[7.5rem] rounded-xl text-2xl bg-success hover:bg-success/90 disabled:opacity-40"
          disabled={value === 0}
          onClick={handleAdd}
        >
          <Plus className="h-7 w-7" />
        </Button>

        {/* 第2行：4 5 6 */}
        {(['4', '5', '6'] as const).map(key => (
          <Button
            key={key}
            variant="secondary"
            className="h-14 text-lg font-semibold rounded-xl bg-card hover:bg-accent text-foreground"
            onClick={() => handleKey(key)}
          >
            {key}
          </Button>
        ))}

        {/* 第3行：7 8 9 */}
        {(['7', '8', '9'] as const).map(key => (
          <Button
            key={key}
            variant="secondary"
            className="h-14 text-lg font-semibold rounded-xl bg-card hover:bg-accent text-foreground"
            onClick={() => handleKey(key)}
          >
            {key}
          </Button>
        ))}

        {/* 第3-4行跨列：− 按钮（右侧第4列，跨2行） */}
        <Button
          variant="default"
          className="row-span-2 h-full min-h-[7.5rem] rounded-xl text-2xl bg-destructive hover:bg-destructive/90 disabled:opacity-40"
          disabled={value === 0}
          onClick={handleSubtract}
        >
          <Minus className="h-7 w-7" />
        </Button>

        {/* 第4行：C 0 ⌫ */}
        <Button
          variant="ghost"
          className="h-14 text-lg font-semibold rounded-xl text-muted-foreground"
          onClick={() => handleKey('C')}
        >
          清空
        </Button>
        <Button
          variant="secondary"
          className="h-14 text-lg font-semibold rounded-xl bg-card hover:bg-accent text-foreground"
          onClick={() => handleKey('0')}
        >
          0
        </Button>
        <Button
          variant="ghost"
          className="h-14 text-lg font-semibold rounded-xl text-muted-foreground"
          onClick={() => handleKey('⌫')}
        >
          <Delete className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
