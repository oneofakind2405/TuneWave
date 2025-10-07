export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  category: 'Rock' | 'Pop' | 'Electronic';
  imageUrl: string;
  imageHint: string;
};

export const events: Event[] = [
  {
    id: '1',
    title: 'Indie Rock Night',
    description: 'An evening of groundbreaking indie rock from the best up-and-coming bands.',
    location: 'The Underground, New York, NY',
    date: '2024-09-15',
    time: '8:00 PM',
    category: 'Rock',
    imageUrl: 'https://picsum.photos/seed/indie-rock/400/300',
    imageHint: 'rock band',
  },
  {
    id: '2',
    title: 'Pop Sensations Live',
    description: 'Dance the night away with the latest hits from chart-topping pop stars.',
    location: 'Arena One, Los Angeles, CA',
    date: '2024-09-20',
    time: '7:30 PM',
    category: 'Pop',
    imageUrl: 'https://picsum.photos/seed/pop-live/400/300',
    imageHint: 'pop concert',
  },
  {
    id: '3',
    title: 'Electronic Odyssey',
    description: 'A journey through sound with world-renowned DJs and mesmerizing visuals.',
    location: 'The Warehouse, Chicago, IL',
    date: '2024-09-28',
    time: '10:00 PM',
    category: 'Electronic',
    imageUrl: 'https://picsum.photos/seed/electronic-dj/400/300',
    imageHint: 'dj booth',
  },
  {
    id: '4',
    title: 'Acoustic Sessions',
    description: 'An intimate night of acoustic performances by talented singer-songwriters.',
    location: 'The Coffee House, San Francisco, CA',
    date: '2024-10-05',
    time: '7:00 PM',
    category: 'Pop',
    imageUrl: 'https://picsum.photos/seed/acoustic-guitar/400/300',
    imageHint: 'acoustic guitar',
  },
  {
    id: '5',
    title: 'Metal Mayhem Fest',
    description: 'Headbang to the heaviest riffs and most brutal breakdowns in metal.',
    location: 'The Foundry, Philadelphia, PA',
    date: '2024-10-12',
    time: '6:00 PM',
    category: 'Rock',
    imageUrl: 'https://picsum.photos/seed/metal-fest/400/300',
    imageHint: 'metal band',
  },
  {
    id: '6',
    title: 'Synthwave Sunset',
    description: 'Retro-futuristic sounds as the sun goes down. A perfect blend of nostalgia and modern electronica.',
    location: 'Ocean View Park, Miami, FL',
    date: '2024-10-18',
    time: '6:30 PM',
    category: 'Electronic',
    imageUrl: 'https://picsum.photos/seed/synthwave-sunset/400/300',
    imageHint: 'synthwave aesthetic',
  },
    {
    id: '7',
    title: 'Garage Rock Revival',
    description: 'Raw, energetic, and loud. Experience the revival of garage rock with three exciting bands.',
    location: 'Dive Bar, Austin, TX',
    date: '2024-11-02',
    time: '9:00 PM',
    category: 'Rock',
    imageUrl: 'https://picsum.photos/seed/garage-rock/400/300',
    imageHint: 'rock band garage',
  },
  {
    id: '8',
    title: 'Hyperpop Rave',
    description: 'An explosive mix of pop, EDM, and experimental sounds. Get ready for a high-energy night.',
    location: 'Club Neon, Las Vegas, NV',
    date: '2024-11-09',
    time: '11:00 PM',
    category: 'Electronic',
    imageUrl: 'https://picsum.photos/seed/hyperpop-rave/400/300',
    imageHint: 'rave party',
  },
];
