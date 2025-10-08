'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { Event } from '@/lib/events-data';
import { useCollection, useFirebase } from '@/firebase';
import { collection, query, orderBy, where, getDocs, doc } from 'firebase/firestore';

type Location = {
  latitude: number;
  longitude: number;
};

type AppContextType = {
  user: any | null | undefined;
  setUser: Dispatch<SetStateAction<any | null | undefined>>;
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
  attendingEventIds: Set<string>;
  setAttendingEventIds: Dispatch<SetStateAction<Set<string>>>;
  isLoading: boolean;
  location: Location | null;
  locationError: string | null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { firestore, user: authUser, isUserLoading } = useFirebase();
  const [user, setUser] = useState<any | null | undefined>(undefined);
  const [attendingEventIds, setAttendingEventIds] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);


  const eventsQuery = useMemo(() => firestore ? query(collection(firestore, 'events'), orderBy('createdAt', 'desc')) : null, [firestore]);
  const { data: events, isLoading: isEventsLoading } = useCollection<Event>(eventsQuery);

  useEffect(() => {
    if (!isUserLoading) {
      setUser(authUser);
    }
  }, [isUserLoading, authUser]);

  useEffect(() => {
    // Request location only on the client side
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied. You can enable it in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred while getting location.");
              break;
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchAttendingEvents = async () => {
      if (firestore && authUser && events && events.length > 0) {
        const newAttendingEventIds = new Set<string>();
        // Create a batch of promises to check attendance for all events
        const attendanceChecks = events.map(async (event) => {
          try {
            const q = query(collection(firestore, 'events', event.id, 'attendees'), where('__name__', '==', authUser.uid));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
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
      isLoading,
      location,
      locationError,
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
