'use client';

import { useState, useMemo } from 'react';
import { events, type Event } from '@/lib/events-data';
import { EventCard } from './event-card';
import { Button } from './ui/button';
import { Disc3, Mic, Music } from 'lucide-react';
import { GuitarIcon } from './icons/guitar';
import { EventDetailsDialog } from './event-details-dialog';

const categories = [
  { name: 'All', icon: Music },
  { name: 'Rock', icon: GuitarIcon },
  { name: 'Pop', icon: Mic },
  { name: 'Electronic', icon: Disc3 },
] as const;

type Category = (typeof categories)[number]['name'];

export function EventsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') {
      return events;
    }
    return events.filter((event) => event.category === activeCategory);
  }, [activeCategory]);

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
                <EventCard event={event} onClick={() => setSelectedEvent(event)} />
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
        open={!!selectedEvent}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null);
          }
        }}
      />
    </>
  );
}
