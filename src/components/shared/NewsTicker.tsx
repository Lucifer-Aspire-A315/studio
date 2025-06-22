"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NewsTickerProps {
  items: string[];
  duration?: number;
  className?: string;
}

export function NewsTicker({ items, duration = 4000, className }: NewsTickerProps) {
  const [index, setIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;

    const changeItem = () => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % items.length);
        setIsFadingOut(false);
      }, 500); // This should match the CSS transition duration
    };

    const intervalId = setInterval(changeItem, duration);

    return () => clearInterval(intervalId);
  }, [items.length, duration]);

  return (
    <div className="h-7 flex items-center justify-center"> {/* Set a fixed height to prevent layout shift */}
      <p
        className={cn(
          'text-lg text-muted-foreground transition-opacity duration-500 ease-in-out',
          isFadingOut ? 'opacity-0' : 'opacity-100',
          className
        )}
      >
        {items[index]}
      </p>
    </div>
  );
}
