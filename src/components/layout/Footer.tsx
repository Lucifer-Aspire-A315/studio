import Link from 'next/link';

const AnimatedGradientText = () => (
  <span className="animated-gradient-text">RN Fintech</span>
);

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold"><AnimatedGradientText /></h3>
            <p className="mt-4 text-gray-400 text-sm">Your trusted partner in achieving your financial goals.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Our Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#services" className="text-gray-400 hover:text-white transition-colors">Home Loan</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-white transition-colors">Personal Loan</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-white transition-colors">Business Loan</Link></li>
              <li><Link href="#services" className="text-gray-400 hover:text-white transition-colors">Credit Card</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Connect With Us</h4>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <p className="text-gray-400">Sunrise Apartment, A-101, Santoshi Mata Rd, near Yashoda Apartment, near KDMC Commissioners Bunglow, Syndicate, Kalyan, Maharashtra 421301</p>
              <p><a href="mailto:contact@rnfintech.com" className="text-gray-400 hover:text-white transition-colors">contact@rnfintech.com</a></p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} RN Fintech. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
