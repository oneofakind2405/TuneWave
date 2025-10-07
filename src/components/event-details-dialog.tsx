'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Event } from '@/lib/events-data';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

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
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
              data-ai-hint={event.imageHint}
            />
          </div>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
          <div className="pt-2">
            <Badge variant="secondary">{event.category}</Badge>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>{event.description}</p>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{event.time}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
