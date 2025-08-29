import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../api/axios'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);

    try {
        // Send login request via axios
        const response = await api.post('/auth/login', {email, password});
        console.log(response);
        const {token, user} = response.data;
        localStorage.setItem('auth_token', token); // Save token to localStorage
        localStorage.setItem('auth_user', JSON.stringify(user)); // save user to localStorage

        // role based route handling
        const userRole = (user?.role || '').toString().toLowerCase();
        
        if (userRole === 'hr') {
          navigate('/dashboard');
        } else if (userRole === 'manager') {
          navigate('/dashboard/manager');
        } else if (userRole === 'employee') {
          navigate('/dashboard/employee');
        } else {
          console.warn('Unknown role from backend:', user?.role);
          navigate('/dashboard');
        }
    }catch(error){
      // prefer server message if available
      const msg = error?.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    } 
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Enter your email and password to sign in!</p>

        <form className="login-form" onSubmit={handleLogin}>
          
          {error && <p className="error-message">{error}</p>}   

          <div className="form-group">
            <label>Email*</label>
            <input 
              type="email" 
              placeholder="mail@simmple.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password*</label>
            <input 
              type="password" 
              placeholder="Min. 8 characters" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>     

          <div className="form-footer">
            <label className="remember">
              <input type="checkbox" />
              Keep me logged in
            </label>
          </div>

          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
