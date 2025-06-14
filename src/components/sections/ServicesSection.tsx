import { ServiceCard } from '@/components/shared/ServiceCard';
import { Home, User, Briefcase, CreditCardIcon } from 'lucide-react';
import type { SetPageView } from '@/app/page';

interface ServicesSectionProps {
  setCurrentPage: SetPageView;
}

const services = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Home Loan',
    description: 'Apne sapno ka ghar banayein hamare flexible home loan ke saath.',
    bgColorClass: 'bg-blue-100 dark:bg-blue-900',
    textColorClass: 'text-blue-700 dark:text-blue-300',
    targetPage: 'homeLoan' as const,
  },
  {
    icon: <User className="w-8 h-8" />,
    title: 'Personal Loan',
    description: 'Shaadi, chuttiyan, ya kisi bhi zaroorat ke liye.',
    bgColorClass: 'bg-purple-100 dark:bg-purple-900',
    textColorClass: 'text-purple-700 dark:text-purple-300',
    targetPage: 'personalLoan' as const,
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Business Loan',
    description: 'Apne business ko nayi unchaiyon tak le jayein.',
    bgColorClass: 'bg-red-100 dark:bg-red-900',
    textColorClass: 'text-red-700 dark:text-red-300',
    targetPage: 'businessLoan' as const,
  },
  {
    icon: <CreditCardIcon className="w-8 h-8" />,
    title: 'Credit Card',
    description: 'Premium credit cards ke saath offers aur rewards ka laabh uthayein.',
    bgColorClass: 'bg-orange-100 dark:bg-orange-900',
    textColorClass: 'text-orange-700 dark:text-orange-300',
    targetPage: 'creditCard' as const,
  },
];

export function ServicesSection({ setCurrentPage }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Our Products & Services</h2>
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
