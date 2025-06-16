
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import type { PageView, SetPageView, UserData, SetCurrentUser } from '@/app/page';
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  setCurrentPage: SetPageView;
  currentUser: UserData | null;
  setCurrentUser: SetCurrentUser;
  logoutAction: () => Promise<{ success: boolean, message?: string, errors?: any }>;
}

const AnimatedGradientText = () => (
  <span className="animated-gradient-text">RN Fintech</span>
);

export function Header({ setCurrentPage, currentUser, setCurrentUser, logoutAction }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
    if (href.startsWith('/')) {
      router.push(href);
    } else if (href.startsWith('#')) {
      if (href === '#home' || href === '#services' || href === '#calculator' || href === '#about') {
        // Ensure main page context is set if not already on it AND not already trying to scroll on main
        if (router.pathname !== '/' && (window.location.pathname !== '/' || window.location.hash !== href)) {
            setCurrentPage('main'); // This might cause a slight delay if not handled well with Next router
            router.push('/' + href); // Navigate to home and then scroll
        } else {
             // If already on main page, just scroll
            const element = document.getElementById(href.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
      }
    }
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    const result = await logoutAction();
    if (result.success) {
      setCurrentUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/'); // Redirect to home after logout
    } else {
      toast({ variant: "destructive", title: "Logout Failed", description: result.message || "Could not log out." });
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
          {currentUser ? (
            <>
              <span className="hidden md:inline-flex text-sm text-muted-foreground">Welcome, {currentUser.fullName}!</span>
              <Button 
                variant="outline" 
                className="cta-button border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="hidden md:inline-flex cta-button border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => router.push('/partner-login')}
              >
                PARTNER LOGIN
              </Button>
              <Button 
                className="hidden md:inline-flex cta-button bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => { /* Placeholder for main user login */ toast({title: "Login coming soon"}); }}
              >
                LOGIN
              </Button>
            </>
          )}
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
                {currentUser ? (
                  <SheetClose asChild>
                     <div className="px-6 py-3">
                        <p className="text-sm text-muted-foreground mb-2">Welcome, {currentUser.fullName}!</p>
                        <Button 
                            variant="outline" 
                            onClick={handleLogout} 
                            className={`${mobileLinkClasses} text-destructive font-semibold text-left justify-start border-destructive w-full`}
                        >
                           <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                     </div>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => {router.push('/partner-login'); setMobileMenuOpen(false);}} 
                        className={`${mobileLinkClasses} text-primary font-semibold text-left justify-start border-primary w-full`}
                      >
                        PARTNER LOGIN
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button 
                        onClick={() => { /* Placeholder */ toast({title: "Login coming soon"}); setMobileMenuOpen(false); }} 
                        className={`${mobileLinkClasses} bg-primary text-primary-foreground font-semibold text-left justify-start w-full`}
                      >
                        LOGIN
                      </Button>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

    