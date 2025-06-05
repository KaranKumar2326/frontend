import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../public/loginBackground.png'; // Importing background image
import NavigationBar from './NavigationBar';
import { Navigation } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    experience: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pincode: '', // Added pincode to formData state
    geoLocation: null, // Added geoLocation to formData state
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, geoLocation: { latitude, longitude } }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Sign Up successful');
        // Redirect or navigate to login page after successful sign up
      } else {
        toast.error(result.message || 'Sign Up failed');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <>
      <NavigationBar/>
     <div className='signup' style={styles.signup}> {/* Added className for styling */}
        <div style={styles.container}>
          <div style={styles.formWrapper}> {/* Added a wrapper div for the form */}
            <h1>Create an Account</h1>
            <div style={styles.form}> {/* Changed from <form> to <div> */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={formData.genre}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="number"
                name="experience"
                placeholder="Experience (Number)"
                value={formData.experience}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />  
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <button onClick={handleSubmit} style={styles.button}>Sign Up</button>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#6C2BD9', textDecoration: 'underline', fontWeight: 500 }}>Log In</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
};
  
const styles = {
  
  signup: {
    backgroundImage: `url(${backgroundImage})`, // Added background image
    backgroundSize: 'cover', // Ensures the image covers the entire container
    backgroundPosition: 'center', // Centers the image
  },
  container: {
    width: '100%',
    height: '100vh', // Ensures the background covers the entire viewport height
    margin: '0',
    padding: '0',
    backgroundImage: "url('/public/loginBackground.png')", // Background image applied to the entire page
    backgroundSize: 'cover', // Ensures the image covers the entire container
    backgroundPosition: 'center', // Centers the image
    display: 'flex',
    justifyContent: 'center', // Centers the form horizontally
    alignItems: 'center', // Centers the form vertically
  },
  formWrapper: {
    backgroundColor: '#fff', // Changed to solid white background
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  button: {
    padding: '12px 0',
    backgroundColor: '#6C2BD9',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default SignUp;
