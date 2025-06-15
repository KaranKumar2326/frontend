import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../../public/loginBackground.png';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Default values for other fields
    address: '',
    pincode: '',
    geoLocation: null,
    role: 'User',
    
    // Artist specific fields with defaults
    stageName: '',
    location: '',
    bio: '',
    description: '',
    available: true,
    pricePerHour: 0,
    pricingUnit: 'hour',
    coverImage: '',
    imageUrl: '',
    gallery: [],
    genres: [],
    instruments: [],
    experience: 0,
    rating: 0,
  });

  const [isArtist, setIsArtist] = useState(false); // Toggle state for User/Artist

  // Get user's current location using geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      toast.info('Detecting your location...', { autoClose: 2000 });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, geoLocation: { latitude, longitude } }));
          toast.success('Location detected successfully!', { autoClose: 3000 });
        },
        (error) => {
          let errorMessage = 'Error getting location: ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please allow location access for better experience. You can continue with signup.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. You can still sign up.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. You can still sign up.';
              break;
            default:
              errorMessage = 'Could not detect location. You can still sign up.';
          }
          toast.warn(errorMessage, { autoClose: 5000 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.warn('Geolocation is not supported by your browser. You can still sign up.', { autoClose: 5000 });
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

    // Prepare base data that's common for all users
    const baseData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      // Default values for other fields
      address: '',
      pincode: formData.pincode || '',
      geoLocation: formData.geoLocation || null,
      role: formData.role,
    };

    // Only include artist data if user is signing up as an artist
    const artistData = isArtist ? {
      stageName: formData.stageName || '',
      // Default values for other artist fields
      location: '',
      bio: '',
      description: '',
      available: true,
      pricePerHour: 0,
      pricingUnit: 'hour',
      coverImage: '',
      imageUrl: '',
      gallery: [],
      genres: [],
      instruments: [],
      experience: 0,
      rating: 0,
    } : {};

    const signupData = {
      ...baseData,
      ...(isArtist && artistData),
    };

    try {
      toast.info('Processing your request...', { autoClose: 3000 });
      const response = await fetch('https://backend-musical.onrender.com/api/auth/signup', {
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
              <input
                type="text"
                name="stageName"
                placeholder="Stage Name"
                value={formData.stageName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            )}
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
              pattern="\d{6}"
              title="Please enter a valid 6-digit pincode"
            />
            <button 
              onClick={handleSubmit} 
              style={styles.button}
            >
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
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  button: {
    padding: '12px 0',
    backgroundColor: '#6C2BD9',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
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
