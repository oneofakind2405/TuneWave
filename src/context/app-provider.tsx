
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Event } from '@/lib/events-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

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
          try {
            // Correctly construct the document reference
            const attendeesCollectionRef = collection(firestore, 'events', event.id, 'attendees');
            const attendeeQuery = query(attendeesCollectionRef);
            const attendeeSnapshot = await getDocs(attendeeQuery);

            const userIsAttending = attendeeSnapshot.docs.some(doc => doc.id === authUser.uid);
            
            if (userIsAttending) {
                return event.id;
            }

          } catch (e) {
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
        // Clear attending events if user logs out
        setAttendingEventIds(new Set());
      }
    };
    
    // We run this effect when the authenticated user changes, or when the list of events changes.
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
      isLoading,
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
