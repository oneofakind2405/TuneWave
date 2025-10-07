
'use client';

import { useState } from 'react';
import { EventsSection } from "@/components/events-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { User } from '@/lib/users';


export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onSetUser={setUser} />
      <main className="flex-1">
        <HeroSection />
        <EventsSection user={user} onSetUser={setUser} />
      </main>
      <Footer />
    </div>
  );
}
