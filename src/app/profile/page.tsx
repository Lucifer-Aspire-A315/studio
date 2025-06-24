
import { redirect } from 'next/navigation';
import { checkSessionAction } from '@/app/actions/authActions';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, BadgeCheck } from 'lucide-react';

export default async function ProfilePage() {
  const user = await checkSessionAction();

  if (!user) {
    redirect('/login');
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  let userTypeDisplay: string;
  if (user.type === 'partner') {
    switch (user.businessModel) {
      case 'dsa':
        userTypeDisplay = 'DSA Partner';
        break;
      case 'merchant':
        userTypeDisplay = 'Merchant Partner';
        break;
      case 'referral':
        userTypeDisplay = 'Referral Partner';
        break;
      default:
        userTypeDisplay = 'Partner';
    }
  } else {
    userTypeDisplay = 'User';
  }


  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName}`} alt={user.fullName} />
              <AvatarFallback className="text-3xl">{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.fullName}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {user.isAdmin ? 'Administrator' : userTypeDisplay} Profile
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
              <User className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-background">
              <BadgeCheck className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground">{userTypeDisplay}</p>
              </div>
            </div>
            {user.isAdmin && (
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-destructive/10">
                <Shield className="w-6 h-6 text-destructive" />
                <div>
                  <p className="text-sm text-destructive/80">Admin Status</p>
                  <p className="font-medium text-destructive">You have administrator privileges.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
