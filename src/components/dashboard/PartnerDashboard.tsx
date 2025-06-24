
'use client';

import type { UserData, UserApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Handshake, UserPlus, Store, PlusCircle } from 'lucide-react';
import { PartnerNewApplicationPortal } from './PartnerNewApplicationPortal';
import { ApplicationsTable } from './ApplicationsTable';
import { Skeleton } from '../ui/skeleton';

interface PartnerDashboardViewProps {
    user: UserData;
    applications: UserApplication[];
    isLoading: boolean;
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

const NewApplicationButton = ({ buttonText }: { buttonText: string }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {buttonText}
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>New Application Portal</DialogTitle>
                <DialogDescription>
                    Select a service below to start a new application for your client.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
                 <PartnerNewApplicationPortal />
            </div>
        </DialogContent>
    </Dialog>
);


const ReferralDashboard = ({ user, applications, isLoading }: PartnerDashboardViewProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Referral Activity</CardTitle>
                <CardDescription>
                    A list of all applications you have submitted.
                </CardDescription>
            </div>
             <NewApplicationButton buttonText="Start New Referral" />
        </CardHeader>
        <CardContent>
            {isLoading ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} />}
        </CardContent>
    </Card>
);

const DsaDashboard = ({ user, applications, isLoading }: PartnerDashboardViewProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Applications Submitted by You</CardTitle>
                <CardDescription>A list of all applications you have submitted for clients.</CardDescription>
             </div>
             <NewApplicationButton buttonText="New Client Application" />
        </CardHeader>
        <CardContent>
            {isLoading ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} />}
        </CardContent>
    </Card>
);

const MerchantDashboard = ({ user, applications, isLoading }: PartnerDashboardViewProps) => (
     <Card>
        <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Applications Submitted by You</CardTitle>
                <CardDescription>A list of all applications you have submitted for your customers.</CardDescription>
             </div>
             <NewApplicationButton buttonText="New Customer Application" />
        </CardHeader>
        <CardContent>
            {isLoading ? <ApplicationsTableSkeleton /> : <ApplicationsTable applications={applications} />}
        </CardContent>
    </Card>
);

const modelToComponent: Record<string, React.FC<PartnerDashboardViewProps>> = {
    referral: ReferralDashboard,
    dsa: DsaDashboard,
    merchant: MerchantDashboard
};

const modelToIcon: Record<string, React.ReactNode> = {
    referral: <Handshake className="w-6 h-6 mr-2 text-primary" />,
    dsa: <UserPlus className="w-6 h-6 mr-2 text-primary" />,
    merchant: <Store className="w-6 h-6 mr-2 text-primary" />,
};

const modelToTitle: Record<string, string> = {
    referral: 'Referral Partner',
    dsa: 'DSA Partner',
    merchant: 'Merchant Partner',
}

export function PartnerDashboard({ user, applications, isLoading }: PartnerDashboardViewProps) {
    if (!user.businessModel) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Configuration Error</CardTitle>
                    <CardDescription>Business model not found for this partner account. Please contact support.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const DashboardComponent = modelToComponent[user.businessModel];
    const DashboardIcon = modelToIcon[user.businessModel];
    const DashboardTitle = modelToTitle[user.businessModel];

    return (
         <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center">
                        {DashboardIcon}
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{DashboardTitle} Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground">Welcome, {user.fullName}! Manage your partner activities here.</p>
                </div>
            </div>
            {DashboardComponent ? <DashboardComponent user={user} applications={applications} isLoading={isLoading} /> : <p>Dashboard for your partner type is not available yet.</p>}
        </div>
    );
}
