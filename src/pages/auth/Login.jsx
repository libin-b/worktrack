import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Enter your email and password to sign in!</p>

        <form className="login-form">
          <div className="form-group">
            <label>Email*</label>
            <input type="email" placeholder="mail@simmple.com" />
          </div>

          <div className="form-group">
            <label>Password*</label>
            <input type="password" placeholder="Min. 8 characters" />
          </div>

          <div className="form-footer">
            <label className="remember">
              <input type="checkbox" />
              Keep me logged in
            </label>
          </div>

          <button type="submit" className="login-button">Sign In</button>
        </form>

        {/* <p className="register-link">
          Not registered yet? <a href="#">Create an Account</a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
