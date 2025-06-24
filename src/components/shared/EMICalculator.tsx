
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("500000");
  const [interestRate, setInterestRate] = useState<string>("10.5");
  const [loanTenure, setLoanTenure] = useState<string>("5");
  const [emi, setEmi] = useState<string>("0.00");

  const calculateEMI = useCallback(() => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTenure) * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(emiValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      setEmi("0.00");
    }
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="amount" className="block text-sm font-medium text-foreground">Loan Amount (₹)</Label>
        <Input 
          type="number" 
          id="amount" 
          value={loanAmount} 
          onChange={(e) => setLoanAmount(e.target.value)}
          className="mt-1 block w-full text-lg"
          placeholder="e.g., 500000"
        />
      </div>
      <div>
        <Label htmlFor="interest" className="block text-sm font-medium text-foreground">Interest Rate (%)</Label>
        <Input 
          type="number" 
          id="interest" 
          value={interestRate} 
          onChange={(e) => setInterestRate(e.target.value)}
          step="0.1"
          className="mt-1 block w-full text-lg"
          placeholder="e.g., 10.5"
        />
      </div>
      <div>
        <Label htmlFor="tenure" className="block text-sm font-medium text-foreground">Loan Tenure (Years)</Label>
        <Input 
          type="number" 
          id="tenure" 
          value={loanTenure} 
          onChange={(e) => setLoanTenure(e.target.value)}
          className="mt-1 block w-full text-lg"
          placeholder="e.g., 5"
        />
      </div>
      <div id="emi-result" className="mt-8 text-center bg-primary/10 p-6 rounded-lg">
        <p className="text-muted-foreground">Your Monthly EMI</p>
        <p id="emi-value" className="text-4xl font-bold text-primary mt-2">₹ {emi}</p>
      </div>
    </div>
  );
}
