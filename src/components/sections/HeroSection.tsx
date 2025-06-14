
import { Button } from '@/components/ui/button';
import { NewsTicker } from '@/components/shared/NewsTicker';
import type { SetPageView } from '@/app/page';

interface HeroSectionProps {
  setCurrentPage: SetPageView;
}

export function HeroSection({ setCurrentPage }: HeroSectionProps) {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-bg py-20 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          <span className="text-primary">Quick & Easy</span> Financial Solutions
        </h1>
        
        <NewsTicker />

        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            size="lg" 
            className="cta-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 w-full sm:w-auto"
            onClick={scrollToServices} // Or navigate to a general apply page if preferred
            aria-label="Explore Our Loan Services"
          >
            Explore Loans
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="cta-button bg-background hover:bg-secondary text-primary font-bold py-3 px-8 border-primary/30 w-full sm:w-auto"
            onClick={scrollToServices}
            aria-label="Learn more about our services"
          >
            GOVERNMENT SME LOAN
          </Button>
        </div>
      </div>
    </section>
  );
}
