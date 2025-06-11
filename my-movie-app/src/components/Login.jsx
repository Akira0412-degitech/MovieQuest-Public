import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import api from './api';
import { AuthContext } from './AuthContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`/user/login`, {
        email,
        password
      },
    {withCredentials: true});

      if (res.data.success) {
        localStorage.setItem("userEmail", email);
        setMessage("Successfully logged in. Moving to previous page...");
        setError(null);
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        setError(res.data.message || "Login failed.");
        setMessage("");
      }

    } catch (err) {
      console.error("Error occurred:", err);
      if(err.response && err.response.status === 401){
        setError("Incorrect email or password");
      }else{
        setError("Server error occurred");

      }
      setMessage("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}
          {message && <p className='successful-login'>{message}</p>}

          <button type="submit" className="login-button" >Login</button>
        </form>
        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
