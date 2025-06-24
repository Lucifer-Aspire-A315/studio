import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { SetPageView, PageView } from '@/app/page';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorIndex: 1 | 2 | 3 | 4 | 5;
  targetPage: PageView;
  setCurrentPage: SetPageView;
}

<<<<<<< HEAD
export function ServiceCard({
  icon,
  title,
  description,
  bgColorClass,
  textColorClass,
  targetPage,
  setCurrentPage,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "bg-card p-8 rounded-xl shadow-lg flex flex-col text-center items-center border border-[#B2C8BA] transition-all duration-200 hover:border-[#4E944F] hover:shadow-xl card-hover-effect"
      )}
    >
      <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow ${bgColorClass}`}>
        <div className={textColorClass}>{icon}</div>
=======
const bgColors: Record<ServiceCardProps['colorIndex'], string> = {
    1: 'bg-chart-1/10',
    2: 'bg-chart-2/10',
    3: 'bg-chart-3/10',
    4: 'bg-chart-4/10',
    5: 'bg-chart-5/10',
};

const textColors: Record<ServiceCardProps['colorIndex'], string> = {
    1: 'text-chart-1',
    2: 'text-chart-2',
    3: 'text-chart-3',
    4: 'text-chart-4',
    5: 'text-chart-5',
};

export function ServiceCard({ icon, title, description, colorIndex, targetPage, setCurrentPage }: ServiceCardProps) {
  return (
    <div className={cn(
        "bg-card p-8 rounded-xl shadow-lg flex flex-col text-center items-center card-hover-effect"
    )}>
      <div className={cn('rounded-full w-16 h-16 flex items-center justify-center mx-auto', bgColors[colorIndex])}>
        <div className={cn(textColors[colorIndex])}>{icon}</div>
>>>>>>> ca4bd91 (ok but can u analyze and review everything to see if all styling ui colo)
      </div>
      <h3 className="text-xl font-semibold mt-6 text-[#4E944F]">{title}</h3>
      <p className="text-muted-foreground mt-2 flex-grow text-sm">{description}</p>
      <Button
        variant="link"
        className="inline-flex items-center justify-center mt-6 font-semibold text-[#F26A4B] hover:text-[#4E944F] group p-0"
        onClick={() => setCurrentPage(targetPage)}
        aria-label={`Apply for ${title}`}
      >
        Apply Now
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
