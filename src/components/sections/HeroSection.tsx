
"use client";

import React from 'react';
import type { SetPageView } from '@/app/page';
import { NewsTicker } from '@/components/shared/NewsTicker';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

const governmentSchemes = [
  { 
    text: (
      <div>
        <p className="font-medium">Pradhan Mantri Mudra Yojana (PMMY)</p>
        <p className="mt-1">प्रधानमंत्री मुद्रा योजना (PMMY)</p>
      </div>
    ), 
    className: "text-primary" 
  },
  { 
    text: (
      <div>
        <p className="font-medium">Stand-Up India Scheme</p>
        <p className="mt-1">स्टैंड-अप इंडिया योजना</p>
      </div>
    ),
    className: "text-accent" 
  },
  { 
    text: (
      <div>
        <p className="font-medium">Prime Minister’s Employment Generation Programme (PMEGP)</p>
        <p className="mt-1">प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)</p>
      </div>
    ), 
    className: "text-green-600 dark:text-green-400"
  },
  { 
    text: (
      <div>
        <p className="font-medium">PM SVANidhi Scheme</p>
        <p className="mt-1">पीएम स्वनिधि योजना</p>
      </div>
    ), 
    className: "text-orange-600 dark:text-orange-400" 
  },
  { 
    text: (
      <div>
        <p className="font-medium">PM Vishwakarma Scheme</p>
        <p className="mt-1">पीएम विश्वकर्मा योजना</p>
      </div>
    ), 
    className: "text-sky-600 dark:text-sky-400" 
  }
];

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  return (
<<<<<<< HEAD
    <section
      id="home"
<<<<<<< HEAD
      className="relative min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-b from-[#F8FAE5] to-[#E4EFE7] px-4 overflow-hidden"
=======
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-secondary/30 px-4 py-16 overflow-hidden"
>>>>>>> 9af06bf (ok so in the header section can u see something like ads or something wh)
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
<<<<<<< HEAD
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4" style={{ color: "#2D3A3A" }}>
          <span className="text-[#4E944F]">Quick & Easy</span> Financial Solutions
=======
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-foreground responsive-text-4xl-6xl">
          <span className="text-primary">Quick & Easy</span> Financial Solutions
>>>>>>> 9af06bf (ok so in the header section can u see something like ads or something wh)
        </h1>
        <p className="text-lg mb-8" style={{ color: "#4E944F" }}>
          Empowering your dreams with transparent, technology-driven financial services.
        </p>

        <div
          className="mt-8 max-w-2xl w-full"
        >
          <div
            onClick={() => setCurrentPage('governmentSchemes')}
            role="button"
            aria-label="Click to explore Government Scheme Loans"
            className="group cursor-pointer rounded-xl border border-border bg-card p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Featured Government Schemes</h3>
            </div>
            <NewsTicker items={governmentSchemes} className="text-lg sm:text-xl font-medium" />
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <Button
            size="lg"
<<<<<<< HEAD
            className="bg-[#4E944F] text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#F26A4B] hover:text-white hover:scale-105 transition"
=======
            className="w-full sm:w-auto cta-button bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full shadow-md hover:bg-accent hover:text-accent-foreground hover:scale-105 transition"
>>>>>>> d4ecd83 (can u review and fix the responsiveness of the website like there are so)
            onClick={() => setCurrentPage('caServices')}
=======
    <section id="home" className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
          Aapke Sapno Ka Loan, Ab <span className="animated-gradient-text">Aapke Saath</span>
        </h1>

        <div
          className="mt-8 max-w-xl mx-auto cursor-pointer"
          onClick={() => setCurrentPage('governmentSchemes')}
          role="button"
          aria-label="Click to explore Government Scheme Loans"
        >
          <NewsTicker items={governmentSchemes} />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            size="lg" 
            className="cta-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 w-full sm:w-auto"
            onClick={() => setCurrentPage('caServices')} 
>>>>>>> 287e1e1 (ok remove the last update)
            aria-label="Services Offered by a Chartered Accountant (CA)"
          >
            Chartered Accountant Services
          </Button>
<<<<<<< HEAD
          <Button
            variant="outline"
            size="lg"
<<<<<<< HEAD
            className="border-[#4E944F] text-[#4E944F] font-bold px-8 py-3 rounded-full hover:bg-[#F26A4B] hover:text-white hover:scale-105 transition"
=======
            className="w-full sm:w-auto cta-button border-primary text-primary font-bold px-8 py-3 rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent hover:scale-105 transition"
>>>>>>> d4ecd83 (can u review and fix the responsiveness of the website like there are so)
            onClick={() => setCurrentPage('governmentSchemes')}
=======
          <Button 
            variant="outline" 
            size="lg" 
            className="cta-button bg-card hover:bg-secondary text-primary font-bold py-3 px-8 border-primary/30 w-full sm:w-auto"
            onClick={() => setCurrentPage('governmentSchemes')} 
>>>>>>> 287e1e1 (ok remove the last update)
            aria-label="Explore Government Scheme Loans"
          >
            Government Scheme Loan
          </Button>
        </div>
      </div>
    </section>
  );
}
