// Utility to check if user profile is incomplete (has empty required fields)
// This logic is now strictly based on backend-musical/models/User.js
export function isUserProfileIncomplete(user) {
  if (!user) return true;
  // List of required fields for a complete user profile (from backend model)
  const requiredFields = [
    'name', 'email', 'phone', 'pincode', 'genres', 'imageUrl', 'securityQuestions'
  ];
  for (const field of requiredFields) {
    if (
      user[field] === undefined ||
      user[field] === null ||
      (typeof user[field] === 'string' && user[field].trim() === '') ||
      (Array.isArray(user[field]) && user[field].length === 0)
    ) {
      return true;
    }
  }
  // At least 1 genre and profile image (not default randomuser.me)
  if (
    !user.genres || user.genres.length === 0 ||
    !user.imageUrl || user.imageUrl.trim() === '' ||
    user.imageUrl.includes('randomuser.me/api/portraits/')
  ) {
    return true;
  }
  // Security questions: must be array of at least 1 with non-empty questionIdx and answer
  if (!Array.isArray(user.securityQuestions) || user.securityQuestions.length === 0) {
    return true;
  }
  for (const sq of user.securityQuestions) {
    if (!sq.questionIdx || !sq.answer || String(sq.answer).trim() === '') {
      return true;
    }
  }
  return false;
}
