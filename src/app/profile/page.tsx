'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Event } from '@/lib/events-data';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Eye, MapPin, PlusCircle, Trash2, Users } from 'lucide-react';
import Image from 'next/image';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { EditEventForm } from '@/components/edit-event-form';
import { CreateEventForm } from '@/components/create-event-form';
import { useAppContext } from '@/context/app-provider';
import { useRouter } from 'next/navigation';
import { useFirebase, useCollection, useDoc, setDocumentNonBlocking, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


function ProfileEventCard({
  event,
  isCreator,
  onEdit,
  onDelete,
  attendeeCount,
}: {
  event: Event;
  isCreator: boolean;
  onEdit: () => void;
  onDelete: () => void;
  attendeeCount: number;
}) {
  return (
    <Card className="bg-secondary border-none">
      <CardContent className="flex flex-col md:flex-row items-start gap-6 p-4">
        <div className="relative w-full md:w-48 aspect-video md:aspect-square rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48vw"
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <Badge variant="outline" className="border-primary text-primary">
              {event.category}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-3 text-sm">
            {event.description.substring(0, 100)}...
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {attendeeCount} {attendeeCount === 1 ? 'Attendee' : 'Attendees'}
                </span>
              </div>
              {isCreator && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>
                    {event.views || 0} {event.views === 1 ? 'View' : 'Views'}
                  </span>
                </div>
              )}
            </div>
            {isCreator && (
              <div className="flex gap-2">
                <Button onClick={onEdit} size="sm" variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button onClick={onDelete} size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function ProfilePage() {
  const { user: authUser, isLoading: isAppLoading, attendingEventIds } = useAppContext();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user profile from Firestore
  const userDocRef = useMemo(() => authUser ? doc(firestore, 'users', authUser.uid) : null, [authUser, firestore]);
  const { data: userProfile, isLoading: isUserLoading } = useDoc(userDocRef);

  // Fetch events created by the user
  const createdEventsQuery = useMemo(() => {
    if (!firestore || !authUser) return null;
    return query(collection(firestore, 'events'), where('creatorId', '==', authUser.uid));
  }, [firestore, authUser]);
  const { data: createdEvents, isLoading: isCreatedEventsLoading } = useCollection<Event>(createdEventsQuery);

  // Fetch events the user is attending
  const attendingEventsQuery = useMemo(() => {
    if (!firestore || attendingEventIds.size === 0) return null;
    return query(collection(firestore, 'events'), where('id', 'in', Array.from(attendingEventIds)));
  }, [firestore, attendingEventIds]);
  const { data: attendingEvents, isLoading: isAttendingEventsLoading } = useCollection<Event>(attendingEventsQuery);

  // Fetch attendee counts for all relevant events
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const allEvents = [...(createdEvents || []), ...(attendingEvents || [])];
    const uniqueEventIds = [...new Set(allEvents.map(e => e.id))];

    if (uniqueEventIds.length > 0 && firestore) {
      const fetchCounts = async () => {
        const counts: Record<string, number> = {};
        for (const eventId of uniqueEventIds) {
          try {
            const attendeesCol = collection(firestore, 'events', eventId, 'attendees');
            const snapshot = await getDocs(attendeesCol);
            counts[eventId] = snapshot.size;
          } catch (error) {
            // This might fail if rules don't allow listing attendees for events not created by user.
            // We can handle this gracefully.
            console.warn(`Could not fetch attendee count for event ${eventId}:`, error);
            counts[eventId] = 0; // Default to 0 if fetching fails
          }
        }
        setAttendeeCounts(counts);
      };
      fetchCounts();
    }
  }, [createdEvents, attendingEvents, firestore]);


  useEffect(() => {
    if (!isAppLoading && !authUser) {
      router.push('/');
    }
  }, [isAppLoading, authUser, router]);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    if (selectedEvent && firestore) {
      deleteDocumentNonBlocking(doc(firestore, 'events', selectedEvent.id));
      toast({ title: 'Event deleted' });
    }
    setIsDeleting(false);
    setSelectedEvent(null);
  };

  const handleSave = (updatedEvent: Event) => {
    if (firestore && updatedEvent.id) {
      const eventRef = doc(firestore, 'events', updatedEvent.id);
      updateDocumentNonBlocking(eventRef, updatedEvent);
      toast({ title: 'Event updated' });
    }
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleCreate = (newEventData: Omit<Event, 'id' | 'creatorId' | 'createdAt'>) => {
    if (!authUser || !firestore) return;
    const newDocRef = doc(collection(firestore, 'events'));
    const newEvent = {
      ...newEventData,
      id: newDocRef.id,
      creatorId: authUser.uid,
      views: 0,
      createdAt: serverTimestamp(),
    };
    setDocumentNonBlocking(newDocRef, newEvent, {});
    toast({ title: 'Event created' });
    setIsCreating(false);
  };

  const isLoading = isAppLoading || isUserLoading || isCreatedEventsLoading || isAttendingEventsLoading;

  if (isLoading || !userProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-5xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <Avatar className="h-24 w-24 text-4xl">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since{' '}
                  {userProfile.memberSince.toDate().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
               <Button onClick={() => setIsCreating(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            <Tabs defaultValue="created" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="attending">Events Attending</TabsTrigger>
                <TabsTrigger value="created">Events Created</TabsTrigger>
              </TabsList>
              <TabsContent value="attending" className="mt-6 space-y-4">
                {(attendingEvents || []).map((event) => (
                  <ProfileEventCard
                    key={event.id}
                    event={event}
                    isCreator={false}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    attendeeCount={attendeeCounts[event.id] || 0}
                  />
                ))}
                {(!attendingEvents || attendingEvents.length === 0) && (
                  <Card className="flex items-center justify-center h-40 bg-secondary border-dashed">
                    <p className="text-center text-muted-foreground">
                      You are not attending any events yet.
                    </p>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="created" className="mt-6 space-y-4">
                {(createdEvents || []).map((event) => (
                  <ProfileEventCard
                    key={event.id}
                    event={event}
                    isCreator={true}
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDelete(event)}
                    attendeeCount={attendeeCounts[event.id] || 0}
                  />
                ))}
                {(!createdEvents || createdEvents.length === 0) && (
                   <Card className="flex items-center justify-center h-40 bg-secondary border-dashed">
                    <p className="text-center text-muted-foreground">
                      You have not created any events yet.
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

       <CreateEventForm
        open={isCreating}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
          }
        }}
        onCreate={handleCreate}
      />

      <EditEventForm
        event={selectedEvent}
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null);
            setIsEditing(false);
          }
        }}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={isDeleting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null);
            setIsDeleting(false);
          }
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}
