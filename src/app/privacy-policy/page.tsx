
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
           <Button asChild variant="ghost" className="mb-4 -ml-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-foreground">
              <p>
                Welcome to FinSol RN. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, maintain, and disclose information collected from users (each, a "User") of the FinSol RN website ("Site").
              </p>

              <h2 className="text-xl font-semibold">Information We Collect</h2>
              <p>
                We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, financial information, and government-issued identification numbers.
              </p>

              <h2 className="text-xl font-semibold">How We Use Your Information</h2>
              <p>
                FinSol RN may collect and use Users' personal information for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>To process applications:</strong> We use the information Users provide about themselves when placing an application only to provide service to that application. We do not share this information with outside parties except to the extent necessary to provide the service.</li>
                <li><strong>To improve customer service:</strong> Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
                <li><strong>To personalize user experience:</strong> We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
                <li><strong>To send periodic emails:</strong> We may use the email address to send User information and updates pertaining to their application. It may also be used to respond to their inquiries, questions, and/or other requests.</li>
              </ul>

              <h2 className="text-xl font-semibold">Data Security</h2>
              <p>
                We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
              </p>

              <h2 className="text-xl font-semibold">Changes to This Privacy Policy</h2>
              <p>
                FinSol RN has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
              </p>

              <h2 className="text-xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at: contact@rnfintech.com
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
