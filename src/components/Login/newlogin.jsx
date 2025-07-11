import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './newlogin.css';
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../HomePage/Footer';
import NavigationBar from '../NavigationBar';

const NewLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Login state
  const [loginData, setLoginData] = useState({ emailOrPhone: '', password: '' });
  const [isArtist, setIsArtist] = useState(false);
  // Signup state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'User',
    stageName: '',
    pincode: '', // Add pincode to signup state
  });
  // Forgot/reset password state
  const [forgotForm, setForgotForm] = useState({ email: '', phone: '' });
  const [resetPassword, setResetPassword] = useState({ password: '', confirmPassword: '' });
  const [formStep, setFormStep] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [isActive, setIsActive] = useState(false); // for UI toggle
  // Security questions for artist forgot password
  const [artistSecurityQuestions, setArtistSecurityQuestions] = useState([]);
  const [selectedSecurityIdx, setSelectedSecurityIdx] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  // Security questions for user forgot password
  const [userSecurityQuestions, setUserSecurityQuestions] = useState([]);
  const [selectedUserSecurityIdx, setSelectedUserSecurityIdx] = useState('');
  const [userSecurityAnswer, setUserSecurityAnswer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = React.useRef(null);
  const signupPasswordInputRef = React.useRef(null);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Security questions array for display
  const SECURITY_QUESTIONS = [
    'What was your childhood nickname?',
    'What is the name of your favorite childhood friend?',
    'What was the name of your first pet?',
    'What was the first concert you attended?',
    'What is your mother’s maiden name?',
    'What is your favorite book?',
    'What is your favorite movie?',
    'What is the name of the street you grew up on?',
    'What is your favorite food?',
    'What city were you born in?'
  ];

  // Handlers for toggling forms
  const handleSignUpClick = () => {
    setIsActive(true);
    setFormStep('signup');
  };
  const handleSignInClick = () => {
    setIsActive(false);
    setFormStep('login');
  };

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    toast.info('Logging in...');
    // Determine if input is email or phone
    const input = loginData.emailOrPhone.trim();
    const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input);
    const isPhone = /^\d{10}$/.test(input); // Adjust regex for your phone format
    let loginPayload = {
      password: loginData.password,
      role: isArtist ? 'artist' : 'user',
    };
    if (isEmail) {
      loginPayload.email = input;
    } else if (isPhone) {
      loginPayload.phone = input;
    } else {
      toast.error('Please enter a valid email or 10-digit phone number');
      return;
    }
    try {
      const response = await fetch('https://backend-musical.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
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
          // Set user_id for user logins (for WelcomePopup logic)
          const userId = result.userId || result._id || '';
          localStorage.setItem('user_id', userId);
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

  // Signup handlers
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRoleSelect = (role) => {
    setIsArtist(role === 'Artist');
    setSignupData((prev) => ({ ...prev, role }));
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    // Email format validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(signupData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    // Phone number validation
    if (!/^\d{10}$/.test(signupData.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    // Password validation
    const password = signupData.password;
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>\[\]\\/;'`~_-]/.test(password)) {
      toast.error('Password must contain at least one special symbol');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const signupPayload = {
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      password: signupData.password,
      role: signupData.role,
      stageName: isArtist ? signupData.stageName : '',
      pincode: signupData.pincode, // Include pincode in signup payload
    };
    try {
      toast.info('Processing your request...', { autoClose: 3000 });
      const response = await fetch('https://backend-musical.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Sign Up successful');
        handleSignInClick();
      } else {
        toast.error(result.message || 'Sign Up failed');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  // Forgot/reset password handlers
  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    // Validate at least one field is filled
    if (!forgotForm.email && !forgotForm.phone) {
      toast.error('Please enter either Email or Phone to proceed.');
      return;
    }
    // If artist, verify existence before showing security questions
    if (isArtist) {
      try {
        // Build query string only with filled fields
        const params = [];
        if (forgotForm.email) params.push(`email=${encodeURIComponent(forgotForm.email)}`);
        if (forgotForm.phone) params.push(`phone=${encodeURIComponent(forgotForm.phone)}`);
        const query = params.length ? `?${params.join('&')}` : '';
        // First, verify artist exists
        const res = await fetch(`https://backend-musical.onrender.com/api/artists${query}`);
        const artists = await res.json();
        if (!res.ok || !Array.isArray(artists) || artists.length === 0) {
          setArtistSecurityQuestions([]);
          toast.error('Artist not found. Please check your Email/Phone.');
          return;
        }
        const artist = artists[0];
        if (!artist.securityQuestions || artist.securityQuestions.length === 0) {
          setArtistSecurityQuestions([]);
          toast.error('No security questions set for this artist.');
          return;
        }
        setArtistSecurityQuestions(artist.securityQuestions);
        setFormStep('artist-security');
        return;
      } catch (err) {
        toast.error('Error: ' + err.message);
        return;
      }
    }
    // For user, verify existence before showing security questions
    try {
      // POST to /api/auth/verify-user to get security questions
      const res = await fetch('https://backend-musical.onrender.com/api/auth/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          phone: forgotForm.phone,
          userType: 'user',
          requestSecurityQuestions: true
        })
      });
      const result = await res.json();
      if (!res.ok) {
        setUserSecurityQuestions([]);
        toast.error(result.message || 'User not found. Please check your Email/Phone.');
        return;
      }
      if (!result.securityQuestions || !Array.isArray(result.securityQuestions) || result.securityQuestions.length === 0) {
        setUserSecurityQuestions([]);
        toast.error('No security questions set for this user.');
        return;
      }
      setUserSecurityQuestions(result.securityQuestions);
      setFormStep('user-security');
      return;
    } catch (err) {
      toast.error('Error: ' + err.message);
      return;
    }
  };
  // Handler for artist security question verification
  const handleArtistSecurityVerify = async (e) => {
    e.preventDefault();
    if (!selectedSecurityIdx || !securityAnswer.trim()) {
      toast.error('Please select a question and provide an answer.');
      return;
    }
    try {
      const response = await fetch('https://backend-musical.onrender.com/api/auth/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          phone: forgotForm.phone,
          userType: 'artist',
          securityQuestionIdx: selectedSecurityIdx,
          securityAnswer: securityAnswer.trim(),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Verification successful! Please reset your password.');
        setFormStep('reset');
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };
  // Handler for user security question verification (copy artist logic exactly)
  const handleUserSecurityVerify = async (e) => {
    e.preventDefault();
    if (!selectedUserSecurityIdx || !userSecurityAnswer.trim()) {
      toast.error('Please select a question and provide an answer.');
      return;
    }
    try {
      const response = await fetch('https://backend-musical.onrender.com/api/auth/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          phone: forgotForm.phone,
          userType: 'user',
          securityQuestionIdx: selectedUserSecurityIdx,
          securityAnswer: userSecurityAnswer.trim(),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Verification successful! Please reset your password.');
        setFormStep('reset');
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  // Reset password handlers
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetPassword((prev) => ({ ...prev, [name]: value }));
  };
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (resetPassword.password !== resetPassword.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('https://backend-musical.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotForm.email,
          phone: forgotForm.phone,
          newPassword: resetPassword.password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Password updated successfully! Please login.');
        setFormStep('login');
        setResetPassword({ password: '', confirmPassword: '' });
        setForgotForm({ email: '', phone: '' });
        setIsActive(false);
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  React.useEffect(() => {
    // Handle navigation from state (HomePage.js)
    if (location.state && location.state.signup) {
      setIsActive(true);
      setFormStep('signup');
      if (location.state.artist) {
        setIsArtist(true);
        setSignupData((prev) => ({ ...prev, role: 'Artist' }));
      }
    }
    // Handle navigation from query params (Footer links)
    if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.get('signup') === '1') {
        setIsActive(true);
        setFormStep('signup');
        if (params.get('artist') === '1') {
          setIsArtist(true);
          setSignupData((prev) => ({ ...prev, role: 'Artist' }));
        }
      }
    }
  }, [location.state, location.search]);

  // UI rendering
  return (
    <>
      <div className='newlogin-wrapper'>
        {/* Top left brand text */}
        <div
          className="musical-meet-brand"
          onClick={() => navigate('/')}
          title="Go to Home"
        >
          Musical Meet
        </div>
        <div id="login-bg-blur"></div>
        <div className="lcont">
          <div className={`container${isActive ? ' active' : ''}`} id="container">
            {/* Sign Up Form */}
            <div className="form-container sign-up">
              {formStep === 'signup' && (
                <form onSubmit={handleSignupSubmit} style={{ height: isArtist ? 'calc(100% - 90px)' : 'calc(100% - 8px)' }}>
                  <h1>Create Account</h1>
                  <small style={{
                    display: 'block',
                    fontFamily: 'Playfair Display, serif',
                    color: '#888',
                    fontSize: '1.3rem',
                    marginBottom: '10px',
                    marginTop: '-8px',
                    textAlign: 'center',
                    letterSpacing: '0.2px',
                  }}>
                    as
                  </small>
                  <div className="role-select">
                    <button
                      type="button"
                      className={isArtist ? 'selected' : ''}
                      onClick={() => handleRoleSelect('Artist')}
                      style={{
                        borderRadius: '40px',
                        padding: '8px 28px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginRight: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                      }}
                    >
                      Artist
                    </button>
                    <button
                      type="button"
                      className={!isArtist ? 'selected' : ''}
                      onClick={() => handleRoleSelect('User')}
                      style={{
                        borderRadius: '40px',
                        padding: '8px 28px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                      }}
                    >
                      User
                    </button>
                  </div>
                  <input type="text" name="name" placeholder="Full Name (as per ID)" value={signupData.name} onChange={handleSignupChange} required style={{ width: '100%', boxSizing: 'border-box', display: 'block' }} />
                  {isArtist && (
                    <input type="text" name="stageName" placeholder="Stage Name (publically known as)" value={signupData.stageName} onChange={handleSignupChange} required style={{ width: '100%', boxSizing: 'border-box', display: 'block' }} />
                  )}
                  <input type="email" name="email" placeholder="Email (for updates)" value={signupData.email} onChange={handleSignupChange} required style={{ width: '100%', boxSizing: 'border-box', display: 'block' }} />
                  <input type="text" name="phone" placeholder="Phone (10 digits)" value={signupData.phone} onChange={handleSignupChange} required style={{ width: '100%', boxSizing: 'border-box', display: 'block' }} />
                  <input type="text" name="pincode" placeholder="Pincode (area code)" value={signupData.pincode} onChange={handleSignupChange} required style={{ width: '100%', boxSizing: 'border-box', display: 'block' }} />
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      ref={signupPasswordInputRef}
                      type={showSignupPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password (min 8 chars)"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                      style={{ width: '100%', boxSizing: 'border-box', display: 'block' }}
                    />
                    <span
                      onClick={() => {
                        setShowSignupPassword((prev) => !prev);
                        setTimeout(() => {
                          if (signupPasswordInputRef.current) {
                            const len = signupPasswordInputRef.current.value.length;
                            signupPasswordInputRef.current.setSelectionRange(len, len);
                            signupPasswordInputRef.current.focus();
                          }
                        }, 0);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        color: '#888',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s, font-size 0.2s',
                      }}
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                      onMouseDown={e => e.preventDefault()}
                    >
                      {showSignupPassword ? <EyeOff size={18} style={{ transition: 'all 0.2s' }} /> : <Eye size={18} style={{ transition: 'all 0.2s' }} />}
                    </span>
                  </div>
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} required style={{ width: '100%', boxSizing: 'border-box', display: 'block' }} />
                  <button type="submit" style={{
                    borderRadius: '40px',
                    padding: '12px 36px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
                  }}>Sign Up</button>
                  <span>Already have an account? <span className="link" onClick={handleSignInClick}>Sign In</span></span>
                </form>
              )}
            </div>
            {/* Sign In Form */}
            <div className="form-container sign-in">
              {formStep === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <h1>Sign In</h1>
                  <small style={{
                    display: 'block',
                    fontFamily: 'Playfair Display, serif',
                    color: '#888',
                    fontSize: '1.3rem',
                    marginBottom: '5px',
                    marginTop: '-8px',
                    textAlign: 'center',
                    letterSpacing: '0.2px',
                  }}>
                    as
                  </small>
                  <div className="role-select">
                    <button
                      type="button"
                      className={isArtist ? 'selected' : ''}
                      onClick={() => handleRoleSelect('Artist')}
                      style={{
                        borderRadius: '40px',
                        padding: '8px 28px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginRight: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                      }}
                    >
                      Artist
                    </button>
                    <button
                      type="button"
                      className={!isArtist ? 'selected' : ''}
                      onClick={() => handleRoleSelect('User')}
                      style={{
                        borderRadius: '40px',
                        padding: '8px 28px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                      }}
                    >
                      User
                    </button>
                  </div>
                  <div style={{ width: '100%' }}>
                    <input type="text" name="emailOrPhone" placeholder="Email or Phone" value={loginData.emailOrPhone} onChange={handleLoginChange} required style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                    <span
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                        // Move cursor to end after toggling
                        setTimeout(() => {
                          if (passwordInputRef.current) {
                            const len = passwordInputRef.current.value.length;
                            passwordInputRef.current.setSelectionRange(len, len);
                            passwordInputRef.current.focus();
                          }
                        }, 0);
                      }}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        color: '#888',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s, font-size 0.2s',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      onMouseDown={e => e.preventDefault()}
                    >
                      {showPassword ? <EyeOff size={18} style={{ transition: 'all 0.2s' }} /> : <Eye size={18} style={{ transition: 'all 0.2s' }} />}
                    </span>
                  </div>
                  <span className="link" onClick={() => setFormStep('forgot')}>Forgot Password?</span>
                  <button
                    type="submit"
                    style={{
                      borderRadius: '40px',
                      padding: '12px 36px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.08)'
                    }}
                  >
                    Sign In
                  </button>
                  <span>Don't have an account? <span className="link" onClick={handleSignUpClick}>Sign Up</span></span>
                </form>
              )}
              {formStep === 'forgot' && (
                <form onSubmit={handleForgotSubmit}>
                  <h2>Forgot Password</h2>
                  <div className="role-select">
                    <button type="button" className={isArtist ? 'selected' : ''} onClick={() => handleRoleSelect('Artist')}>Artist</button>
                    <button type="button" className={!isArtist ? 'selected' : ''} onClick={() => handleRoleSelect('User')}>User</button>
                  </div>
                  <input type="email" name="email" placeholder="Email" value={forgotForm.email} onChange={handleForgotChange} />
                  <input type="text" name="phone" placeholder="Phone" value={forgotForm.phone} onChange={handleForgotChange} />
                  <div style={{ fontSize: '0.9em', color: '#888', marginBottom: 8 }}>
                    Verify your email and phone number to move to the next step
                  </div>
                  <button type="submit">Verify</button>
                  <span className="link" onClick={() => setFormStep('login')}>Back to Login</span>
                </form>
              )}
              {formStep === 'artist-security' && (
                <form onSubmit={handleArtistSecurityVerify}>
                  <h2>Security Question Verification</h2>
                  <label>Select one of your security questions:</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <select
                      value={selectedSecurityIdx}
                      onChange={e => setSelectedSecurityIdx(e.target.value)}
                      required
                      className="artist-profile-input"
                      style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      <option value="">Select a question</option>
                      {artistSecurityQuestions.map((q, idx) => (
                        <option key={idx} value={q.questionIdx}>
                          {SECURITY_QUESTIONS[q.questionIdx] || `Question`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={securityAnswer}
                    onChange={e => setSecurityAnswer(e.target.value)}
                    required
                    className="artist-profile-input"
                  />
                  <button type="submit">Verify</button>
                  <span className="link" onClick={() => setFormStep('forgot')}>Back</span>
                </form>
              )}
              {formStep === 'user-security' && (
                <form onSubmit={handleUserSecurityVerify}>
                  <h2>Security Question Verification</h2>
                  <label>Select one of your security questions:</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <select
                      value={selectedUserSecurityIdx}
                      onChange={e => setSelectedUserSecurityIdx(e.target.value)}
                      required
                      className="artist-profile-input"
                      style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      <option value="">Select a question</option>
                      {userSecurityQuestions.map((q, idx) => (
                        <option key={idx} value={q.questionIdx}>
                          {SECURITY_QUESTIONS[q.questionIdx] || `Question`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={userSecurityAnswer}
                    onChange={e => setUserSecurityAnswer(e.target.value)}
                    required
                    className="artist-profile-input"
                  />
                  <button type="submit">Verify</button>
                  <span className="link" onClick={() => setFormStep('forgot')}>Back</span>
                </form>
              )}
              {formStep === 'reset' && (
                <form onSubmit={handleResetSubmit}>
                  <h2>Reset Password</h2>
                  <input type="password" name="password" placeholder="New Password" value={resetPassword.password} onChange={handleResetChange} required />
                  <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={resetPassword.confirmPassword} onChange={handleResetChange} required />
                  <button type="submit">Reset Password</button>
                  <span className="link" onClick={() => setFormStep('login')}>Back to Login</span>
                </form>
              )}
            </div>
            {/* Toggle Panel */}
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Join the Musical Journey!</h1>
                  <p>Register now to discover, book, and collaborate with amazing talent</p>
                  <button className="hidden" id="login" type="button" onClick={handleSignInClick}>Sign In</button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Welcome Back to the Jam!</h1>
                  <p>Sign in to connect, jam, and create music with artists and fans.</p>
                  <button className="hidden" id="register" type="button" onClick={handleSignUpClick}>Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer style={{ zIndex: 1006}}/>
    </>
  );
};

export default NewLogin;