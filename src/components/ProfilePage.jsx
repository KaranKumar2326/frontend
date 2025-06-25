// import React, { useState } from 'react';
// import './ProfilePage.css';

// const ProfilePage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Updated Profile:', formData);
//     alert('Profile updated successfully!');
//   };

//   return (
//     <div className="profile-page">
//       <h2>Edit Profile</h2>
//       <form onSubmit={handleSubmit} className="profile-form">
//         <label>
//           Name:
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Email:
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Phone:
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label>
//           Address:
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// };

// export default ProfilePage;