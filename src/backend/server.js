const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const signupRoutes = require('./routes/signupRoutes');

const app = express();
const PORT = 3001;


// Middleware


app.use(cors());
app.use(bodyParser.json());
app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

})

// Database connection
mongoose.connect('mongodb://localhost:27017/swigDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Routes
app.use('/api/signup', signupRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));