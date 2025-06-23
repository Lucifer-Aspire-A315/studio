
'use client';

import type { UserData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Handshake, UserPlus, Store } from 'lucide-react';
import { NewLoanApplication } from './NewLoanApplication';

interface PartnerDashboardViewProps {
    user: UserData;
}

const ReferralDashboard = ({ user }: PartnerDashboardViewProps) => (
    <Card>
        <CardHeader>
            <CardTitle>Referral Partner Dashboard</CardTitle>
            <CardDescription>Welcome, {user.fullName}. Track your referrals and earnings here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Referral Tracking Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-1">This section is under construction.</p>
            </div>
        </CardContent>
    </Card>
);

const DsaDashboard = ({ user }: PartnerDashboardViewProps) => (
    <Tabs defaultValue="newApplication" className="space-y-4">
        <TabsList>
            <TabsTrigger value="newApplication">New Client Application</TabsTrigger>
            <TabsTrigger value="myApplications">My Submitted Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="newApplication">
            <NewLoanApplication /> 
        </TabsContent>
        <TabsContent value="myApplications">
            <Card>
                <CardHeader>
                    <CardTitle>Applications Submitted by You</CardTitle>
                    <CardDescription>A list of all applications you have submitted for clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium text-muted-foreground">Application Tracking Coming Soon</h3>
                        <p className="text-sm text-muted-foreground mt-1">This section is under construction.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);

const MerchantDashboard = ({ user }: PartnerDashboardViewProps) => (
     <Card>
        <CardHeader>
            <CardTitle>Merchant Partner Dashboard</CardTitle>
            <CardDescription>Welcome, {user.fullName}. Manage point-of-sale financing here.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-muted-foreground">Point-of-Sale Tools Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-1">This section is under construction.</p>
            </div>
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

export function PartnerDashboard({ user }: PartnerDashboardViewProps) {
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
            {DashboardComponent ? <DashboardComponent user={user} /> : <p>Dashboard for your partner type is not available yet.</p>}
        </div>
    );
}
