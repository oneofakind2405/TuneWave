'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Event } from '@/lib/events-data';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Pencil, Trash2, User, UserPlus, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { User as AuthUser } from 'firebase/auth';


interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  isCreator: boolean;
  user: AuthUser | null | undefined;
  onSignInClick: () => void;
  isAttending: boolean;
  onToggleAttend: () => void;
}


export function EventDetailsDialog({ event, open, onOpenChange, onEdit, onDelete, isCreator, user, onSignInClick, isAttending, onToggleAttend }: EventDetailsDialogProps) {
  if (!event) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 w-full overflow-hidden md:h-full md:rounded-l-lg">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={event.imageHint}
            />
          </div>
          <div className="flex flex-col p-6">
            <div className="mb-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">{event.category}</Badge>
            </div>
            <DialogHeader className="p-0 text-left mb-4">
              <DialogTitle className="text-3xl font-bold">{event.title}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                <div className='flex items-start gap-2'>
                    <Calendar className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className='flex items-start gap-2'>
                    <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{event.time}</span>
                </div>
                <div className='flex items-start gap-2 col-span-2'>
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{event.location}</span>
                </div>
                 <div className='flex items-start gap-2'>
                    <User className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Created by: {event.creatorId.substring(0, 6)}...</span>
                </div>
            </div>

            <Separator className="my-4" />

            <div className="flex-grow overflow-y-auto pr-2 text-sm" style={{maxHeight: 'calc(100vh - 450px)'}}>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
            
            <Separator className="my-4" />

            <div className="flex flex-col sm:flex-row gap-2">
              {user === undefined ? null : !user ? (
                <Button onClick={onSignInClick} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign in to Attend
                </Button>
              ) : isCreator ? (
                <>
                  <Button onClick={onEdit} className="w-full">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button onClick={onDelete} variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </>
              ) : isAttending ? (
                <Button variant="secondary" className="w-full" onClick={onToggleAttend}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Attending
                </Button>
              ) : (
                <Button variant="default" className="w-full" onClick={onToggleAttend}>
                   <UserPlus className="mr-2 h-4 w-4" /> Join this event
                </Button>
              )}
              <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
