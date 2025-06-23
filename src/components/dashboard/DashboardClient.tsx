
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationsTable } from './ApplicationsTable';
import type { UserApplication, UserData } from '@/lib/types';

interface DashboardClientProps {
  user: UserData | null;
  applications: UserApplication[];
}

export function DashboardClient({ user, applications }: DashboardClientProps) {
  if (!user) {
    return null; // Or a loading/error state
  }

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
          <ApplicationsTable applications={applications} />
        </CardContent>
      </Card>
    </>
  );
}
