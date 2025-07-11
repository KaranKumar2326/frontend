// Utility to calculate profile completion percentage for artist or user
export function getProfileCompletionPercentage(profile, role = 'artist') {
  if (!profile) return 0;
let mainFields = [
  'name', 'email', 'phone', 'stageName',
  'pricing', 'imageUrl',
  'genres', 'instruments', 'coverImage', 'securityQuestions', 'pincode'
];
  let otherFields = [];
  if (role === 'artist') {
    otherFields = [
      'bio', 'description', 'preferredLocation', 'address', 'city', 'state', 'country',
      'galleryImages', 'exp', 'socialMediaLinks'
    ];
  } else {
    // User fields (customize as needed)
    mainFields = ['name', 'email', 'phone', 'address', 'genres', 'imageUrl'];
    otherFields = [];
  }
  let mainCompleted = 0;
  let otherCompleted = 0;
  mainFields.forEach(field => {
    const value = profile[field];
    if (field === 'securityQuestions') {
      if (Array.isArray(value) && value.length > 0 && value.every(q => q && q.answer && (typeof q.answer !== 'string' || q.answer.trim() !== ''))) {
        mainCompleted++;
      }
    } else if (Array.isArray(value)) {
      if (value.length > 0) mainCompleted++;
    } else if (value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '')) {
      mainCompleted++;
    }
  });
  otherFields.forEach(field => {
    const value = profile[field];
    if (Array.isArray(value)) {
      if (value.length > 0) otherCompleted++;
    } else if (value !== undefined && value !== null && (typeof value !== 'string' || value.trim() !== '')) {
      otherCompleted++;
    }
  });
  const mainWeight = 0.6;
  const otherWeight = 0.4;
  // Adjust mainPercent and otherPercent so that mainFields always contribute exactly 60% regardless of their count
  const mainPercent = mainFields.length > 0 ? (mainCompleted / mainFields.length) * 60 : 0;
  const otherPercent = otherFields.length > 0 ? (otherCompleted / otherFields.length) * 40 : 0;
  return Math.round(mainPercent + otherPercent);
}
