import { Header } from '@/components/header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { events } from '@/lib/events-data';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function ProfileEventCard({ event }: { event: typeof events[0] }) {
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
                        <Badge variant="outline" className="border-primary text-primary">{event.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">{event.description.substring(0, 100)}...</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                        <div className='flex items-center gap-2'>
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>{event.time}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Attendees: Coming soon</span>
                        </div>
                        <Button asChild variant="secondary">
                            <Link href="#">View</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
  const user = {
    name: 'Liam Ottley',
    email: 'liamottley@gmail.com',
    memberSince: '2025-07-01',
    initials: 'LO',
  };

  const createdEvents = events.slice(0, 3);
  const attendingEvents = events.slice(3, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-20 w-20 text-3xl">
              <AvatarFallback className="bg-primary text-primary-foreground">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="attending">Events Attending</TabsTrigger>
              <TabsTrigger value="created">Events Created</TabsTrigger>
            </TabsList>
            <TabsContent value="attending" className="mt-6 space-y-4">
              {attendingEvents.map(event => (
                  <ProfileEventCard key={event.id} event={event} />
              ))}
               {attendingEvents.length === 0 && <p className='text-center text-muted-foreground'>You are not attending any events yet.</p>}
            </TabsContent>
            <TabsContent value="created" className="mt-6 space-y-4">
               {createdEvents.map(event => (
                  <ProfileEventCard key={event.id} event={event} />
              ))}
               {createdEvents.length === 0 && <p className='text-center text-muted-foreground'>You have not created any events yet.</p>}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
