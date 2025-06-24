
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationsTable } from './ApplicationsTable';
import type { UserApplication, UserData } from '@/lib/types';
import { PartnerDashboard } from './PartnerDashboard';
import { getUserApplications } from '@/app/actions/dashboardActions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface DashboardClientProps {
  user: UserData;
}

function ApplicationsTableSkeleton() {
  return (
    <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function DashboardClient({ user }: DashboardClientProps) {
    const [applications, setApplications] = useState<UserApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    useEffect(() => {
        async function fetchApplications() {
            setIsLoading(true);
            try {
                const userApps = await getUserApplications();
                setApplications(userApps);
            } catch (error) {
                console.error("Failed to load user applications:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not load your applications."
                })
            } finally {
                setIsLoading(false);
            }
        }

        fetchApplications();
    }, [toast]);


  if (user.type === 'partner') {
    // Pass the fetched applications and loading state to the PartnerDashboard
    return <PartnerDashboard user={user} applications={applications} isLoading={isLoading} />;
  }

  // Fallback to the normal user dashboard
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user.fullName}!</h1>
            <p className="text-muted-foreground">Here's a summary of your recent activity and applications.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>A list of all your submitted applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} />}
        </CardContent>
      </Card>
    </>
  );
}
