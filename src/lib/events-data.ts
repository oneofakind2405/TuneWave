
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
    description: 'Prepare for an unforgettable evening dedicated to the raw and authentic sounds of indie rock. This event showcases a carefully curated lineup of the most exciting up-and-coming bands from the local and national scene. Expect a diverse range of styles, from jangly guitar pop to introspective shoegaze and high-energy post-punk. The atmosphere will be electric, filled with passionate music lovers and the thrill of discovering your next favorite band. We pride ourselves on creating an intimate setting where the connection between artist and audience is palpable. This is more than just a concert; it\'s a celebration of independent music and the vibrant community that supports it. Don\'t miss your chance to be part of a night of groundbreaking performances.',
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
    description: 'Get ready to dance and sing your heart out with the biggest names in pop music! "Pop Sensations Live" brings together a spectacular lineup of chart-topping artists for a high-energy concert experience you won\'t forget. Featuring stunning choreography, dazzling light shows, and incredible vocal performances, this event is a feast for the senses. You\'ll hear all the latest hits that have been dominating the airwaves, along with some fan-favorite classics. The arena will be buzzing with excitement as thousands of fans come together to celebrate the power of pop. This is the perfect night out for anyone who loves catchy melodies, infectious beats, and the shared joy of a massive singalong. Grab your friends and get your tickets for the ultimate pop party of the year!',
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
    description: 'Embark on a mesmerizing journey through the vast soundscapes of electronic music. "Electronic Odyssey" features a lineup of world-renowned DJs who will guide you through an immersive experience of sound and light. From the deep, hypnotic rhythms of techno to the euphoric melodies of trance and the complex beats of drum and bass, this event covers the full spectrum of electronic genres. The venue will be transformed with state-of-the-art visuals, including stunning laser shows and projection mapping that will transport you to another dimension. This is a night for true connoisseurs of electronic music and those looking to lose themselves on the dance floor. The energy will be relentless, the bass will be powerful, and the memories will last a lifetime. Join us for a transcendent night of music and unity.',
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
    description: 'Experience the magic of music in its purest form at "Acoustic Sessions." This intimate evening showcases a collection of talented singer-songwriters, armed with nothing but their voices and their instruments. The focus is on storytelling and raw emotion, creating a deeply personal and moving atmosphere. You\'ll hear heartfelt lyrics, beautiful melodies, and the intricate musicianship that often gets lost in larger productions. The cozy setting of The Coffee House provides the perfect backdrop for this stripped-down experience, allowing for a genuine connection between the artists and the audience. It\'s a chance to slow down, listen closely, and appreciate the craft of songwriting. This event is perfect for those who cherish authentic musical moments and the power of a well-told story.',
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
    description: 'Brace yourself for a full-day onslaught of pure, unadulterated metal. "Metal Mayhem Fest" brings together the heaviest and most aggressive bands from the worlds of death metal, thrash, and hardcore. From blistering guitar solos and thunderous blast beats to guttural vocals and brutal breakdowns, this festival is not for the faint of heart. The mosh pit will be churning, the headbanging will be non-stop, and the energy will be off the charts. We\'ve gathered a lineup that represents the best of the genre\'s past, present, and future. This is a chance to witness legendary acts and discover new, ferocious talent all in one place. Join the legions of metalheads for a day of intense music, camaraderie, and pure mayhem. Ear protection is highly recommended!',
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
    description: 'Travel back to a retro-futuristic world of neon grids and digital horizons with "Synthwave Sunset." This unique outdoor event pairs the nostalgic, analog sounds of synthwave with a breathtaking sunset over the ocean. As the sky changes colors, you\'ll be enveloped in a soundscape filled with dreamy synthesizers, driving retro beats, and cinematic melodies inspired by 80s film scores. The atmosphere is all about style and nostalgia, a perfect blend of modern electronica and vintage aesthetics. It\'s an evening designed for chilling out, soaking in the views, and getting lost in the music. Whether you\'re a long-time fan of the genre or just looking for a unique musical experience, this event promises a perfect evening of cool vibes and stunning scenery. Dress in your best retro attire and join us for an unforgettable night.',
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
    description: 'Get ready for a night of raw, unfiltered rock and roll. "Garage Rock Revival" celebrates the loud, energetic, and beautifully messy sound that started in suburban garages. Featuring three bands that embody the spirit of the genre, this show is all about fuzzy guitars, pounding drums, and catchy, rebellious anthems. Forget polished productions; this is music with dirt under its fingernails. The Dive Bar is the perfect setting for this no-frills rock show, where the beer is cheap and the music is loud. It\'s a throwback to a simpler time in rock music, focusing on passion and energy above all else. If you love the sound of The Stooges, The Sonics, or The White Stripes, this is a night you absolutely cannot miss. Come ready to move and make some noise.',
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
    description: 'Dive headfirst into the chaotic and colorful world of hyperpop. This rave is an explosive celebration of the internet-fueled genre that mashes up pop, EDM, and experimental sounds into something completely new and exhilarating. Expect pitched-up vocals, distorted bass, and a relentless stream of high-energy beats that will keep you dancing until the early hours. The visuals will be just as wild as the music, with glitchy projections, strobing lights, and a sensory overload of internet culture. This event is a space for total freedom of expression, where weirdness is celebrated and the energy is always at maximum. It\'s a glimpse into the future of pop music, happening right now. If you\'re looking for a party that is unpredictable, exciting, and completely over-the-top, this is where you need to be.',
    location: 'Club Neon, Las Vegas, NV',
    date: '2024-11-09',
    time: '11:00 PM',
    category: 'Electronic',
    imageUrl: 'https://picsum.photos/seed/hyperpop-rave/400/300',
    imageHint: 'rave party',
  },
];
