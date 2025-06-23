'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateApplicationStatus } from '@/app/actions/adminActions';
import { useToast } from '@/hooks/use-toast';
import type { UserApplication } from '@/lib/types';

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
        className="text-primary hover:underline font-medium break-all"
      >
        {fileName || "View Uploaded File"}
      </Link>
    );
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try {
          return format(new Date(value), 'PPp');
      } catch {
          return value;
      }
  }
  if (value && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
    try {
      const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
      return format(date, 'PPp');
    } catch {
      return 'Invalid Date';
    }
  }

  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">N/A</span>;
  }
  return String(value);
};

// Recursive component to render nested objects and values
const DetailItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: any }) => {
  if (typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue) && 'seconds' in itemValue && 'nanoseconds' in itemValue) {
     return (
        <div className="flex flex-col">
            <dt className="text-sm font-medium text-muted-foreground">{formatKey(itemKey)}</dt>
            <dd className="mt-1 text-sm text-foreground break-words">{renderValue(itemValue)}</dd>
        </div>
    );
  }

  if (typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue)) {
    return (
      <div className="col-span-1 md:col-span-2">
        <h4 className="text-md font-semibold text-foreground mt-4 mb-2 border-b pb-1">{formatKey(itemKey)}</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-4">
          {Object.entries(itemValue)
            .filter(([key, value]) => key !== 'userId' || (value !== null && value !== undefined))
            .map(([key, value]) => (
            <DetailItem key={key} itemKey={key} itemValue={value} />
          ))}
        </dl>
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

const availableStatuses = ['Submitted', 'In Review', 'Approved', 'Rejected'];

export function ApplicationDetailsView({ applicationId, applicationData, title, subtitle, isAdmin = false }: ApplicationDetailsViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [currentStatus, setCurrentStatus] = useState<string>(applicationData?.status || '');
    const [selectedStatus, setSelectedStatus] = useState<string>(applicationData?.status || '');

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

    const handleUpdateStatus = () => {
        if (!selectedStatus || selectedStatus === currentStatus) return;

        startTransition(async () => {
            const result = await updateApplicationStatus(
                applicationId, 
                applicationData.serviceCategory as UserApplication['serviceCategory'], 
                selectedStatus
            );
            if (result.success) {
                toast({
                    title: "Status Updated",
                    description: result.message,
                });
                setCurrentStatus(selectedStatus);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: result.message,
                });
            }
        });
    };

  const {
      createdAt,
      updatedAt,
      submittedBy,
      ...restOfData
  } = applicationData;
  
  const topLevelDetails: [string, any][] = [];
  const formSections: [string, any][] = [];

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
        
        {isAdmin && (
            <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-foreground mb-3">Admin Actions</h4>
                <div className="flex items-center space-x-4">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleUpdateStatus} disabled={isPending || selectedStatus === currentStatus}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Status
                    </Button>
                </div>
            </div>
        )}

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
        
        <div key="metaDataSection">
            <Separator className="my-4" />
             <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {submittedBy && (
                   <DetailItem itemKey="Submitted By" itemValue={submittedBy} />
                )}
                {createdAt && (
                    <DetailItem itemKey="Submitted On" itemValue={createdAt} />
                )}
             </dl>
        </div>
      </CardContent>
    </Card>
  );
}
