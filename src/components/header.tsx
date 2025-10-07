'use client';

import { Music2, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useState } from 'react';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  // We'll use a mock user for now. In a real app, you'd get this from your auth state.
  const [user, setUser] = useState<{name: string, email: string, initials: string} | null>(null);
  const router = useRouter();


  const handleSignInSuccess = () => {
    // In a real app, this would be the result of your auth flow
    setUser({name: 'Liam Ottley', email: 'liamottley@gmail.com', initials: 'LO'});
    setIsSignInOpen(false);
    router.push('/profile');
  }

  const handleSignOut = () => {
    setUser(null);
    router.push('/');
  }

  const handleSignUpSuccess = () => {
    // For now, just switch to sign in
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Music2 className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">TuneWave</span>
          </Link>
          <nav className="flex flex-1 items-center gap-4 text-sm">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                Events
            </Link>
            {user && (
                <Link href="/profile" className="text-muted-foreground transition-colors hover:text-foreground">
                    My Profile
                </Link>
            )}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2">
            {user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8 text-lg">
                            <AvatarFallback className="bg-primary text-primary-foreground">{user.initials}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                        </p>
                    </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                       <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setIsCreating(true)}>
                        Create Event
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsSignInOpen(true)}>Sign In</Button>
                <Button onClick={() => setIsSignUpOpen(true)}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>
      <SignInForm open={isSignInOpen} onOpenChange={setIsSignInOpen} onSignedIn={handleSignInSuccess}/>
      <SignUpForm 
        open={isSignUpOpen} 
        onOpenChange={setIsSignUpOpen} 
        onSignUpSuccess={handleSignUpSuccess}
        onSwitchToSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }} 
      />
    </>
  );
}
