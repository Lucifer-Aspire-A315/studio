
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserApplication } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2 } from 'lucide-react';

interface AdminApplicationsTableProps {
  applications: UserApplication[];
  onUpdateStatus: (applicationId: string, serviceCategory: UserApplication['serviceCategory'], newStatus: string) => void;
  isUpdating: boolean;
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'default';
    case 'in review':
      return 'secondary';
    case 'approved':
      // A green-like color would be good here, but we'll stick to theme colors.
      // We can use secondary for approved as well for now, or define a new variant.
      return 'secondary';
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

const availableStatuses = ['Submitted', 'In Review', 'Approved', 'Rejected'];

export function AdminApplicationsTable({ applications, onUpdateStatus, isUpdating }: AdminApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Applications Found</h3>
        <p className="text-sm text-muted-foreground mt-1">There are no applications submitted on the platform yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Application Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                <div>{app.applicantDetails?.fullName || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">{app.applicantDetails?.email || 'N/A'}</div>
              </TableCell>
              <TableCell>{app.applicationType}</TableCell>
              <TableCell>{getCategoryDisplay(app.serviceCategory)}</TableCell>
              <TableCell>{format(new Date(app.createdAt), 'PPp')}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(app.status)} className="capitalize">
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {availableStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => onUpdateStatus(app.id, app.serviceCategory, status)}
                        disabled={app.status === status || isUpdating}
                      >
                        Set as {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
