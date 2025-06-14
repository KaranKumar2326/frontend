// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const signupRoutes = require('./routes/signupRoutes');
// const artistRoutes = require('./routes/artistRoutes');

// const app = express();
// const PORT = 3001;


// // Middleware


// app.use(cors());
// app.use(bodyParser.json());
// app.get('/cors', (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');

// })

// // Database connection
// mongoose.connect('mongodb://localhost:27017/swigDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// // Routes
// app.use('/api', signupRoutes);
// app.use('/api/artists', artistRoutes);

// // Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Import dotenv to handle environment variables
const cors = require('cors');
const jammingSessions = require('./routes/jammingSessions');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');  // Import login routes
const artistRoutes = require('./routes/artistRoutes');
const authRoutes = require('./routes/authRoutes');  // Import auth routes for JWT authentication
const userRoutes = require('./routes/userRoutes');  // Import user routes
const authMiddleware = require('./middlewares/authMiddleware'); // JWT authentication middleware
const request = require('request'); // Add this at the top with other requires

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

// Handle preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', true);
  res.status(200).end();
});

// Apply CORS middleware with specific options
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for all responses
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Skip OPTIONS requests (already handled)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Parse JSON bodies
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Example route to test CORS (optional)
app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('CORS is enabled');
});

// Middleware for logging requests (for debugging purposes)
app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.url}`);
  next();
});

// Database connection
mongoose.connect( 'mongodb://localhost:27017/swigDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
// app.use('/api/auth', authRoutes);  // Register signup and login routes (from signupRoutes.js)
// login route
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/users', userRoutes);    // User profile routes
app.use('/api/artists', artistRoutes);  // Artist routes
// Add this with your other route imports


// Proxy endpoint for images (CORS fix for Google Drive)
app.get('/api/proxy-image', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('No url provided');
  request
    .get(url)
    .on('response', function(response) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Content-Type', response.headers['content-type']);
    })
    .pipe(res);
});

// Add this with your other route middleware
app.use('/api/jamming-sessions', jammingSessions);
// Example of protected route using JWT authentication
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user // Information from the JWT payload will be accessible here
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
