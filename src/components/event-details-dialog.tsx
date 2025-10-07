'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Event } from '@/lib/events-data';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetailsDialog({ event, open, onOpenChange, onEdit, onDelete }: EventDetailsDialogProps) {
  if (!event) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 w-full overflow-hidden md:h-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={event.imageHint}
            />
          </div>
          <div className="flex flex-col p-6">
            <div className="mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">{event.category}</Badge>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2 text-left">{event.title}</DialogTitle>
            </DialogHeader>
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
            <div className="flex-grow overflow-y-auto pr-2" style={{maxHeight: 'calc(100vh - 350px)'}}>
                <p className="text-muted-foreground">{event.description}</p>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={onEdit} className="w-full">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Event
                </Button>
                <Button onClick={onDelete} variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                </Button>
                <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">Close</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
