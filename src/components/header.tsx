'use client';

import { Music2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useState } from 'react';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';

export function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Music2 className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">TuneWave</span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSignInOpen(true)}>Sign In</Button>
            <Button onClick={() => setIsSignUpOpen(true)}>Sign Up</Button>
          </div>
        </div>
      </header>
      <SignInForm open={isSignInOpen} onOpenChange={setIsSignInOpen} />
      <SignUpForm open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onSwitchToSignIn={() => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
      }} />
    </>
  );
}
