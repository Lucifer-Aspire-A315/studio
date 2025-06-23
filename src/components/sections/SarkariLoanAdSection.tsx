"use client";

import Image from 'next/image';
import type { SetPageView } from '@/app/page';
import { Button } from '@/components/ui/button';

interface SarkariLoanAdSectionProps {
  setCurrentPage: SetPageView;
}

export function SarkariLoanAdSection({ setCurrentPage }: SarkariLoanAdSectionProps) {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row max-w-2xl mx-auto bg-primary/10 border border-primary/20 rounded-lg overflow-hidden shadow-lg">
          <div className="md:w-2/5 w-full">
            <Image
              src="https://placehold.co/400x500.png"
              alt="Sarkari Loan Ad"
              width={400}
              height={500}
              className="object-cover w-full h-full"
              data-ai-hint="government finance"
            />
          </div>
          <div className="md:w-3/5 w-full p-6 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-primary">
              सरकारी लोन सुविधा
            </h3>
            <p className="mt-2 mb-6 text-foreground/80 leading-relaxed">
              अपने व्यवसाय, शिक्षा या घर के सपने को साकार करें। सरकार की विभिन्न योजनाओं के तहत आसानी से लोन प्राप्त करें।
            </p>
            <Button
              onClick={() => setCurrentPage('governmentSchemes')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold self-start"
            >
              अधिक जानें
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
