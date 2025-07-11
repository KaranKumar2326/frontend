// Utility to check if artist profile is incomplete (has empty required fields)
export function isArtistProfileIncomplete(artist) {
  if (!artist) return true;
  // List of required fields for a complete profile (excluding exp, description, preferredLocation)
  const requiredFields = [
    'name', 'email', 'phone', 'stageName',
    'pricing', 'imageUrl',
    'genres', 'instruments', 'coverImage', 'securityQuestions', 'pincode'
  ];
  for (const field of requiredFields) {
    const value = artist[field];
    if (field === 'securityQuestions') {
      // Accept non-empty array with all answers non-empty
      if (
        !Array.isArray(value) ||
        value.length === 0 ||
        value.some(q => !q || !q.answer || (typeof q.answer === 'string' && q.answer.trim() === ''))
      ) {
        return true;
      }
    } else if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return true;
    }
  }
  return false;
}
