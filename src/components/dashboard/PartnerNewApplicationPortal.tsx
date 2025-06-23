
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartnerLoanApplication } from './PartnerLoanApplication';
import { PartnerCAServiceApplication } from './PartnerCAServiceApplication';
import { PartnerGovSchemeApplication } from './PartnerGovSchemeApplication';

export function PartnerNewApplicationPortal() {
    return (
        <Tabs defaultValue="loan" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="loan">Loan Applications</TabsTrigger>
                <TabsTrigger value="ca_service">CA Services</TabsTrigger>
                <TabsTrigger value="gov_scheme">Government Schemes</TabsTrigger>
            </TabsList>
            <TabsContent value="loan" className="mt-4">
                <PartnerLoanApplication />
            </TabsContent>
            <TabsContent value="ca_service" className="mt-4">
                <PartnerCAServiceApplication />
            </TabsContent>
            <TabsContent value="gov_scheme" className="mt-4">
                <PartnerGovSchemeApplication />
            </TabsContent>
        </Tabs>
    );
}
