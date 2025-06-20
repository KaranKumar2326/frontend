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
  const [isArtist, setIsArtist] = useState(false);
  const [isFocused, setIsFocused] = useState({
    emailOrPhone: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleToggle = () => {
    setIsArtist((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      email: formData.emailOrPhone,
      password: formData.password,
      role: isArtist ? 'artist' : 'user',
    };
    toast.info('Logging in...');
  
    try {
      const response = await fetch('https://backend-musical.onrender.com/api/auth/login', {
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
        localStorage.setItem('isLoggedIn', 'true');
  
        if (result.role && result.role.toLowerCase() === 'artist') {
          localStorage.setItem('role', 'artist');
          const artistId = result.userId || result._id || '';
          localStorage.setItem('artist_id', artistId);
  
          if (result.profileComplete === false) {
            navigate(`/publicartistprofilepage/${artistId}`, {
              state: {
                incompleteProfile: true,
                userDetails: {
                  userId: result.userId,
                  email: result.email,
                  name: result.name,
                  role: result.role,
                },
              },
            });
          } else {
            navigate('/loggedInHomePageArtist', {
              state: {
                userDetails: {
                  userId: result.userId,
                  email: result.email,
                  name: result.name,
                  role: result.role,
                },
              },
            });
          }
        } else if (result.role && result.role.toLowerCase() === 'user') {
          localStorage.setItem('role', 'user');
          localStorage.removeItem('artist_id');
          navigate('/loggedInHome', {
            state: {
              userDetails: {
                userId: result.userId,
                email: result.email,
                name: result.name,
                role: result.role,
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
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.subHeading}>Sign in to continue your musical journey</p>
        </div>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.toggleContainer}>
            <label style={styles.toggleLabel}>
              <span style={styles.toggleText}>User</span>
              <div 
                style={isArtist ? styles.toggleSwitchOn : styles.toggleSwitchOff}
                onClick={handleToggle}
              >
                <div style={isArtist ? styles.toggleKnobOn : styles.toggleKnobOff}></div>
              </div>
              <span style={styles.toggleText}>Artist</span>
            </label>
          </div>
          
          <div style={styles.inputContainer}>
            <label 
              style={
                isFocused.emailOrPhone || formData.emailOrPhone 
                  ? styles.inputLabelFocused 
                  : styles.inputLabel
              }
            >
              Email or Phone
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              onFocus={() => handleFocus('emailOrPhone')}
              onBlur={() => handleBlur('emailOrPhone')}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputContainer}>
            <label 
              style={
                isFocused.password || formData.password 
                  ? styles.inputLabelFocused 
                  : styles.inputLabel
              }
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              required
              style={styles.input}
            />
          </div>
          
          <button type="submit" style={styles.button}>
            <span style={styles.buttonText}>Login</span>
            <div style={styles.buttonHoverEffect}></div>
          </button>
          
          <div style={styles.linksContainer}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot Password?
            </Link>
            <p style={styles.signupText}>
              Don't have an account?{' '}
              <Link to="/signup" style={styles.signupLink}>
                Sign up
              </Link>
            </p>
          </div>
        </form>
        
        <div style={styles.socialDivider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or continue with</span>
          <span style={styles.dividerLine}></span>
        </div>
        
        <div style={styles.socialButtons}>
          <button style={styles.socialButton}>
            <i className="fab fa-google" style={styles.socialIcon}></i>
          </button>
          <button style={styles.socialButton}>
            <i className="fab fa-facebook-f" style={styles.socialIcon}></i>
          </button>
          <button style={styles.socialButton}>
            <i className="fab fa-apple" style={styles.socialIcon}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background:  `url(${backgroundImage})`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
  },
  glassCard: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    background: 'linear-gradient(to right, #fff, #e0e0e0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subHeading: {
    fontSize: '14px',
    opacity: '0.8',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '25px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  toggleText: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 10px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  toggleSwitchOff: {
    width: '50px',
    height: '26px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '13px',
    padding: '3px',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  toggleSwitchOn: {
    width: '50px',
    height: '26px',
    backgroundColor: '#6C2BD9',
    borderRadius: '13px',
    padding: '3px',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  toggleKnobOff: {
    width: '20px',
    height: '20px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    left: '3px',
    transition: 'all 0.3s ease',
  },
  toggleKnobOn: {
    width: '20px',
    height: '20px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    left: '27px',
    transition: 'all 0.3s ease',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '20px',
  },
  inputLabel: {
    position: 'absolute',
    left: '15px',
    top: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  },
  inputLabelFocused: {
    position: 'absolute',
    left: '15px',
    top: '-8px',
    fontSize: '12px',
    color: '#fff',
    backgroundColor: 'rgba(108, 43, 217, 0.5)',
    padding: '0 5px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 0 0 2px rgba(108, 43, 217, 0.3)',
    },
    '::placeholder': {
      color: 'transparent',
    },
  },
  button: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#6C2BD9',
    color: 'white',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    zIndex: '1',
    ':hover': {
      backgroundColor: '#5a24c0',
    },
  },
  buttonText: {
    position: 'relative',
    zIndex: '2',
  },
  buttonHoverEffect: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '0',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transition: 'width 0.3s ease',
    zIndex: '1',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    fontSize: '14px',
  },
  link: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    ':hover': {
      color: '#fff',
      textDecoration: 'underline',
    },
  },
  signupText: {
    margin: '0',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  signupLink: {
    color: '#fff',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  socialDivider: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
  },
  dividerLine: {
    flex: '1',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    padding: '0 15px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  socialButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  socialIcon: {
    color: '#fff',
    fontSize: '16px',
  },
};

export default Login;