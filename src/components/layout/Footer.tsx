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
    <footer className="bg-foreground text-background border-t border-primary shadow-[0_-4px_24px_0_rgba(76,175,80,0.07)] rounded-t-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary/40">
          <div className="p-6 md:p-8 col-span-2 md:col-span-1">
             <div className="inline-block bg-background p-2 rounded-lg">
                <Logo />
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              Your trusted partner in achieving your financial goals.
            </p>
          </div>
          <div className="p-6 md:p-8">
            <h4 className="font-semibold text-highlight">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-background hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-background hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-background hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-background hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="p-6 md:p-8">
            <h4 className="font-semibold text-highlight">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#services" className="text-background hover:text-accent transition-colors">
                  Home Loan
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-background hover:text-accent transition-colors">
                  Personal Loan
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-background hover:text-accent transition-colors">
                  Business Loan
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-background hover:text-accent transition-colors">
                  Credit Card
                </Link>
              </li>
            </ul>
          </div>
          <div className="p-6 md:p-8 col-span-2 md:col-span-1">
            <h4 className="font-semibold text-highlight">Connect With Us</h4>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <p className="text-muted">
                Sunrise Apartment, A-101, Santoshi Mata Rd, near Yashoda Apartment, near KDMC Commissioners Bunglow, Syndicate, Kalyan, Maharashtra 421301
              </p>
              <p>
                <a href="mailto:contact@rnfintech.com" className="text-background hover:text-accent transition-colors">
                  contact@rnfintech.com
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-primary pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RN Fintech. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
