
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { PartnerData } from '@/lib/types';
import { format } from 'date-fns';

interface PendingPartnersTableProps {
  partners: PartnerData[];
  onApprove: (partnerId: string) => void;
  isApproving: boolean;
}

export function PendingPartnersTable({ partners, onApprove, isApproving }: PendingPartnersTableProps) {
  if (partners.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No Pending Partners</h3>
        <p className="text-sm text-muted-foreground mt-1">There are no new partner registrations to approve.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Registered On</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.fullName}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.mobileNumber}</TableCell>
              <TableCell>{format(new Date(partner.createdAt), 'PPp')}</TableCell>
              <TableCell className="text-right">
                <Button 
                    size="sm" 
                    onClick={() => onApprove(partner.id)} 
                    disabled={isApproving}
                    variant="success"
                >
                  {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
