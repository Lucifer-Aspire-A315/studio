import { getApplicationDetails } from '@/app/actions/applicationActions';
import { Header } from '@/components/layout/Header';
import { ApplicationDetailsView } from '@/components/application/ApplicationDetailsView';
import type { UserApplication } from '@/lib/types';
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';

interface AdminApplicationDetailsPageProps {
  params: { id: string };
  searchParams: { category?: UserApplication['serviceCategory'] };
}

export default async function AdminApplicationDetailsPage({ params, searchParams }: AdminApplicationDetailsPageProps) {
  const user = await checkSessionAction();
  if (!user?.isAdmin) {
    redirect('/login');
  }

  const { id } = params;
  const { category } = searchParams;

  if (!category) {
    return <div>Error: Service category not specified.</div>;
  }

  const applicationData = await getApplicationDetails(id, category);

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <ApplicationDetailsView 
            applicationData={applicationData}
            title="Admin View: Application Details"
            subtitle={`Viewing details for application ID: ${id}`}
        />
      </main>
    </div>
  );
}
