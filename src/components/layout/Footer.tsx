
import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
    <div className="relative w-40 h-10">
        <Image
            src="/logo.png"
            alt="RN Fintech Logo"
            fill
            priority
            className="object-contain"
        />
    </div>
);

export function Footer() {
  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F] shadow-[0_-4px_24px_0_rgba(76,175,80,0.07)] rounded-t-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#4E944F]/40">
=======
    <footer className="bg-foreground text-background border-t border-primary shadow-[0_-4px_24px_0_rgba(76,175,80,0.07)] rounded-t-2xl">
      <div className="container mx-auto px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary/40">
>>>>>>> d4ecd83 (can u review and fix the responsiveness of the website like there are so)
          <div className="pb-8 md:pb-0 md:pr-8">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <h3 className="text-xl font-bold text-[#FADA7A]"><AnimatedGradientText /></h3>
            <p className="mt-4 text-[#B2C8BA] text-sm">
=======
            <h3 className="text-xl font-bold text-highlight"><Logo /></h3>
=======
            <div className="block"><Logo /></div>
>>>>>>> 1a79126 (ok so now the logo is place can u now just correct the size and style of)
=======
            <div className="inline-block bg-background p-2 rounded-lg">
              <Logo />
            </div>
>>>>>>> d8a7cb5 (ok there was some misunderstanding the logo was in logo.png ive fixed it)
            <p className="mt-4 text-muted-foreground text-sm">
>>>>>>> d36ee72 (ok ive created a public folder and uploaded an svg logo file  there can)
              Your trusted partner in achieving your financial goals.
            </p>
          </div>
          <div className="pt-8 md:pt-0 md:px-8">
            <h4 className="font-semibold text-[#FADA7A]">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="pt-8 md:pt-0 md:px-8">
            <h4 className="font-semibold text-[#FADA7A]">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#services" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Home Loan
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Personal Loan
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Business Loan
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  Credit Card
                </Link>
              </li>
            </ul>
          </div>
          <div className="pt-8 md:pt-0 md:pl-8">
            <h4 className="font-semibold text-[#FADA7A]">Connect With Us</h4>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <p className="text-[#B2C8BA]">
                Sunrise Apartment, A-101, Santoshi Mata Rd, near Yashoda Apartment, near KDMC Commissioners Bunglow, Syndicate, Kalyan, Maharashtra 421301
              </p>
              <p>
                <a href="mailto:contact@rnfintech.com" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
                  contact@rnfintech.com
                </a>
              </p>
            </address>
          </div>
        </div>
<<<<<<< HEAD
        <div className="mt-12 border-t border-[#4E944F] pt-8 text-center">
          <p className="text-sm text-[#B2C8BA]">
=======
        <div className="mt-8 md:mt-10 border-t border-primary pt-6 md:pt-8 text-center">
          <p className="text-sm text-muted-foreground">
>>>>>>> b09805a (sorry i mean the footer it is too long can u narrow it)
            &copy; {new Date().getFullYear()} RN Fintech. All Rights Reserved.
          </p>
=======
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-foreground"><AnimatedGradientText /></h3>
            <p className="mt-4 text-sm">Your trusted partner in achieving your financial goals.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#services" className="hover:text-primary transition-colors">Home Loan</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Personal Loan</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Business Loan</Link></li>
              <li><Link href="#services" className="hover:text-primary transition-colors">Credit Card</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Connect With Us</h4>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <p>Sunrise Apartment, A-101, Santoshi Mata Rd, near Yashoda Apartment, near KDMC Commissioners Bunglow, Syndicate, Kalyan, Maharashtra 421301</p>
              <p><a href="mailto:contact@rnfintech.com" className="hover:text-primary transition-colors">contact@rnfintech.com</a></p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} RN Fintech. All Rights Reserved.</p>
>>>>>>> ca4bd91 (ok but can u analyze and review everything to see if all styling ui colo)
        </div>
      </div>
    </footer>
  );
}
