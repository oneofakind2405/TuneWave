import type { Event } from '@/lib/events-data';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from './ui/button';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card 
      className="flex h-full cursor-pointer flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          data-ai-hint={event.imageHint}
        />
      </div>
      <CardContent className="flex flex-grow flex-col p-4">
        <div className="mb-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{event.category}</Badge>
        </div>
        <h3 className="text-lg font-bold mb-2">{event.title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className='flex items-center gap-2'>
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
            </div>
            <div className='flex items-center gap-2'>
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{event.time}</span>
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{event.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow mb-4">{event.description}</p>
        <Button onClick={onClick} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">View Details</Button>
      </CardContent>
    </Card>
  );
}