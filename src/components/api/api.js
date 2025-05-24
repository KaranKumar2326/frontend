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
 * e.g., '/api/artists/:id' with params = { id: 1 } becomes '/api/artists/1'
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
  '/api/artists/:id': {
    GET: async ({ id }) => {
      const artistId = parseInt(id, 10);
      return getArtistWithDetails(artistId);
    },
  },
  '/api/bookings': {
    POST: async (data) => {
      // In a real app, this would add to the database
      // For mock purposes, we'll just return the data with an ID
      return {
        ...data,
        id: bookings.length + 1,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    },
  },
  '/api/artists': {
    POST: async (data) => {
      // Mock creating a new artist
      return {
        ...data,
        id: artists.length + 1,
        rating: 0,
        available: true,
      };
    },
  },
  '/api/testimonials/featured': {
    GET: async () => testimonials.filter(t => t.featured),
  },
};
