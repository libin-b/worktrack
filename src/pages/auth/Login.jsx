import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Hardcoded credentials
    const users = {
      'hr@example.com': { password: 'hrpassword', role: 'hr' },
      'manager@example.com': { password: 'managerpassword', role: 'manager' },
      'employee@example.com': { password: 'employeepassword', role: 'employee' },
    };

    const user = users[email];

    if (user && user.password === password) {
      // Redirect based on role
      switch (user.role) {
        case 'hr':
          navigate('/dashboard');
          break;
        case 'manager':
          navigate('/dashboard/manager');
          break;
        case 'employee':
          navigate('/dashboard/employee');
          break;
        default:
          setError('Unknown role.');
      }
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Enter your email and password to sign in!</p>

        <form className="login-form" onSubmit={handleLogin}>
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

          {error && <p className="error-message">{error}</p>}

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
