import { ServiceCard } from '@/components/shared/ServiceCard';
import { Home, User, Briefcase, CreditCardIcon } from 'lucide-react'; 
import type { SetPageView } from '@/app/page';

interface ServicesSectionProps {
  setCurrentPage: SetPageView;
}

const services = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Home Loan (होम लोन)',
    description: 'Apne sapno ka ghar banayein hamare flexible home loan ke saath.',
    targetPage: 'homeLoan' as const,
    colorIndex: 1,
  },
  {
    icon: <User className="w-8 h-8" />,
    title: 'Personal Loan (व्यक्तिगत ऋण)',
    description: 'Shaadi, chuttiyan, ya kisi bhi zaroorat ke liye.',
    targetPage: 'personalLoan' as const,
    colorIndex: 2,
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Business Loan (व्यापार ऋण)',
    description: 'Apne business ko nayi unchaiyon tak le jayein.',
    targetPage: 'businessLoan' as const,
    colorIndex: 3,
  },
  {
    icon: <CreditCardIcon className="w-8 h-8" />,
    title: 'Credit Card (क्रेडिट कार्ड)',
    description: 'Premium credit cards ke saath offers aur rewards ka laabh uthayein.',
    targetPage: 'creditCard' as const,
    colorIndex: 4,
  },
];

export function ServicesSection({ setCurrentPage }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">Our Products & Services (हमारे उत्पाद और सेवाएं)</h2>
        <p className="mt-2 text-muted-foreground">Aapki har zaroorat ke liye hamari suvidhayein.</p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              colorIndex={service.colorIndex as 1 | 2 | 3 | 4 | 5}
              targetPage={service.targetPage}
              setCurrentPage={setCurrentPage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
