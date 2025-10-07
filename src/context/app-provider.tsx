'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Event } from '@/lib/events-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';

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

  const eventsQuery = useMemo(() => firestore ? query(collection(firestore, 'events'), orderBy('createdAt', 'desc')) : null, [firestore]);
  const { data: events, isLoading: isEventsLoading } = useCollection<Event>(eventsQuery);

  useEffect(() => {
    if (!isUserLoading) {
      setUser(authUser);
    }
  }, [isUserLoading, authUser]);

  useEffect(() => {
    const fetchAttendingEvents = async () => {
      if (firestore && authUser && events) {
        const newAttendingEventIds = new Set<string>();
        for (const event of events) {
          const attendeeRef = collection(firestore, 'events', event.id, 'attendees');
          const q = query(attendeeRef, where('__name__', '==', authUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            newAttendingEventIds.add(event.id);
          }
        }
        setAttendingEventIds(newAttendingEventIds);
      } else if (!authUser) {
        setAttendingEventIds(new Set());
      }
    };
    
    fetchAttendingEvents();
  }, [authUser, firestore, events]);
  

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
