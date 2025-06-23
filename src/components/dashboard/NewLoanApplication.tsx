
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function NewLoanApplication() {
    const { toast } = useToast();

    const handleStartApplication = () => {
        toast({
            title: "Feature Coming Soon",
            description: "The multi-step loan application form will be implemented here.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Client Application</CardTitle>
                <CardDescription>Start a new loan application on behalf of a client.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleStartApplication}>Start New Application</Button>
            </CardContent>
        </Card>
    );
}
