'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import type { Event } from '@/lib/events-data';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from './ui/button';

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailsDialog({ event, open, onOpenChange }: EventDetailsDialogProps) {
  if (!event) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
              data-ai-hint={event.imageHint}
            />
          </div>
          <div className="p-6">
            <div className="mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">{event.category}</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{event.location}</span>
            </div>
            <p className="text-muted-foreground mb-6">{event.description}</p>
            <Button onClick={() => onOpenChange(false)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Close</Button>
          </div>
      </DialogContent>
    </Dialog>
  );
}