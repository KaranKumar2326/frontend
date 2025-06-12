import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import backgroundImage from '../../public/loginBackground.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [isArtist, setIsArtist] = useState(false); // Toggle state for Artist/User login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setIsArtist((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: formData.emailOrPhone,
      password: formData.password,
      role: isArtist ? 'artist' : 'user', // Include role in login data
    };
    toast.info('Logging in...');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Login successful');
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('email', result.email);
        localStorage.setItem('name', result.name);
        if (isArtist) {
          navigate('/loggedInHomePageArtist', {
            state: {
              userDetails: {
                userId: result.userId,
                email: result.email,
                name: result.name,
                role: 'artist',
              },
            },
          });
        } else {
          navigate('/loggedInHome', {
            state: {
              userDetails: {
                userId: result.userId,
                email: result.email,
                name: result.name,
                role: 'user',
              },
            },
          });
        }
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.heading}>Login</h2>
        <div style={styles.toggleContainer}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={isArtist}
              onChange={handleToggle}
              style={styles.toggleInput}
            />
            {isArtist ? 'Login as Artist' : 'Login as User'}
          </label>
        </div>
        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone"
          value={formData.emailOrPhone}
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
        <button type="submit" style={styles.button}>
          Login
        </button>
        <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign up here</Link></p>
        <p><Link to="/forgot-password" style={styles.link}>Forgot Password?</Link></p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  link: {
    color: '#6C2BD9',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  button: {
    marginTop: '15px',
    backgroundColor: '#6C2BD9',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  toggleContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  toggleLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  toggleInput: {
    marginRight: '10px',
  },
};

export default Login;
