import Link from 'next/link';

const AnimatedGradientText = () => (
  <span className="animated-gradient-text">RN Fintech</span>
);

export function Footer() {
  return (
<<<<<<< HEAD
    <footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F] shadow-[0_-4px_24px_0_rgba(76,175,80,0.07)] rounded-t-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#4E944F]/40">
          <div className="pb-8 md:pb-0 md:pr-8">
            <h3 className="text-xl font-bold text-[#FADA7A]"><AnimatedGradientText /></h3>
            <p className="mt-4 text-[#B2C8BA] text-sm">
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
        <div className="mt-12 border-t border-[#4E944F] pt-8 text-center">
          <p className="text-sm text-[#B2C8BA]">
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
