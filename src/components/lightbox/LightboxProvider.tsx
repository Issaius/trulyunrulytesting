'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import ImageLightbox from './ImageLightbox';
import type { LightboxItem } from './types';

type LightboxContextValue = {
  open: (items: LightboxItem[], index: number) => void;
  close: () => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error('useLightbox must be used within LightboxProvider');
  }
  return ctx;
}

type LightboxProviderProps = {
  children: ReactNode;
};

export function LightboxProvider({ children }: LightboxProviderProps) {
  const [state, setState] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const open = useCallback((items: LightboxItem[], index: number) => {
    if (items.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, items.length - 1));
    setState({ items, index: safeIndex });
  }, []);

  const close = useCallback(() => setState(null), []);

  const onPrev = useCallback(() => {
    setState((s) => {
      if (!s || s.items.length === 0) return s;
      const nextIndex = (s.index - 1 + s.items.length) % s.items.length;
      return { ...s, index: nextIndex };
    });
  }, []);

  const onNext = useCallback(() => {
    setState((s) => {
      if (!s || s.items.length === 0) return s;
      const nextIndex = (s.index + 1) % s.items.length;
      return { ...s, index: nextIndex };
    });
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' &&
        state &&
        createPortal(
          <ImageLightbox
            items={state.items}
            index={state.index}
            onClose={close}
            onPrev={onPrev}
            onNext={onNext}
          />,
          document.body,
        )}
    </LightboxContext.Provider>
  );
}
