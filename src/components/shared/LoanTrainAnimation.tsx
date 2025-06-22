
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Train {
  id: number;
  text: string;
  colorClass: string;
}

const loanItems = [
  { text: "Pradhan Mantri Mudra Yojana (PMMY) - Funding for the unfunded." },
  { text: "Stand-Up India Scheme - Empowering SC/ST & women entrepreneurs." },
  { text: "Prime Minister’s Employment Generation Programme (PMEGP) - Creating self-employment opportunities." },
  { text: "PM SVANidhi Scheme - Working capital for street vendors." },
  { text: "PM Vishwakarma Scheme - End-to-end support for artisans and craftspeople." }
];

const colors = ['bg-sky-200', 'bg-green-200', 'bg-pink-200', 'bg-yellow-200', 'bg-purple-200'];

export function LoanTrainAnimation() {
  const [activeTrains, setActiveTrains] = useState<Train[]>([]);

  useEffect(() => {
    let currentLoanIndex = 0;

    const createTrain = () => {
      const newTrain: Train = {
        id: Date.now() + Math.random(),
        text: loanItems[currentLoanIndex].text,
        colorClass: colors[currentLoanIndex % colors.length]
      };
      
      setActiveTrains(prev => [...prev, newTrain]);
      currentLoanIndex = (currentLoanIndex + 1) % loanItems.length;
    };

    // Start the first train immediately
    createTrain(); 
    
    // Stagger subsequent trains
    const interval = setInterval(createTrain, 4000); // New train every 4 seconds
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleAnimationEnd = (id: number) => {
    setActiveTrains(prev => prev.filter(train => train.id !== id));
  };

  return (
    <div className="loan-train-container">
      {activeTrains.map(train => (
        <div
          key={train.id}
          className={cn('train', train.colorClass)}
          onAnimationEnd={() => handleAnimationEnd(train.id)}
        >
          <span className="train-engine">🚂</span>
          {train.text}
        </div>
      ))}
    </div>
  );
}
