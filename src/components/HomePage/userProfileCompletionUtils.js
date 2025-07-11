// Utility to check user profile completeness and return checklist for WelcomePopup
// Based on backend-musical/models/User.js

// Checklist fields strictly based on backend-musical/models/User.js
const REQUIRED_FIELDS = [
  'name',
  'email',
  'phone',
  'pincode',
  'genres',
  'address',
  'imageUrl',
  'securityQuestions',
];

const fieldLabels = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  pincode: 'Pincode',
  genres: 'Genres',
  address: 'Address',
  imageUrl: 'Profile Image',
  securityQuestions: 'Security Questions',
};

// Returns array: [{ field, completed, label }]
export function getUserProfileCompletionChecklist(user) {
  if (!user) return [];
  return REQUIRED_FIELDS.map(field => {
    let completed = false;
    if (field === 'genres') {
      completed = Array.isArray(user.genres) && user.genres.length > 0;
    } else if (field === 'securityQuestions') {
      completed = Array.isArray(user.securityQuestions) && user.securityQuestions.length > 0 && user.securityQuestions.every(q => q.answer && q.answer.trim() !== '' && q.questionIdx && q.questionIdx.trim() !== '');
    } else if (field === 'imageUrl') {
      completed = !!user.imageUrl && !user.imageUrl.includes('randomuser.me/api/portraits/');
    } else {
      completed = !!user[field] && user[field].toString().trim() !== '';
    }
    return { field, completed, label: fieldLabels[field] };
  });
}


// Returns percentage (0-100)
export function getUserProfileCompletionPercentage(user) {
  const checklist = getUserProfileCompletionChecklist(user);
  if (!checklist.length) return 0;
  const completedCount = checklist.filter(item => item.completed).length;
  return Math.round((completedCount / checklist.length) * 100);
}

export { fieldLabels as userFieldLabels };
