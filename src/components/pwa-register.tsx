'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('SW registered');
      }).catch(() => {
        // SW 注册失败不影响使用
      });
    }
  }, []);

  return null;
}
