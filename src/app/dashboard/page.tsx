
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { checkSessionAction } from '@/app/actions/authActions';
import { getUserApplications } from '@/app/actions/dashboardActions';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

function ApplicationsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
        <CardDescription>A list of all your submitted applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}


export default async function DashboardPage() {
  const user = await checkSessionAction();

  if (!user) {
    redirect('/login');
  }

  // This action now works for both normal users and partners,
  // fetching applications where they are the 'submitter'.
  const applications = await getUserApplications();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={<ApplicationsTableSkeleton />}>
           <DashboardClient user={user} applications={applications} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
