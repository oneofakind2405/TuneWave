'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Event } from '@/lib/events-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, where, getDocs, doc } from 'firebase/firestore';

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
      if (firestore && authUser && events && events.length > 0) {
        const newAttendingEventIds = new Set<string>();
        // Create a batch of promises to check attendance for all events
        const attendanceChecks = events.map(async (event) => {
          const attendeeDocRef = doc(firestore, 'events', event.id, 'attendees', authUser.uid);
          // This is not a query, but we can simulate a read.
          // A more direct way is needed if we stick to this model.
          // Let's check for document existence.
          try {
            // Using a query to check for a single doc is one way.
            const q = query(collection(firestore, 'events', event.id, 'attendees'), where('__name__', '==', authUser.uid));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              return event.id;
            }
          } catch (e) {
            // Permission errors will be caught by the global handler if they are thrown from a hook.
            // Direct SDK calls in useEffect won't be caught automatically.
            console.warn(`Could not check attendance for event ${event.id}`, e);
          }
          return null;
        });

        const results = await Promise.all(attendanceChecks);
        results.forEach(eventId => {
          if (eventId) {
            newAttendingEventIds.add(eventId);
          }
        });
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
