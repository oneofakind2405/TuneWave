'use client';

import { useState, useMemo, useCallback } from 'react';
import { events as initialEvents, type Event } from '@/lib/events-data';
import { EventCard } from './event-card';
import { Button } from './ui/button';
import { Disc3, Mic, Music, PlusCircle } from 'lucide-react';
import { GuitarIcon } from './icons/guitar';
import { EventDetailsDialog } from './event-details-dialog';
import { EditEventForm } from './edit-event-form';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { CreateEventForm } from './create-event-form';
import { useToast } from '@/hooks/use-toast';

const categories = [
  { name: 'All', icon: Music },
  { name: 'Rock', icon: GuitarIcon },
  { name: 'Pop', icon: Mic },
  { name: 'Electronic', icon: Disc3 },
] as const;

type Category = (typeof categories)[number]['name'];

// Mock user ID - replace with actual user from auth state
const currentUserId = 'user-liam';

export function EventsSection() {
  const [events, setEvents] = useState(initialEvents);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };
  
  const handleEdit = () => {
    if (!selectedEvent) return;
    if (selectedEvent.creatorId !== currentUserId) {
        toast({ variant: 'destructive', title: "Not Authorized", description: "You can only edit your own events." });
        return;
    }
    setIsDetailsOpen(false);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    if (selectedEvent.creatorId !== currentUserId) {
        toast({ variant: 'destructive', title: "Not Authorized", description: "You can only delete your own events." });
        return;
    }
    setIsDetailsOpen(false);
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      toast({ title: "Event Deleted", description: "The event has been successfully deleted." });
    }
    setIsDeleting(false);
    setSelectedEvent(null);
  };

  const handleSave = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    toast({ title: "Event Updated", description: "Your event has been successfully updated." });
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleCreate = (newEventData: Omit<Event, 'id' | 'creatorId'>) => {
    const newEvent: Event = {
      ...newEventData,
      id: Date.now().toString(),
      creatorId: currentUserId,
    };
    setEvents([newEvent, ...events]);
    toast({ title: "Event Created", description: "Your new event has been successfully created." });
    setIsCreating(false);
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
          {filteredEvents.length === 0 && (
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
        isCreator={selectedEvent?.creatorId === currentUserId}
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
    </>
  );
}
