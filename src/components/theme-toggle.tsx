'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const THEME_KEY = 'mahjong-theme';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // 启动时读取 localStorage
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const preferDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(preferDark);
    document.documentElement.classList.toggle('dark', preferDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed top-3 right-3 z-50 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
      onClick={toggle}
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
