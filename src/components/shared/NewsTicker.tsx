
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface NewsTickerItem {
  text: React.ReactNode;
  textColor?: string;
  bgColor?: string;
}

interface NewsTickerProps {
  items: NewsTickerItem[];
  duration?: number;
  onContainerClick: () => void;
}

export function NewsTicker({ items, duration = 5000, onContainerClick }: NewsTickerProps) {
  const [index, setIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
      setIsFadingOut(false);
    }, 300);
  }, [items.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(goToNext, duration);
  }, [duration, goToNext]);

  const goToIndex = (newIndex: number) => {
    if (newIndex === index) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setIndex(newIndex);
      setIsFadingOut(false);
    }, 300);
    resetTimer();
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[index];
  const previousItem = items[(index - 1 + items.length) % items.length];
  const activeBgClass = isFadingOut ? previousItem.bgColor : currentItem.bgColor;

  return (
    <div
      onClick={onContainerClick}
      role="button"
      aria-label="Click to explore Government Scheme Loans"
      className={cn(
        'group cursor-pointer rounded-xl border border-border p-4 sm:p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20',
        'relative overflow-hidden transition-colors',
        activeBgClass
      )}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Featured Government Schemes</h3>
      </div>
      
      <div className="flex items-center justify-center min-h-[80px]">
        <div
          className={cn(
            'text-lg sm:text-xl font-medium transition-opacity duration-300 ease-in-out w-full px-10',
            isFadingOut ? 'opacity-0' : 'opacity-100',
            currentItem.textColor
          )}
        >
          {currentItem.text}
        </div>
      </div>

       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goToIndex(i);
              }}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                i === index ? 'w-4 bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
    </div>
  );
}
