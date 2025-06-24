"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import type { SetPageView } from '@/app/page';
import { NewsTicker } from '@/components/shared/NewsTicker';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

const governmentSchemes = [
  { 
    text: (
      <div>
        <p className="text-2xl font-medium">Pradhan Mantri Mudra Yojana (PMMY)</p>
        <p className="mt-1">प्रधानमंत्री मुद्रा योजना (PMMY)</p>
      </div>
    ), 
    className: "text-primary" 
  },
  { 
    text: (
      <div>
        <p className="text-2xl font-medium">Stand-Up India Scheme</p>
        <p className="mt-1">स्टैंड-अप इंडिया योजना</p>
      </div>
    ),
    className: "text-accent" 
  },
  { 
    text: (
      <div>
        <p className="text-2xl font-medium">Prime Minister’s Employment Generation Programme (PMEGP)</p>
        <p className="mt-1">प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)</p>
      </div>
    ), 
    className: "text-green-600 dark:text-green-400"
  },
  { 
    text: (
      <div>
        <p className="text-2xl font-medium">PM SVANidhi Scheme</p>
        <p className="mt-1">पीएम स्वनिधि योजना</p>
      </div>
    ), 
    className: "text-orange-600 dark:text-orange-400" 
  },
  { 
    text: (
      <div>
        <p className="text-2xl font-medium">PM Vishwakarma Scheme</p>
        <p className="mt-1">पीएम विश्वकर्मा योजना</p>
      </div>
    ), 
    className: "text-sky-600 dark:text-sky-400" 
  }
];

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-b from-[#F8FAE5] to-[#E4EFE7] px-4 overflow-hidden"
    >
      {/* Decorative SVGs */}
      <svg
        className="absolute -top-32 -left-32 w-[400px] h-[400px] opacity-20 pointer-events-none select-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <ellipse cx="200" cy="200" rx="200" ry="160" fill="#B2C8BA" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-[320px] h-[320px] opacity-10 pointer-events-none select-none"
        viewBox="0 0 320 320"
        fill="none"
      >
        <ellipse cx="160" cy="160" rx="160" ry="120" fill="#4E944F" />
      </svg>

      <div className="z-10 flex flex-col items-center justify-center text-center w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4" style={{ color: "#2D3A3A" }}>
          <span className="text-[#4E944F]">Quick & Easy</span> Financial Solutions
        </h1>
        <p className="text-lg mb-8" style={{ color: "#4E944F" }}>
          Empowering your dreams with transparent, technology-driven financial services.
        </p>

        <div
          className="mt-4 max-w-xl w-full cursor-pointer"
          onClick={() => setCurrentPage('governmentSchemes')}
          role="button"
          aria-label="Click to explore Government Scheme Loans"
        >
          <NewsTicker items={governmentSchemes} />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <Button
            size="lg"
            className="bg-[#4E944F] text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#F26A4B] hover:text-white hover:scale-105 transition"
            onClick={() => setCurrentPage('caServices')}
            aria-label="Services Offered by a Chartered Accountant (CA)"
          >
            Chartered Accountant Services
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-[#4E944F] text-[#4E944F] font-bold px-8 py-3 rounded-full hover:bg-[#F26A4B] hover:text-white hover:scale-105 transition"
            onClick={() => setCurrentPage('governmentSchemes')}
            aria-label="Explore Government Scheme Loans"
          >
            Government Scheme Loan
          </Button>
        </div>
      </div>
    </section>
  );
}
