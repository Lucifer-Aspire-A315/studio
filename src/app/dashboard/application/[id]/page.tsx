import { Header } from '@/components/layout/Header';
import { ApplicationDetailsView } from '@/components/application/ApplicationDetailsView';
import type { UserApplication } from '@/lib/types';
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';

interface ApplicationDetailsPageProps {
  params: { id: string };
  searchParams: { category?: UserApplication['serviceCategory'] };
}

export default async function ApplicationDetailsPage({ params, searchParams }: ApplicationDetailsPageProps) {
  const user = await checkSessionAction();
  if (!user) {
    redirect('/login');
  }

  const { id } = params;
  const { category } = searchParams;

  if (!category) {
    return <div>Error: Service category not specified.</div>;
  }

  // Data fetching is now handled inside ApplicationDetailsView
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <ApplicationDetailsView
          applicationId={id}
          serviceCategory={category}
          title="Application Details"
          subtitle={`Viewing details for application ID: ${id}`}
          isAdmin={false}
        />
      </main>
    </div>
  );
}
