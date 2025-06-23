import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { SetPageView, PageView } from '@/app/page';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColorClass: string;
  textColorClass: string;
  targetPage: PageView;
  setCurrentPage: SetPageView;
}

export function ServiceCard({ icon, title, description, bgColorClass, textColorClass, targetPage, setCurrentPage }: ServiceCardProps) {
  return (
    <div className={cn(
        "bg-card p-8 rounded-xl shadow-lg flex flex-col text-center items-center card-hover-effect"
    )}>
      <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto ${bgColorClass}`}>
        <div className={textColorClass}>{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-card-foreground mt-6">{title}</h3>
      <p className="text-muted-foreground mt-2 flex-grow text-sm">{description}</p>
      <Button 
        variant="link" 
        className="inline-flex items-center justify-center mt-6 font-semibold text-primary hover:text-primary/80 group p-0"
        onClick={() => setCurrentPage(targetPage)}
        aria-label={`Apply for ${title}`}
      >
        Apply Now
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
