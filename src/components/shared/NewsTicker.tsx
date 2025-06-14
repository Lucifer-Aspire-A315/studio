"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const newsItems = [
  { text: "PM Mudra Yojana: Loan limit increased to ₹20 lakh to support more entrepreneurs.", color: "text-green-600", size: "text-lg" },
  { text: "Stand-Up India: Over ₹61,000 crore sanctioned to empower SC, ST, and women entrepreneurs.", color: "text-indigo-600", size: "text-lg" },
  { text: "PM SVANidhi: Extended till Dec 2024 to continue supporting street vendors.", color: "text-red-600", size: "text-xl" },
  { text: "PMEGP: Margin money subsidy of ₹300 crore recently disbursed to boost employment.", color: "text-purple-600", size: "text-lg" },
  { text: "Mudra Loans: Over 52 crore entrepreneurs empowered in the last 11 years.", color: "text-sky-600", size: "text-lg" }
];

export function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState(newsItems[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        setIsVisible(true);
      }, 500); // Corresponds to opacity transition duration
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCurrentItem(newsItems[currentIndex]);
  }, [currentIndex]);

  return (
    <div className="news-ticker h-12 relative mt-6 mb-2 flex items-center justify-center overflow-hidden max-w-3xl mx-auto">
      <div
        className={cn(
          "news-item absolute w-full text-center font-medium transition-opacity duration-500 ease-in-out",
          currentItem.color,
          currentItem.size,
          isVisible ? "opacity-100" : "opacity-0"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {currentItem.text}
      </div>
    </div>
  );
}
