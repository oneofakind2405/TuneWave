'use client';

import { useState, useMemo, useCallback } from 'react';
import { type Event } from '@/lib/events-data';
import { EventCard } from './event-card';
import { Button } from './ui/button';
import { Disc3, Mic, Music } from 'lucide-react';
import { GuitarIcon } from './icons/guitar';
import { EventDetailsDialog } from './event-details-dialog';
import { EditEventForm } from './edit-event-form';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { CreateEventForm } from './create-event-form';
import { useToast } from '@/hooks/use-toast';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/app-provider';
import { useFirebase } from '@/firebase';
import { doc, deleteDoc, updateDoc, setDoc, getDoc, serverTimestamp, runTransaction, increment, collection } from 'firebase/firestore';
import { Card } from './ui/card';

const categories = [
  { name: 'All', icon: Music },
  { name: 'Rock', icon: GuitarIcon },
  { name: 'Pop', icon: Mic },
  { name: 'Electronic', icon: Disc3 },
] as const;

type Category = (typeof categories)[number]['name'];


export function EventsSection() {
  const { user, events, attendingEventIds, setAttendingEventIds, isLoading } = useAppContext();
  const { firestore } = useFirebase();

  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const handleSelectEvent = async (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
    // Increment view count
    if (firestore && event.id) {
      const eventRef = doc(firestore, 'events', event.id);
      await updateDoc(eventRef, {
        views: increment(1)
      });
    }
  };
  
  const handleEdit = () => {
    if (!selectedEvent) return;
    if (!user || selectedEvent.creatorId !== user.uid) {
        toast({ variant: 'destructive', title: "Not Authorized", description: "You can only edit your own events." });
        return;
    }
    setIsDetailsOpen(false);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    if (!user || selectedEvent.creatorId !== user.uid) {
        toast({ variant: 'destructive', title: "Not Authorized", description: "You can only delete your own events." });
        return;
    }
    setIsDetailsOpen(false);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent && firestore) {
      try {
        await deleteDoc(doc(firestore, 'events', selectedEvent.id));
        toast({ title: "Event Deleted", description: "The event has been successfully deleted." });
      } catch (error: any) {
        toast({ variant: 'destructive', title: "Deletion Failed", description: error.message });
      }
    }
    setIsDeleting(false);
    setSelectedEvent(null);
  };

  const handleSave = async (updatedEvent: Event) => {
    if (firestore) {
      try {
        const eventRef = doc(firestore, 'events', updatedEvent.id);
        await updateDoc(eventRef, { ...updatedEvent });
        toast({ title: "Event Updated", description: "Your event has been successfully updated." });
      } catch (error: any) {
        toast({ variant: 'destructive', title: "Update Failed", description: error.message });
      }
    }
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleCreate = async (newEventData: Omit<Event, 'id' | 'creatorId' | 'createdAt'>) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: "Not Signed In", description: "You must be signed in to create an event." });
      return;
    }
    try {
      await runTransaction(firestore, async (transaction) => {
        const newEventRef = doc(collection(firestore, 'events'));
        transaction.set(newEventRef, {
          ...newEventData,
          id: newEventRef.id,
          creatorId: user.uid,
          views: 0,
          createdAt: serverTimestamp(),
        });
      });
      toast({ title: "Event Created", description: "Your new event has been successfully created." });
      setIsCreating(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Creation Failed", description: error.message });
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
    router.push('/profile');
  };

  const handleSignUpSuccess = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };
  
  const openSignIn = () => {
    closeAllDialogs();
    setIsSignInOpen(true);
  };

  const handleToggleAttend = async () => {
    if (!user || !selectedEvent || !firestore) return;

    const attendeeRef = doc(firestore, 'events', selectedEvent.id, 'attendees', user.uid);

    try {
        if (attendingEventIds.has(selectedEvent.id)) {
            // Leave event
            await deleteDoc(attendeeRef);
            setAttendingEventIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(selectedEvent.id);
                return newSet;
            });
            toast({ title: "No Longer Attending", description: `You have left the event: ${selectedEvent.title}` });
        } else {
            // Join event
            await setDoc(attendeeRef, { joinedAt: serverTimestamp() });
            setAttendingEventIds(prev => {
                const newSet = new Set(prev);
                newSet.add(selectedEvent.id);
                return newSet;
            });
            toast({ title: "You're In!", description: `You are now attending ${selectedEvent.title}` });
        }
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Update Failed", description: error.message });
    }
  };

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') {
      return events;
    }
    return events.filter((event) => event.category === activeCategory);
  }, [activeCategory, events]);

  const closeAllDialogs = useCallback(() => {
    setIsDetailsOpen(false);
    setIsEditing(false);
    setIsDeleting(false);
    setIsCreating(false);
    setSelectedEvent(null);
  }, []);


  return (
    <>
      <section id="events" className="scroll-mt-20 py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Upcoming Events</h2>
            <p className="mt-4 text-lg text-muted-foreground">Filter by category to find your perfect night out.</p>
          </div>

          <div className="my-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant={activeCategory === name ? 'default' : 'outline'}
                onClick={() => setActiveCategory(name)}
                className="capitalize"
              >
                <Icon className="mr-2 h-4 w-4" />
                {name}
              </Button>
            ))}
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-[450px] animate-pulse bg-secondary"></Card>
              ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-in fade-in-0 zoom-in-95 duration-500"
                  style={{ animationDelay: `${Math.min(index * 100, 500)}ms`, fillMode: 'backwards' }}
                >
                  <EventCard event={event} onClick={() => handleSelectEvent(event)} />
                </div>
              ))}
            </div>
          )}
          {!isLoading && filteredEvents.length === 0 && (
            <div className="mt-8 text-center text-muted-foreground">
              <p>No events found for this category. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
      
      <EventDetailsDialog
        event={selectedEvent}
        open={isDetailsOpen}
        onOpenChange={(open) => { if (!open) closeAllDialogs() }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isCreator={!!user && selectedEvent?.creatorId === user.uid}
        user={user}
        onSignInClick={openSignIn}
        isAttending={!!selectedEvent && attendingEventIds.has(selectedEvent.id)}
        onToggleAttend={handleToggleAttend}
      />

      <EditEventForm 
        event={selectedEvent}
        open={isEditing}
        onOpenChange={(open) => { if (!open) closeAllDialogs() }}
        onSave={handleSave}
      />

      <CreateEventForm
        open={isCreating}
        onOpenChange={(open) => { if (!open) closeAllDialogs() }}
        onCreate={handleCreate}
      />
      
      <DeleteConfirmationDialog
        open={isDeleting}
        onOpenChange={(open) => { if (!open) closeAllDialogs() }}
        onConfirm={confirmDelete}
      />
      <SignInForm
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSignedIn={handleSignInSuccess}
      />
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
