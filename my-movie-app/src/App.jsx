import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Movies from './components/Movies';
import Login from './components/Login';
import Register from './components/Register';
import MovieDetail from './components/MovieDetail';
import PersonDetail from './components/PersonDetail';
import Profile from './components/profile';

import { AuthProvider } from './components/AuthContext';
import { AuthContext } from './components/AuthContext';
import api from './components/api';
import { setupInterceptors } from './components/setInterceptors';




function NotFoundPage(){
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Home");
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate]);

  return (
    <div style={{textAlign:"center", marginTop: "200px", color: "brown"}}>
      <h1>404 Not Found</h1>
      <p>You will be redirected to Home...</p>
    </div>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: "auto"});
  }, [location]);

  return null;
}


function AppBody({ isPanelOpen, setIsPanelOpen }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    // Automatically close the panel when route changes
    setIsPanelOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try{
      const response =  api.post("/user/logout", 
        {withCredentials: true});
      localStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      setTimeout(() => {
        navigate("/");
      },1000)
    }catch(err){
      console.error("Error during logout:", err.response.message)
    }
  };

  

  return (
    <div style={{ flexDirection: 'column', height: '100vh', color: 'white' }}>
      <nav style={{
        padding: '10px 20px',
        background: '#463F3A',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <p className='appname-home'>Movie Quest</p>
        <Link to="/Home" className='nav-bar'>Home</Link>
        <Link to="/movies/search" className='nav-bar'>Movies</Link>
        <div style={{ marginLeft: "auto", display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isLoggedIn === true ? (
          <div className="profile-menu-wrapper">
            <h3 className="profile-name">{localStorage.getItem("userEmail")}</h3>
            <div className="profile-dropdown">
              <Link to="/profile">View Profile</Link>
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsPanelOpen(true)} 
            className='btn-main'
            style={{ marginRight: "50px", border: '1px solid white', padding: '5px 10px' }}>
            Log in / Sign up
          </button>
        )}
        </div>
      </nav>

      {/* Side Panel */}
      {isPanelOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "300px",
          height: "100vh",
          backgroundColor: "#ffffff",
          color: "black",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
          zIndex: 2000,
          padding: "20px",
          textAlign: 'center',
        }}>
          <button onClick={() => setIsPanelOpen(false)} className='close-button' style={{ marginLeft: "auto" }}>✕</button>
          <h3 className='text-body'>Log in / Sign up</h3>
          <p className='text-body'>With a free account, you can:</p>
          <p>Find movies<br />See the Detail of movies and officials</p>
          <Link to="/login"><button className='btn-main'>Log in</button></Link><br />
          <Link to="/register"><button className='btn-main'>Sign up</button></Link>
        </div>
      )}

      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/movies/search" element={<Movies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies/data/:imdbID" element={<MovieDetail />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path='*' element={<NotFoundPage />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    setupInterceptors(
      () => accessToken,        // アクセストークン取得関数
      (token) => setAccessToken(token) // 新しいトークンを保存する関数
    );
  }, [accessToken]);

  return (
    <AuthProvider>
    <Router>
      <ScrollToTop />
        <AppBody
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
    </Router>
    </AuthProvider>
  );
}

export default App;
