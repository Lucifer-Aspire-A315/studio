
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NewsTickerItem {
  text: string;
  className?: string;
}

interface NewsTickerProps {
  items: NewsTickerItem[];
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
  }, [items, duration]);

  const currentItem = items[index] || { text: '', className: '' };

  return (
    <p
      className={cn(
        'text-2xl font-semibold transition-opacity duration-500 ease-in-out text-center flex items-center justify-center min-h-[80px]',
        isFadingOut ? 'opacity-0' : 'opacity-100',
        currentItem.className, // Apply the color class
        className
      )}
    >
      {currentItem.text}
    </p>
  );
}
