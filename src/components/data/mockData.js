// Sample images for artists (public domain or licensed images would be used in production)
const artistImageUrls = [
  'https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80',
  'https://images.unsplash.com/photo-1525908106172-c1164e8ef28c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1529518969858-8baa65152fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
];

// Create sample data
export const users = [
  {
    id: 1,
    username: 'sarahjohnson',
    email: 'sarah@example.com',
    password: 'hashedpassword1',
    fullName: 'Sarah Johnson',
    userType: 'artist',
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: 2,
    username: 'michaelwilliams',
    email: 'michael@example.com',
    password: 'hashedpassword2',
    fullName: 'Michael Williams',
    userType: 'artist',
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: 3,
    username: 'emmadavis',
    email: 'emma@example.com',
    password: 'hashedpassword3',
    fullName: 'Emma Davis',
    userType: 'artist',
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: 4,
    username: 'danielsmith',
    email: 'daniel@example.com',
    password: 'hashedpassword4',
    fullName: 'Daniel Smith',
    userType: 'artist',
    createdAt: new Date(2023, 3, 22).toISOString(),
  },
  {
    id: 5,
    username: 'sophiabrown',
    email: 'sophia@example.com',
    password: 'hashedpassword5',
    fullName: 'Sophia Brown',
    userType: 'artist',
    createdAt: new Date(2023, 4, 12).toISOString(),
  },
  {
    id: 6,
    username: 'jameswilson',
    email: 'james@example.com',
    password: 'hashedpassword6',
    fullName: 'James Wilson',
    userType: 'artist',
    createdAt: new Date(2023, 5, 3).toISOString(),
  },
  {
    id: 7,
    username: 'jennifermichael',
    email: 'jennifer@example.com',
    password: 'hashedpassword7',
    fullName: 'Jennifer Michael',
    userType: 'client',
    createdAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: 8,
    username: 'robertlee',
    email: 'robert@example.com',
    password: 'hashedpassword8',
    fullName: 'Robert Lee',
    userType: 'client',
    createdAt: new Date(2023, 2, 15).toISOString(),
  },
  {
    id: 9,
    username: 'elizabethharris',
    email: 'elizabeth@example.com',
    password: 'hashedpassword9',
    fullName: 'Elizabeth Harris',
    userType: 'client',
    createdAt: new Date(2023, 3, 10).toISOString(),
  },
];

export const artists = [
  {
    id: 1,
    userId: 1,
    stageName: 'Sarah Johnson',
    bio: 'Award-winning classical pianist with over 15 years of performing experience. Specializes in Mozart, Chopin, and Debussy compositions.',
    imageUrl: artistImageUrls[0],
    pricePerHour: 150,
    location: 'New York, NY',
    rating: 4.9,
    available: true,
  },
  {
    id: 2,
    userId: 2,
    stageName: 'Michael Williams',
    bio: 'Versatile jazz saxophonist performing with top orchestras across the country. Perfect for elegant dinner parties and upscale events.',
    imageUrl: artistImageUrls[1],
    pricePerHour: 180,
    location: 'Chicago, IL',
    rating: 4.8,
    available: true,
  },
  {
    id: 3,
    userId: 3,
    stageName: 'Emma Davis',
    bio: 'Classically trained violinist with a modern twist. Combines traditional pieces with contemporary arrangements for a unique experience.',
    imageUrl: artistImageUrls[2],
    pricePerHour: 130,
    location: 'Boston, MA',
    rating: 4.7,
    available: true,
  },
  {
    id: 4,
    userId: 4,
    stageName: 'Daniel Smith',
    bio: 'Professional guitarist skilled in multiple genres including Spanish flamenco, classical, and acoustic pop covers.',
    imageUrl: artistImageUrls[3],
    pricePerHour: 120,
    location: 'Austin, TX',
    rating: 4.9,
    available: true,
  },
  {
    id: 5,
    userId: 5,
    stageName: 'Sophia Brown',
    bio: 'Enchanting harpist creating magical atmospheres for weddings and special events. Extensive repertoire from Celtic to contemporary music.',
    imageUrl: artistImageUrls[4],
    pricePerHour: 160,
    location: 'San Francisco, CA',
    rating: 4.8,
    available: true,
  },
  {
    id: 6,
    userId: 6,
    stageName: 'James Wilson',
    bio: 'Captivating opera tenor with international performance experience. Perfect for adding sophistication and drama to your upscale event.',
    imageUrl: artistImageUrls[5],
    pricePerHour: 200,
    location: 'Miami, FL',
    rating: 4.9,
    available: true,
  },
];

export const genres = [
  { id: 1, name: 'Classical' },
  { id: 2, name: 'Jazz' },
  { id: 3, name: 'Pop' },
  { id: 4, name: 'Rock' },
  { id: 5, name: 'Folk' },
  { id: 6, name: 'R&B' },
  { id: 7, name: 'Electronic' },
  { id: 8, name: 'Country' },
  { id: 9, name: 'Hip Hop' },
  { id: 10, name: 'Opera' },
];

export const instruments = [
  { id: 1, name: 'Piano' },
  { id: 2, name: 'Violin' },
  { id: 3, name: 'Guitar' },
  { id: 4, name: 'Saxophone' },
  { id: 5, name: 'Drums' },
  { id: 6, name: 'Harp' },
  { id: 7, name: 'Flute' },
  { id: 8, name: 'Cello' },
  { id: 9, name: 'Trumpet' },
  { id: 10, name: 'Voice' },
];

export const artistGenres = [
  { id: 1, artistId: 1, genreId: 1 }, // Sarah - Classical
  { id: 2, artistId: 1, genreId: 2 }, // Sarah - Jazz
  { id: 3, artistId: 2, genreId: 2 }, // Michael - Jazz
  { id: 4, artistId: 2, genreId: 6 }, // Michael - R&B
  { id: 5, artistId: 3, genreId: 1 }, // Emma - Classical
  { id: 6, artistId: 3, genreId: 3 }, // Emma - Pop
  { id: 7, artistId: 4, genreId: 3 }, // Daniel - Pop
  { id: 8, artistId: 4, genreId: 4 }, // Daniel - Rock
  { id: 9, artistId: 4, genreId: 5 }, // Daniel - Folk
  { id: 10, artistId: 5, genreId: 1 }, // Sophia - Classical
  { id: 11, artistId: 5, genreId: 5 }, // Sophia - Folk
  { id: 12, artistId: 6, genreId: 1 }, // James - Classical
  { id: 13, artistId: 6, genreId: 10 }, // James - Opera
];

export const artistInstruments = [
  { id: 1, artistId: 1, instrumentId: 1 }, // Sarah - Piano
  { id: 2, artistId: 2, instrumentId: 4 }, // Michael - Saxophone
  { id: 3, artistId: 3, instrumentId: 2 }, // Emma - Violin
  { id: 4, artistId: 4, instrumentId: 3 }, // Daniel - Guitar
  { id: 5, artistId: 5, instrumentId: 6 }, // Sophia - Harp
  { id: 6, artistId: 6, instrumentId: 10 }, // James - Voice
];

export const bookings = [
  {
    id: 1,
    clientId: 7,
    artistId: 1,
    eventDate: new Date(2023, 11, 15).toISOString(),
    startTime: '18:00',
    endTime: '21:00',
    location: 'The Plaza Hotel, New York',
    eventType: 'Wedding',
    notes: 'Please arrive 30 minutes early for setup.',
    status: 'confirmed',
    createdAt: new Date(2023, 10, 5).toISOString(),
  },
  {
    id: 2,
    clientId: 8,
    artistId: 2,
    eventDate: new Date(2023, 11, 20).toISOString(),
    startTime: '19:00',
    endTime: '22:00',
    location: 'The Drake Hotel, Chicago',
    eventType: 'Corporate Party',
    notes: 'Business casual attire required.',
    status: 'confirmed',
    createdAt: new Date(2023, 10, 10).toISOString(),
  },
  {
    id: 3,
    clientId: 9,
    artistId: 3,
    eventDate: new Date(2023, 12, 5).toISOString(),
    startTime: '17:00',
    endTime: '19:00',
    location: 'Boston Symphony Hall',
    eventType: 'Birthday Party',
    notes: 'Looking for a mix of classical and contemporary pieces.',
    status: 'pending',
    createdAt: new Date(2023, 10, 15).toISOString(),
  },
];

export const testimonials = [
  {
    id: 1,
    clientId: 7,
    artistId: 1,
    clientName: 'Jennifer & Michael',
    rating: 5,
    content: 'Sarah made our wedding day truly magical. Her piano performance during our ceremony brought tears to everyone\'s eyes. Highly recommend!',
    eventType: 'Wedding',
    featured: true,
    createdAt: new Date(2023, 6, 20).toISOString(),
  },
  {
    id: 2,
    clientId: 8,
    artistId: 2,
    clientName: 'Robert Lee',
    rating: 5,
    content: 'Michael\'s saxophone performance elevated our corporate event to another level. Our clients were impressed and the atmosphere was perfect.',
    eventType: 'Corporate Event',
    featured: true,
    createdAt: new Date(2023, 7, 15).toISOString(),
  },
  {
    id: 3,
    clientId: 9,
    artistId: 3,
    clientName: 'Elizabeth Harris',
    rating: 4,
    content: 'Emma\'s violin playing was beautiful for my mother\'s 70th birthday celebration. She was professional and accommodating with our requests.',
    eventType: 'Birthday Party',
    featured: true,
    createdAt: new Date(2023, 8, 10).toISOString(),
  },
];

// Helper function to get artist with details
export function getArtistWithDetails(artistId) {
  const artist = artists.find(a => a.id === artistId);
  if (!artist) return undefined;

  const user = users.find(u => u.id === artist.userId);
  if (!user) return undefined;

  const artistGenreIds = artistGenres
    .filter(ag => ag.artistId === artistId)
    .map(ag => ag.genreId);
  
  const artistInstrumentIds = artistInstruments
    .filter(ai => ai.artistId === artistId)
    .map(ai => ai.instrumentId);

  const artistGenresList = genres.filter(g => artistGenreIds.includes(g.id));
  const artistInstrumentsList = instruments.filter(i => artistInstrumentIds.includes(i.id));

  return {
    ...artist,
    user,
    genres: artistGenresList,
    instruments: artistInstrumentsList,
  };
}

// Helper function to get featured artists
export function getFeaturedArtists(limit = 6) {
  const featuredArtists = [];
  
  for (const artist of artists) {
    if (featuredArtists.length >= limit) break;
    
    const artistWithDetails = getArtistWithDetails(artist.id);
    if (artistWithDetails) {
      featuredArtists.push(artistWithDetails);
    }
  }
  
  return featuredArtists;
}

// Helper function to search artists
export function searchArtists(filters) {
  let filteredArtists = artists.map(artist => getArtistWithDetails(artist.id)).filter(Boolean);
  
  // Filter by genre
  if (filters.genre) {
    filteredArtists = filteredArtists.filter(artist => 
      artist.genres.some(genre => genre.name.toLowerCase() === filters.genre.toLowerCase())
    );
  }
  
  // Filter by instrument
  if (filters.instrument) {
    filteredArtists = filteredArtists.filter(artist => 
      artist.instruments.some(instrument => instrument.name.toLowerCase() === filters.instrument.toLowerCase())
    );
  }
  
  // Filter by price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number);
    filteredArtists = filteredArtists.filter(artist => 
      artist.pricePerHour >= min && artist.pricePerHour <= max
    );
  }
  
  // Filter by location
  if (filters.location) {
    filteredArtists = filteredArtists.filter(artist => 
      artist.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  // Sort artists
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        filteredArtists.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price-desc':
        filteredArtists.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'rating-desc':
        filteredArtists.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }
  
  return filteredArtists;
}