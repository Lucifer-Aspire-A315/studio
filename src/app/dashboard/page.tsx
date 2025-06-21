
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getUserApplications } from '@/app/actions/dashboardActions';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ApplicationsTable } from '@/components/dashboard/ApplicationsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// A helper function to get user info on the server
async function getUser() {
  const userId = cookies().get('user_id')?.value;
  const userName = cookies().get('user_name')?.value;
  if (!userId || !userName) {
    return null;
  }
  return { id: userId, name: userName };
}

function DashboardHeader({ name }: { name: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {name}!</h1>
      <p className="text-muted-foreground">Here's a summary of your recent activity and applications.</p>
    </div>
  );
}

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
  const user = await getUser();

  if (!user) {
    // If no user is found in cookies on the server, redirect to login page.
    redirect('/login');
  }

  // Fetch applications on the server. The result is awaited.
  const applications = await getUserApplications();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* The Header component will read cookies on the client side for its state */}
      <Header /> 
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader name={user.name} />
        <Suspense fallback={<ApplicationsTableSkeleton />}>
           <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>A list of all your submitted applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsTable applications={applications} />
            </CardContent>
          </Card>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
