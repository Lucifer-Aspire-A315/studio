import React from 'react';
import { Separator } from '@/components/ui/separator';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormSection({ title, subtitle, children }: FormSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>}
      <Separator className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}
export function FormFieldWrapper({ children, className }: FormFieldProps) {
    return <div className={className}>{children}</div>
}
