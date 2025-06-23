
'use client';

import type { UserData, UserApplication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Handshake, UserPlus, Store } from 'lucide-react';
import { PartnerNewApplicationPortal } from './PartnerNewApplicationPortal';
import { ApplicationsTable } from './ApplicationsTable';

interface PartnerDashboardViewProps {
    user: UserData;
    applications: UserApplication[];
}

const ReferralDashboard = ({ user, applications }: PartnerDashboardViewProps) => (
    <Tabs defaultValue="newApplication" className="space-y-4">
        <TabsList>
            <TabsTrigger value="newApplication">Start New Application</TabsTrigger>
            <TabsTrigger value="myApplications">My Submitted Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="newApplication">
             <Card>
                <CardHeader>
                    <CardTitle>New Referral Application</CardTitle>
                    <CardDescription>
                        Start a new application on behalf of a client you are referring.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PartnerNewApplicationPortal />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="myApplications">
            <Card>
                <CardHeader>
                    <CardTitle>Referral Activity</CardTitle>
                    <CardDescription>
                        A list of all applications you have submitted.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicationsTable applications={applications} />
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);

const DsaDashboard = ({ user, applications }: PartnerDashboardViewProps) => (
    <Tabs defaultValue="newApplication" className="space-y-4">
        <TabsList>
            <TabsTrigger value="newApplication">New Client Application</TabsTrigger>
            <TabsTrigger value="myApplications">My Submitted Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="newApplication">
            <Card>
                <CardHeader>
                    <CardTitle>New Client Application</CardTitle>
                    <CardDescription>Start a new application on behalf of a client. Select the service to begin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PartnerNewApplicationPortal />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="myApplications">
            <Card>
                <CardHeader>
                    <CardTitle>Applications Submitted by You</CardTitle>
                    <CardDescription>A list of all applications you have submitted for clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicationsTable applications={applications} />
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);

const MerchantDashboard = ({ user, applications }: PartnerDashboardViewProps) => (
    <Tabs defaultValue="newApplication" className="space-y-4">
        <TabsList>
            <TabsTrigger value="newApplication">New Customer Application</TabsTrigger>
            <TabsTrigger value="myApplications">My Submitted Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="newApplication">
            <Card>
                <CardHeader>
                    <CardTitle>New Customer Application</CardTitle>
                    <CardDescription>Start a new application for a customer. Select the service to begin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PartnerNewApplicationPortal /> 
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="myApplications">
            <Card>
                <CardHeader>
                    <CardTitle>Applications Submitted by You</CardTitle>
                    <CardDescription>A list of all applications you have submitted for your customers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicationsTable applications={applications} />
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
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

export function PartnerDashboard({ user, applications }: PartnerDashboardViewProps) {
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
            {DashboardComponent ? <DashboardComponent user={user} applications={applications} /> : <p>Dashboard for your partner type is not available yet.</p>}
        </div>
    );
}
