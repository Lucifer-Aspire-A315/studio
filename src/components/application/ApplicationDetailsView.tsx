'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ApplicationDetailsViewProps {
  applicationData: any;
  title: string;
  subtitle: string;
}

// Helper to format keys for display (e.g., 'fullName' -> 'Full Name')
const formatKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // insert a space before all caps
    .replace(/^./, (str) => str.toUpperCase()); // uppercase the first character
};

// Helper to render different value types
const renderValue = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:'))) {
    const isFileLink = value.includes('firebasestorage.googleapis.com');
    const fileName = isFileLink ? decodeURIComponent(value.split('/').pop()?.split('?')[0] ?? 'Download').split('-').slice(1).join('-') : 'View Document';
    return (
      <Link
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      >
        {fileName || "View Uploaded File"}
      </Link>
    );
  }
  // Use a more reliable regex to detect ISO date strings
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try {
          return format(new Date(value), 'PPp'); // Format as date if it looks like one
      } catch {
          return value; // Fallback to string if formatting fails
      }
  }
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">N/A</span>;
  }
  return String(value);
};

// Recursive component to render nested objects and values
const DetailItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: any }) => {
  if (typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue)) {
    return (
      <div className="col-span-1 md:col-span-2">
        <h4 className="text-md font-semibold text-foreground mt-4 mb-2 border-b pb-1">{formatKey(itemKey)}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
          {Object.entries(itemValue).map(([key, value]) => (
            <DetailItem key={key} itemKey={key} itemValue={value} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <dt className="text-sm font-medium text-muted-foreground">{formatKey(itemKey)}</dt>
      <dd className="mt-1 text-sm text-foreground break-words">{renderValue(itemValue)}</dd>
    </div>
  );
};


export function ApplicationDetailsView({ applicationData, title, subtitle }: ApplicationDetailsViewProps) {
    const router = useRouter();

    if (!applicationData) {
        return (
             <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Application Not Found</CardTitle>
                    <CardDescription>The requested application could not be found or you don't have permission to view it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        );
    }
  
  // Destructure to control rendering order and hide certain fields
  const {
      createdAt,
      updatedAt, // This will be ignored
      submittedBy,
      ...restOfData
  } = applicationData;
  
  // Flatten top-level simple properties and group nested objects
  const topLevelDetails: [string, any][] = [];
  const formSections: [string, any][] = [];

  // Manually add 'Submitted On' to the top of the details
  if (createdAt) {
      topLevelDetails.push(['Submitted On', createdAt]);
  }
  
  Object.entries(restOfData).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          formSections.push([key, value]);
      } else {
          topLevelDetails.push([key, value]);
      }
  });

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
         <Button onClick={() => router.back()} variant="ghost" className="self-start -ml-4 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {topLevelDetails.map(([key, value]) => (
                <DetailItem key={key} itemKey={key} itemValue={value} />
            ))}
        </dl>
        
        {formSections.map(([sectionKey, sectionValue]) => (
            <div key={sectionKey}>
                <Separator className="my-4" />
                <DetailItem itemKey={sectionKey} itemValue={sectionValue} />
            </div>
        ))}
        
        {submittedBy && (
            <div key="submittedBySection">
                <Separator className="my-4" />
                <DetailItem itemKey="Submitted By" itemValue={submittedBy} />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
