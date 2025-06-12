const mongoose = require('mongoose');

const jammingSessionSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['Rock', 'Jazz', 'Hip-Hop', 'Pop', 'Acoustic', 'Indie', 'Other']
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  coverImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for formatted date display
jammingSessionSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for time range display
jammingSessionSchema.virtual('timeRange').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for capacity display
jammingSessionSchema.virtual('capacityDisplay').get(function() {
  return `${this.currentAttendees}/${this.maxCapacity}`;
});

const JammingSession = mongoose.model('JammingSession', jammingSessionSchema);

module.exports = JammingSession;