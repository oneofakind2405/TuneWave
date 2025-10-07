'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { User } from '@/lib/users';
import { events as initialEvents, Event } from '@/lib/events-data';

// undefined means the user state is still loading
type AppContextType = {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  attendingEventIds: Set<string>;
  setAttendingEventIds: Dispatch<SetStateAction<Set<string>>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [attendingEventIds, setAttendingEventIds] = useState<Set<string>>(new Set(['3', '5']));

  // In a real app, you'd fetch the user session here.
  // For now, we'll just initialize it as null after a short delay to simulate loading.
  useEffect(() => {
     const timer = setTimeout(() => {
        setUser(null);
     }, 500);
     return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, events, setEvents, attendingEventIds, setAttendingEventIds }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
