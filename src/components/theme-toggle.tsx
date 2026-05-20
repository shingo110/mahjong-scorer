'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEME_KEY = 'mahjong-theme';
const POS_KEY = 'mahjong-theme-pos';
const BTN_SIZE = 40; // px
const EDGE_PAD = 12; // px
const DEFAULT_TOP = 80;
const DEFAULT_BOTTOM = 100;

interface SavedPos {
  left: number | null; // null = right-snapped
  top: number;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [pos, setPos] = useState<SavedPos | null>(null);
  const dragging = useRef(false);
  const anchor = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  /* ─── 初始化：读取 localStorage ─── */
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const preferDark =
      saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(preferDark);
    document.documentElement.classList.toggle('dark', preferDark);

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) setPos(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  /* ─── 切换主题 ─── */
  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  /* ─── 拖拽事件 ─── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = btnRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragging.current = true;
    const r = el.getBoundingClientRect();
    anchor.current = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({
      left: anchor.current.left + (e.clientX - anchor.current.x),
      top: anchor.current.top + (e.clientY - anchor.current.y),
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const el = btnRef.current;
    if (!el) return;
    el.releasePointerCapture(e.pointerId);

    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const centerX = r.left + r.width / 2;
    const snapLeft = centerX < vw / 2;
    const snap = snapLeft
      ? EDGE_PAD
      : vw - r.width - EDGE_PAD;
    const y = Math.max(10, Math.min(r.top, window.innerHeight - r.height - 10));

    const saved: SavedPos = { left: snapLeft ? snap : null, top: y };
    setPos(saved);
    localStorage.setItem(POS_KEY, JSON.stringify(saved));
  }, []);

  /* ─── 计算样式 ─── */
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 999,
    cursor: dragging.current ? 'grabbing' : 'grab',
    touchAction: 'none',
    userSelect: 'none',
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    backdropFilter: 'blur(8px)',
    color: 'var(--color-foreground)',
    transition: dragging.current ? 'none' : 'box-shadow 0.2s',
    // 位置 — 默认在右下角，远离顶部标签区
    top: pos ? pos.top : 'auto',
    bottom: pos ? 'auto' : DEFAULT_BOTTOM,
    ...(pos && pos.left !== null
      ? { left: pos.left }
      : { right: EDGE_PAD }),
  };

  return (
    <button
      ref={btnRef}
      style={style}
      onClick={toggle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
