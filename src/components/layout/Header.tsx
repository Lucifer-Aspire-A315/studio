
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, LogOut, Loader2, LayoutDashboard, ShieldCheck } from 'lucide-react'; 
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext'; 

interface HeaderProps {
  setCurrentPage?: SetPageView;
}

const AnimatedGradientText = () => (
  <span className="animated-gradient-text">RN Fintech</span>
);

export function Header({ setCurrentPage }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, logout, isLoading } = useAuth(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', action: () => setCurrentPage?.('main') },
    { href: '/#services', label: 'Services', action: () => setCurrentPage?.('main') },
    { href: '/#calculator', label: 'Calculator', action: () => setCurrentPage?.('main') },
    { href: '/#about', label: 'About Us', action: () => setCurrentPage?.('main') },
  ];

  const handleNavClick = (href: string, action?: () => void) => {
    if (action) action();
    setMobileMenuOpen(false);
    
    if (href.startsWith('/#')) {
        if (router.pathname === '/') {
            const elementId = href.substring(2);
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(href);
        }
    } else {
        router.push(href);
    }
  };


  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout(); 
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const commonLinkClasses = "text-gray-600 hover:text-primary transition-colors";
  const mobileLinkClasses = "block py-3 px-6 text-sm hover:bg-secondary";

  return (
    <header className={`bg-background shadow-sm sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" onClick={() => handleNavClick('/', () => setCurrentPage?.('main'))} className="text-2xl font-bold flex-shrink-0">
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
          {isLoading ? (
             <Button variant="ghost" size="icon" disabled><Loader2 className="w-5 h-5 animate-spin" /></Button>
          ) : currentUser ? (
            <>
              {currentUser.isAdmin && (
                <Button asChild className="cta-button bg-destructive/10 text-destructive hover:bg-destructive/20" variant="ghost">
                  <Link href="/admin/dashboard">
                    <ShieldCheck className="mr-2 h-4 w-4"/>
                    Admin
                  </Link>
                </Button>
              )}
              <Button asChild className="cta-button" variant="ghost">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4"/>
                  Dashboard
                </Link>
              </Button>
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
                onClick={() => router.push('/login')}
              >
                LOGIN
              </Button>
            </>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation and user options</SheetDescription>
              <div className="p-6 border-b">
                <Link href="/" onClick={() => handleNavClick('/', () => setCurrentPage?.('main'))} className="text-xl font-bold">
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
                {isLoading ? (
                  <div className="px-6 py-3 text-center"><Loader2 className="w-5 h-5 animate-spin inline-block" /></div>
                ) : currentUser ? (
                   <div className="px-6 py-3 space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">Welcome, {currentUser.fullName}!</p>
                      {currentUser.isAdmin && (
                        <SheetClose asChild>
                          <Button asChild variant="destructive" className="w-full justify-start">
                            <Link href="/admin/dashboard">
                              <ShieldCheck className="mr-2 h-4 w-4"/>
                              Admin Panel
                            </Link>
                          </Button>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                         <Button asChild variant="default" className="w-full justify-start">
                          <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4"/>
                            Dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                          <Button 
                              variant="outline" 
                              onClick={handleLogout} 
                              className={`${mobileLinkClasses} text-destructive font-semibold text-left justify-start border-destructive w-full`}
                          >
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                          </Button>
                      </SheetClose>
                   </div>
                ) : (
                  <div className="px-6 py-3 space-y-2">
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
                        onClick={() => { router.push('/login'); setMobileMenuOpen(false); }} 
                        className={`${mobileLinkClasses} bg-primary text-primary-foreground font-semibold text-left justify-start w-full`}
                      >
                        LOGIN
                      </Button>
                    </SheetClose>
                     <SheetClose asChild>
                      <Button 
                        variant="link"
                        onClick={() => { router.push('/signup'); setMobileMenuOpen(false); }} 
                        className={`${mobileLinkClasses} text-accent font-semibold text-left justify-start w-full`}
                      >
                        CREATE ACCOUNT
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
