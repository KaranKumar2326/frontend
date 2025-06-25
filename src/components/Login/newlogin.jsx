import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './newlogin.css';

const NewLogin = () => {
  const navigate = useNavigate();
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
    try {
      const response = await fetch('https://backend-musical.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.emailOrPhone,
          password: loginData.password,
          role: isArtist ? 'artist' : 'user',
        }),
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
    // If artist, fetch security questions first
    if (isArtist) {
      try {
        // Fetch artist by email/phone to get security questions
        const res = await fetch(`https://backend-musical.onrender.com/api/artists?email=${encodeURIComponent(forgotForm.email)}&phone=${encodeURIComponent(forgotForm.phone)}`);
        const artists = await res.json();
        if (res.ok && Array.isArray(artists) && artists.length > 0) {
          const artist = artists[0];
          if (artist.securityQuestions && artist.securityQuestions.length > 0) {
            setArtistSecurityQuestions(artist.securityQuestions);
          } else {
            setArtistSecurityQuestions([]);
          }
          // Show security question selection UI
          setFormStep('artist-security');
          return;
        } else {
          setArtistSecurityQuestions([]);
          toast.error('Artist not found or no security questions set.');
          return;
        }
      } catch (err) {
        toast.error('Error: ' + err.message);
        return;
      }
    }
    // For user, fetch security questions first
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
      if (res.ok && result.securityQuestions && Array.isArray(result.securityQuestions) && result.securityQuestions.length > 0) {
        setUserSecurityQuestions(result.securityQuestions);
        setFormStep('user-security');
        return;
      } else if (res.ok) {
        setUserSecurityQuestions([]);
        toast.error('No security questions set for this user.');
        return;
      } else {
        setUserSecurityQuestions([]);
        toast.error(result.message || 'User not found or no security questions set.');
        return;
      }
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

  // UI rendering
  return (
    <div className='newlogin-wrapper'>
      <div id="login-bg-blur"></div>
      <div className="lcont">
      <div className={`container${isActive ? ' active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          {formStep === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <h1>Create Account</h1>
              <div className="role-select">
                <button type="button" className={isArtist ? 'selected' : ''} onClick={() => handleRoleSelect('Artist')}>Artist</button>
                <button type="button" className={!isArtist ? 'selected' : ''} onClick={() => handleRoleSelect('User')}>User</button>
              </div>
              <input type="text" name="name" placeholder="Name" value={signupData.name} onChange={handleSignupChange} required />
              {isArtist && (
                <input type="text" name="stageName" placeholder="Stage Name" value={signupData.stageName} onChange={handleSignupChange} required />
              )}
              <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required />
              <input type="text" name="phone" placeholder="Phone" value={signupData.phone} onChange={handleSignupChange} required />
              <input type="text" name="pincode" placeholder="Pincode" value={signupData.pincode} onChange={handleSignupChange} required />
              <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} required />
              <button type="submit">Sign Up</button>
              <span>Already have an account? <span className="link" onClick={handleSignInClick}>Sign In</span></span>
            </form>
          )}
        </div>
        {/* Sign In Form */}
        <div className="form-container sign-in">
          {formStep === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <h1>Sign In</h1>
              <div className="role-select">
                <button type="button" className={isArtist ? 'selected' : ''} onClick={() => handleRoleSelect('Artist')}>Artist</button>
                <button type="button" className={!isArtist ? 'selected' : ''} onClick={() => handleRoleSelect('User')}>User</button>
              </div>
              <input type="text" name="emailOrPhone" placeholder="Email or Phone" value={loginData.emailOrPhone} onChange={handleLoginChange} required />
              <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
              <span className="link" onClick={() => setFormStep('forgot')}>Forgot Password?</span>
              <button type="submit">Sign In</button>
              <span>Don't have an account? <span className="link" onClick={handleSignUpClick}>Sign Up</span></span>
            </form>
          )}
          {formStep === 'forgot' && (
            <form onSubmit={handleForgotSubmit}>
              <h2>Forgot Password</h2>
              <input type="email" name="email" placeholder="Email" value={forgotForm.email} onChange={handleForgotChange} required />
              <input type="text" name="phone" placeholder="Phone" value={forgotForm.phone} onChange={handleForgotChange} required />
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
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" id="login" type="button" onClick={handleSignInClick}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" id="register" type="button" onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NewLogin;