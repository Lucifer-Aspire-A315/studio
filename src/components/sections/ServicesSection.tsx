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
    bgColorClass: 'bg-[#F8FAE5]', // light background
    textColorClass: 'text-[#4E944F]', // primary green
    targetPage: 'homeLoan' as const,
  },
  {
    icon: <User className="w-8 h-8" />,
    title: 'Personal Loan (व्यक्तिगत ऋण)',
    description: 'Shaadi, chuttiyan, ya kisi bhi zaroorat ke liye.',
    bgColorClass: 'bg-[#B2C8BA]', // sage
    textColorClass: 'text-[#2D3A3A]', // charcoal for contrast
    targetPage: 'personalLoan' as const,
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Business Loan (व्यापार ऋण)',
    description: 'Apne business ko nayi unchaiyon tak le jayein.',
    bgColorClass: 'bg-[#E4EFE7]', // minty
    textColorClass: 'text-[#4E944F]', // primary green
    targetPage: 'businessLoan' as const,
  },
  {
    icon: <CreditCardIcon className="w-8 h-8" />,
    title: 'Credit Card (क्रेडिट कार्ड)',
    description: 'Premium credit cards ke saath offers aur rewards ka laabh uthayein.',
    bgColorClass: 'bg-[#F26A4B]/10', // subtle coral tint
    textColorClass: 'text-[#F26A4B]', // accent coral
    targetPage: 'creditCard' as const,
  },
];

export function ServicesSection({ setCurrentPage }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Our Products & Services (हमारे उत्पाद और सेवाएं)</h2>
        <p className="mt-2 text-muted-foreground">Aapki har zaroorat ke liye hamari suvidhayein.</p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              bgColorClass={service.bgColorClass}
              textColorClass={service.textColorClass}
              targetPage={service.targetPage}
              setCurrentPage={setCurrentPage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
