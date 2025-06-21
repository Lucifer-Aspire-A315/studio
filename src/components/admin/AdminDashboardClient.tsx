
"use client";

import React, { useState, useTransition } from 'react';
import type { UserApplication, PartnerData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminApplicationsTable } from './AdminApplicationsTable';
import { PendingPartnersTable } from './PendingPartnersTable';
import { approvePartner } from '@/app/actions/adminActions';
import { useToast } from '@/hooks/use-toast';


interface AdminDashboardClientProps {
    initialApplications: UserApplication[];
    initialPendingPartners: PartnerData[];
}

export function AdminDashboardClient({ initialApplications, initialPendingPartners }: AdminDashboardClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [pendingPartners, setPendingPartners] = useState(initialPendingPartners);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleApprovePartner = (partnerId: string) => {
    startTransition(async () => {
        const result = await approvePartner(partnerId);
        if (result.success) {
            toast({
                title: "Partner Approved",
                description: result.message,
            });
            // Optimistically update the UI
            setPendingPartners(currentPartners => currentPartners.filter(p => p.id !== partnerId));
        } else {
             toast({
                variant: "destructive",
                title: "Approval Failed",
                description: result.message,
            });
        }
    });
  };

  return (
    <Tabs defaultValue="partners" className="space-y-4">
      <TabsList>
        <TabsTrigger value="partners">Pending Partners ({pendingPartners.length})</TabsTrigger>
        <TabsTrigger value="applications">All Applications ({applications.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="partners">
         <Card>
            <CardHeader>
              <CardTitle>Pending Partner Approvals</CardTitle>
              <CardDescription>Review and approve new partner registrations.</CardDescription>
            </CardHeader>
            <CardContent>
                <PendingPartnersTable 
                    partners={pendingPartners}
                    onApprove={handleApprovePartner}
                    isApproving={isPending}
                />
            </CardContent>
          </Card>
      </TabsContent>
      <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>All Submitted Applications</CardTitle>
              <CardDescription>A list of all applications submitted across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminApplicationsTable applications={applications} />
            </CardContent>
          </Card>
      </TabsContent>
    </Tabs>
  );
}
