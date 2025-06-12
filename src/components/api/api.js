import { 
  getFeaturedArtists, 
  getArtistWithDetails, 
  searchArtists, 
  genres, 
  instruments, 
  users, 
  artists, 
  bookings, 
  testimonials
} from '../data/mockData';

/**
 * Sleep utility for simulating API delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Base API request function that simulates network delay
 */
export async function apiRequest(
  endpoint, 
  method = 'GET',
  data
) {
  // Simulate network delay
  await sleep(300);
  
  // Use the mockApiHandlers to get the response
  const handler = mockApiHandlers[endpoint]?.[method];
  
  if (!handler) {
    throw new Error(`No handler for ${method} ${endpoint}`);
  }
  
  // Execute the mock handler
  const result = await handler(data);
  return result;
}

/**
 * Query client factory for React Query
 */
export function createQueryFn() {
  return async ({ queryKey }) => {
    const [endpoint, params] = queryKey;
    
    // Handle parameterized endpoints
    const processedEndpoint = processEndpoint(endpoint, params);
    
    // Call the apiRequest function
    return apiRequest(processedEndpoint);
  };
}

/**
 * Process endpoints with parameters
 * e.g., '/api/artists/:_id' with params = { _id: 1 } becomes '/api/artists/1'
 */
function processEndpoint(endpoint, params) {
  if (!params) return endpoint;
  
  let processedEndpoint = endpoint;
  
  // Replace path parameters
  if (endpoint.includes(':') && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      processedEndpoint = processedEndpoint.replace(`:${key}`, String(value));
    });
  }
  
  return processedEndpoint;
}

/**
 * Mock API handlers
 */
const mockApiHandlers = {
  '/api/genres': {
    GET: async () => genres,
  },
  '/api/instruments': {
    GET: async () => instruments,
  },
  '/api/artists/featured': {
    GET: async () => getFeaturedArtists(6),
  },
  '/api/artists/search': {
    GET: async (filters) => searchArtists(filters),
  },
  '/api/artists/:_id': {
    GET: async ({ _id }) => {
      const artistId = _id;
      return getArtistWithDetails(artistId);
    },
  },
  '/api/bookings': {
    POST: async (data) => {
      // In a real app, this would add to the database
      // For mock purposes, we'll just return the data with an _id
      return {
        ...data,
        _id: bookings.length + 1,
      };
    },
  },
  '/api/artists': {
    GET: async () => artists.map(a => getArtistWithDetails(a._id)).filter(Boolean),
    POST: async (data) => {
      // Mock creating a new artist
      return {
        ...data,
        _id: artists.length + 1,
        rating: 0,
        available: true,
      };
    },
  },
  '/api/testimonials/featured': {
    GET: async () => testimonials.filter(t => t.featured),
  },
  '/api/artists/global': {
    GET: async () => artists.map(a => getArtistWithDetails(a.id)).filter(Boolean),
    
  },
};