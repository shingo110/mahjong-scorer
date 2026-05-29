'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Palette } from 'lucide-react';

const THEME_KEY = 'mahjong-theme';
const POS_KEY = 'mahjong-theme-pos';
const BTN_SIZE = 40;
const EDGE_PAD = 12;
const DEFAULT_TOP = 80;
const DEFAULT_BOTTOM = 100;

interface SavedPos {
  left: number | null;
  top: number;
}

const THEMES = [
  { id: 'light', name: '亮原色', colors: ['#5BBFBA', '#F5F5F5', '#2B2D42'] },
  { id: 'dark', name: '暗原色', colors: ['#40916C', '#1A1A1A', '#E5E5E5'] },
  { id: '高级灰紫', name: '高级灰紫', colors: ['#8D99AE', '#2B2D42', '#EDF2F4'] },
  { id: '极简黑白', name: '极简黑白', colors: ['#A3A3A3', '#0A0A0A', '#F5F5F5'] },
  { id: '科技蓝灰', name: '科技蓝灰', colors: ['#334155', '#0F172A', '#38BDF8'] },
  { id: '冷调蓝绿', name: '冷调蓝绿', colors: ['#40916C', '#1B4332', '#D8F3DC'] },
  { id: '暖调米灰', name: '暖调米灰', colors: ['#B7B7A4', '#4A4A48', '#F5F3EF'] },
  { id: '品牌红黑', name: '品牌红黑', colors: ['#B91C1C', '#1F1F1F', '#E5E5E5'] },
  { id: '商务蓝色', name: '商务蓝色', colors: ['#457B9D', '#1D3557', '#F1FAEE'] },
  { id: '质感棕色', name: '质感棕色', colors: ['#A68A64', '#3E2C23', '#F2E8CF'] },
];

function applyTheme(themeId: string) {
  document.documentElement.setAttribute('data-theme', themeId);
  document.documentElement.classList.toggle('dark', themeId !== 'light');
  localStorage.setItem(THEME_KEY, themeId);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<SavedPos | null>(null);
  const dragging = useRef(false);
  const anchor = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);
    setTheme(saved);

    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) setPos(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selectTheme = useCallback((id: string) => {
    applyTheme(id);
    setTheme(id);
    setOpen(false);
  }, []);

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

  const btnStyle: React.CSSProperties = {
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
    top: pos ? pos.top : 'auto',
    bottom: pos ? 'auto' : DEFAULT_BOTTOM,
    ...(pos && pos.left !== null
      ? { left: pos.left }
      : { right: EDGE_PAD }),
  };

  const activeTheme = THEMES.find(t => t.id === theme) ?? THEMES[0];

  const panelStyle = (): React.CSSProperties => {
    if (!btnRef.current) return { position: 'fixed', top: 0, left: 0, zIndex: 1000, opacity: 0 };
    const r = btnRef.current.getBoundingClientRect();
    const panelW = 44 * 5 + 8 * 4 + 16;
    const panelH = 44 * 2 + 8 + 16;
    let top = r.top - panelH - 10;
    if (top < 10) top = r.bottom + 10;
    let left = r.left + r.width / 2 - panelW / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - panelW - 10));
    return {
      position: 'fixed',
      top,
      left,
      zIndex: 1000,
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      padding: 8,
    };
  };

  return (
    <>
      <button
        ref={btnRef}
        style={btnStyle}
        onClick={() => setOpen(v => !v)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label="切换主题"
      >
        <Palette size={18} />
      </button>

      {open && (
        <div ref={panelRef} style={panelStyle()}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8,
            }}
          >
            {THEMES.map(t => {
              const isActive = t.id === theme;
              const previewColor = t.colors[0];
              return (
                <button
                  key={t.id}
                  onClick={() => selectTheme(t.id)}
                  title={t.name}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: previewColor,
                    border: isActive ? '3px solid var(--color-foreground)' : '2px solid var(--color-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.15s, border-color 0.15s',
                    outline: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
