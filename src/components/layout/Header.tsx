"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, LogOut, Loader2, LayoutDashboard, ShieldCheck, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { PageView, SetPageView } from '@/app/page';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface HeaderProps {
  setCurrentPage?: SetPageView;
}

const Logo = () => (
    <div className="relative w-36 h-10 md:w-40">
        <Image
            src="/logo.svg"
            alt="RN Fintech Logo"
            fill
            priority
            className="object-contain"
        />
    </div>
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
        const path = router.pathname || window.location.pathname;
        if (path === '/') {
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
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

<<<<<<< HEAD
  const commonLinkClasses = "text-[#4E944F] hover:text-[#F26A4B] transition-colors font-semibold";
  const mobileLinkClasses = "block py-3 px-6 text-sm hover:bg-[#B2C8BA]/40";
=======
  const commonLinkClasses = "text-primary hover:text-accent transition-colors font-semibold";
  const mobileLinkClasses = "block py-3 px-4 text-sm hover:bg-secondary/40";
>>>>>>> d4ecd83 (can u review and fix the responsiveness of the website like there are so)

  return (
<<<<<<< HEAD
    <header className={`bg-[#F8FAE5] border-b border-[#B2C8BA] shadow-sm sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link href="/" onClick={() => handleNavClick('/', () => setCurrentPage?.('main'))} className="text-2xl font-bold flex-shrink-0 text-[#4E944F]">
=======
    <header className={`bg-background border-b border-border shadow-sm sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <nav className="container mx-auto px-4 sm:px-6 py-2 flex justify-between items-center">
<<<<<<< HEAD
        <Link href="/" onClick={() => handleNavClick('/', () => setCurrentPage?.('main'))} className="text-2xl font-bold flex-shrink-0 text-primary">
<<<<<<< HEAD
>>>>>>> c3cf252 (great and also the header looks too long in mobile view can u narrow it)
          <AnimatedGradientText />
=======
=======
        <Link href="/" onClick={() => handleNavClick('/', () => setCurrentPage?.('main'))} className="flex-shrink-0">
>>>>>>> 1a79126 (ok so now the logo is place can u now just correct the size and style of)
          <Logo />
>>>>>>> d36ee72 (ok ive created a public folder and uploaded an svg logo file  there can)
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
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.fullName}`} alt={currentUser.fullName} />
                      <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {currentUser.isAdmin && (
                       <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="hidden md:inline-flex cta-button border-[#4E944F] text-[#4E944F] hover:bg-[#F26A4B]/10 hover:text-[#F26A4B]"
                onClick={() => router.push('/partner-login')}
              >
                PARTNER LOGIN
              </Button>
              <Button
                className="hidden md:inline-flex cta-button bg-[#4E944F] hover:bg-[#F26A4B] text-white"
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
                <Link href="/" onClick={() => handleNavClick('/', () => setCurrentPage?.('main'))}>
                  <Logo />
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
                  <div className="px-4 py-3 text-center"><Loader2 className="w-5 h-5 animate-spin inline-block" /></div>
                ) : currentUser ? (
                   <div className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">Welcome, {currentUser.fullName}!</p>
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
                         <Button asChild variant="outline" className="w-full justify-start">
                          <Link href="/profile">
                            <UserIcon className="mr-2 h-4 w-4"/>
                            Profile
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                          <Button
                              variant="destructive"
                              onClick={handleLogout}
                              className="w-full justify-start px-3"
                          >
                            <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span>
                          </Button>
                      </SheetClose>
                   </div>
                ) : (
                  <div className="px-4 py-3 space-y-2">
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
