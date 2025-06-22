
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface Train {
  id: number;
  text: string;
  colorClass: string;
}

const loanItems = [
  { text: "PM Mudra Yojana: Loan limit increased to ₹20 lakh." },
  { text: "Stand-Up India: Over ₹61,000 crore sanctioned." },
  { text: "PM SVANidhi: Extended till Dec 2024 for street vendors." },
  { text: "PMEGP: Margin money subsidy to boost employment." },
  { text: "Mudra Loans: Over 52 crore entrepreneurs empowered." }
];

const colors = ['bg-sky-200', 'bg-green-200', 'bg-pink-200', 'bg-yellow-200', 'bg-purple-200'];

export function LoanTrainAnimation() {
  const [activeTrains, setActiveTrains] = useState<Train[]>([]);
  const [loanIndex, setLoanIndex] = useState(0);

  const createTrain = useCallback(() => {
    const newTrain: Train = {
      id: Date.now() + Math.random(),
      text: loanItems[loanIndex].text,
      colorClass: colors[loanIndex % colors.length]
    };

    setActiveTrains(prev => [...prev, newTrain]);
    setLoanIndex(prev => (prev + 1) % loanItems.length);
  }, [loanIndex]);

  useEffect(() => {
    // Start the first train immediately
    createTrain(); 
    
    // Stagger subsequent trains
    const interval = setInterval(createTrain, 4000); // New train every 4 seconds
    return () => clearInterval(interval);
  }, []); // Note: createTrain is not in deps array to avoid resetting interval on index change

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
