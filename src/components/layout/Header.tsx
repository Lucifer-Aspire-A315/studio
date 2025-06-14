
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import type { PageView, SetPageView } from '@/app/page'; 

interface HeaderProps {
  setCurrentPage: SetPageView;
}

const AnimatedGradientText = () => (
  <span className="animated-gradient-text">RN Fintech</span>
);

export function Header({ setCurrentPage }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home', action: () => setCurrentPage('main') },
    { href: '#services', label: 'Services', action: () => setCurrentPage('main') },
    { href: '#calculator', label: 'Calculator', action: () => setCurrentPage('main') },
    { href: '#about', label: 'About Us', action: () => setCurrentPage('main') },
  ];

  const handleNavClick = (href: string, action?: () => void) => {
    if (action) action();
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      // Ensure 'main' page is active for hash links to work correctly from other pages
      if (href === '#home' || href === '#services' || href === '#calculator' || href === '#about') {
        setCurrentPage('main');
        // Delay scrolling to allow page context to switch if necessary
        setTimeout(() => {
          const element = document.getElementById(href.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 0);
      }
    }
  };
  
  const commonLinkClasses = "text-gray-600 hover:text-primary transition-colors";
  const mobileLinkClasses = "block py-3 px-6 text-sm hover:bg-secondary";

  return (
    <header className={`bg-background shadow-sm sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" onClick={() => handleNavClick('#home', () => setCurrentPage('main'))} className="text-2xl font-bold flex-shrink-0">
          <AnimatedGradientText />
        </Link>
        <div className="hidden md:flex items-center justify-center flex-grow space-x-3 lg:space-x-6">
          {navLinks.map(link => (
            <Button variant="link" key={link.label} onClick={() => handleNavClick(link.href, link.action)} className={commonLinkClasses + " px-2"}>
              {link.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center flex-shrink-0 space-x-2">
          <Button 
            variant="outline" 
            className="hidden md:inline-flex cta-button border-primary text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => setCurrentPage('partnerLoginOptions')}
          >
            PARTNER LOGIN
          </Button>
          <Button 
            className="hidden md:inline-flex cta-button bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => { /* Placeholder for main login, can be updated later */ setCurrentPage('main'); }}
          >
            LOGIN
          </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="p-6 border-b">
                <Link href="/" onClick={() => handleNavClick('#home', () => setCurrentPage('main'))} className="text-xl font-bold">
                  <AnimatedGradientText />
                </Link>
              </div>
              <nav className="flex flex-col py-2">
                {navLinks.map(link => (
                   <SheetClose asChild key={link.label}>
                    <button onClick={() => handleNavClick(link.href, link.action)} className={`${commonLinkClasses} ${mobileLinkClasses} text-left w-full`}>
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
                <div className="border-t my-2 mx-6"></div>
                 <SheetClose asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => {setCurrentPage('partnerLoginOptions'); setMobileMenuOpen(false);}} 
                    className={`${mobileLinkClasses} text-primary font-semibold text-left justify-start border-primary w-full`}
                  >
                    PARTNER LOGIN
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button 
                    onClick={() => { /* Placeholder */ setMobileMenuOpen(false); setCurrentPage('main'); }} 
                    className={`${mobileLinkClasses} bg-primary text-primary-foreground font-semibold text-left justify-start w-full`}
                  >
                    LOGIN
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
