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
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="container mx-auto px-6 py-6 md:py-8">
<<<<<<< HEAD
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
=======
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-primary/40">
          <div className="pb-8 lg:pb-0 lg:pr-8">
>>>>>>> 510ce53 (ohh that great and also ive a thought that we can make our footer little)
=======
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:pr-6">
>>>>>>> 17ffd8d (its still taking the same space can u minimize the space  of footer it i)
            <div className="inline-block bg-background p-2 rounded-lg">
              <Logo />
=======
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary/40">
          <div className="p-6 md:p-8">
             <div className="inline-block bg-background p-2 rounded-lg">
                <Logo />
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
            </div>
>>>>>>> d8a7cb5 (ok there was some misunderstanding the logo was in logo.png ive fixed it)
            <p className="mt-4 text-muted-foreground text-sm">
>>>>>>> d36ee72 (ok ive created a public folder and uploaded an svg logo file  there can)
              Your trusted partner in achieving your financial goals.
            </p>
          </div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          <div className="pt-8 md:pt-0 md:px-8">
            <h4 className="font-semibold text-[#FADA7A]">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
=======
          <div className="pt-8 md:pt-0 md:px-8">
=======
          <div>
>>>>>>> 3b8ffa8 (ok this is great but for the mobile view also make it upto 2 columns bec)
=======
          <div className="p-6 md:p-8">
>>>>>>> fdd4cfe (ok great but the borders are touching the fields can u fix that)
            <h4 className="font-semibold text-highlight">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-background hover:text-accent transition-colors">
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
                  About Us
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href="#contact" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
=======
                <Link href="#contact" className="text-background hover:text-accent transition-colors">
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
                  Contact
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href="/privacy-policy" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
=======
                <Link href="/privacy-policy" className="text-background hover:text-accent transition-colors">
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
                  Privacy Policy
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href="/terms-of-service" className="text-[#F8FAE5] hover:text-[#F26A4B] transition-colors">
=======
                <Link href="/terms-of-service" className="text-background hover:text-accent transition-colors">
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
                  Terms of Service
                </Link>
              </li>
            </ul>
<<<<<<< HEAD
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
=======
          
          <div className="lg:px-6">
             <div className="grid grid-cols-2 gap-6">
                <div>
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
                 <div>
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
            </div>
=======
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
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
          <div className="p-6 md:p-8">
            <h4 className="font-semibold text-highlight">Connect With Us</h4>
>>>>>>> 510ce53 (ohh that great and also ive a thought that we can make our footer little)
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
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="mt-12 border-t border-[#4E944F] pt-8 text-center">
          <p className="text-sm text-[#B2C8BA]">
=======
        <div className="mt-8 md:mt-10 border-t border-primary pt-6 md:pt-8 text-center">
=======
        <div className="mt-6 border-t border-primary pt-6 text-center">
>>>>>>> 17ffd8d (its still taking the same space can u minimize the space  of footer it i)
=======
        <div className="mt-12 border-t border-primary pt-8 text-center">
>>>>>>> de8626a (<footer className="bg-[#2D3A3A] text-[#F8FAE5] border-t border-[#4E944F])
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
