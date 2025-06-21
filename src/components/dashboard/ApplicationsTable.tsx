"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserApplication } from '@/lib/types';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ApplicationsTableProps {
  applications: UserApplication[];
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'default';
    case 'in review':
      return 'secondary';
    case 'approved':
      return 'secondary'; // Using secondary for approved to distinguish from submitted
    case 'rejected':
      return 'destructive';
    default:
      return 'default';
  }
};

const getCategoryDisplay = (category: UserApplication['serviceCategory']): string => {
    switch (category) {
        case 'loan': return 'Loan Application';
        case 'caService': return 'CA Service';
        case 'governmentScheme': return 'Government Scheme';
        default: return 'Application';
    }
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const router = useRouter();

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Applications Found</h3>
        <p className="text-sm text-muted-foreground mt-1">You have not submitted any applications yet.</p>
      </div>
    );
  }

  const handleRowClick = (app: UserApplication) => {
    router.push(`/dashboard/application/${app.id}?category=${app.serviceCategory}`);
  };


  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow 
              key={app.id} 
              onClick={() => handleRowClick(app)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{app.applicationType}</TableCell>
              <TableCell>{getCategoryDisplay(app.serviceCategory)}</TableCell>
              <TableCell>{format(new Date(app.createdAt), 'PPp')}</TableCell>
              <TableCell className="text-right">
                <Badge variant={getStatusVariant(app.status)} className="capitalize">
                  {app.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
