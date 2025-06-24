
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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

  const goToPrev = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
      setIsFadingOut(false);
    }, 300);
  }, [items.length]);
  
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(goToNext, duration);
  }, [duration, goToNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);
  
  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPrev();
    resetTimer();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNext();
    resetTimer();
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[index];

  return (
    <div
      onClick={onContainerClick}
      role="button"
      aria-label="Click to explore Government Scheme Loans"
      className={cn(
        'group cursor-pointer rounded-xl border border-border p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20',
        'relative overflow-hidden transition-colors',
        isFadingOut ? 'bg-card' : currentItem.bgColor
      )}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Featured Government Schemes</h3>
      </div>
      
      <div className="flex items-center justify-center min-h-[100px]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={handlePrevClick}
          aria-label="Previous scheme"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div
          className={cn(
            'text-lg sm:text-xl font-medium transition-opacity duration-300 ease-in-out w-full px-10',
            isFadingOut ? 'opacity-0' : 'opacity-100',
            currentItem.textColor
          )}
        >
          {currentItem.text}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={handleNextClick}
          aria-label="Next scheme"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
