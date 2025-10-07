'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { Event } from '@/lib/events-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

type AppContextType = {
  user: any | null | undefined;
  setUser: Dispatch<SetStateAction<any | null | undefined>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  attendingEventIds: Set<string>;
  setAttendingEventIds: Dispatch<SetStateAction<Set<string>>>;
  isLoading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { firestore, user: authUser, isUserLoading } = useFirebase();
  const [user, setUser] = useState<any | null | undefined>(undefined);
  const [attendingEventIds, setAttendingEventIds] = useState<Set<string>>(new Set());

  const eventsQuery = firestore ? query(collection(firestore, 'events'), orderBy('createdAt', 'desc')) : null;
  const { data: events, isLoading: isEventsLoading } = useCollection<Event>(eventsQuery);

  const attendingQuery = firestore && authUser ? collection(firestore, 'users', authUser.uid, 'attending') : null;
  const { data: attendingData } = useCollection(attendingQuery);

  useEffect(() => {
    if (attendingData) {
      setAttendingEventIds(new Set(attendingData.map(doc => doc.id)));
    }
  }, [attendingData]);

  useEffect(() => {
    if (!isUserLoading) {
      setUser(authUser);
    }
  }, [isUserLoading, authUser]);

  const isLoading = isUserLoading || isEventsLoading;

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      events: events || [],
      setEvents: () => {}, // This is now read-only from Firestore
      attendingEventIds, 
      setAttendingEventIds,
      isLoading
    }}>
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
