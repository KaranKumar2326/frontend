import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../../public/loginBackground.png';
import { useNavigate } from 'react-router-dom';

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
    pincode: '', 
    geoLocation: null,
    role: 'User', // Default role
  });

  const [isArtist, setIsArtist] = useState(false); // Toggle state for User/Artist

  // Get user's current location using geolocation API
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = () => {
    setIsArtist((prev) => !prev);
    setFormData((prev) => ({ ...prev, role: isArtist ? 'User' : 'Artist' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = {
      ...formData,
      geoLocation: formData.geoLocation ? formData.geoLocation : null,
    };

    try {
      toast.info('Processing your request...', { autoClose: 3000 });
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Sign Up successful');
        navigate('/login');
      } else {
        toast.error(result.message || 'Sign Up failed');
        console.error('Sign Up failed:', result.message);
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
      console.error('Error during sign up:', err);
    }
  };

  return (
    <div className="signup" style={styles.signup}>
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h1>Create an Account</h1>
          <button onClick={handleRoleToggle} style={styles.toggleButton}>
            Switch to {isArtist ? 'User' : 'Artist'}
          </button>
          <div style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {isArtist && (
              <>
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </>
            )}
            {isArtist && <input
              type="number"
              name="experience"
              placeholder="Experience (Years)"
              value={formData.experience}
              onChange={handleChange}
              required
              style={styles.input}
            />}
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
            <button onClick={handleSubmit} style={styles.button}>
              Sign Up
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span>Already have an account? </span>
              <a href="/login" style={{ color: '#6C2BD9', textDecoration: 'underline', cursor: 'pointer' }}>Login here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  signup: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    marginBottom: '15px',
    padding: '12px',
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
  toggleButton: {
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#6C2BD9', // Updated to match other button colors
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default SignUp;
