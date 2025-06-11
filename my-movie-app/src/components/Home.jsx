import { Link } from "react-router-dom";
import '../App.css';
import homeImage from '../assets/home_img.jpg';
import React from 'react';
import { AuthContext } from "./AuthContext";

function Home() {
  const { isLoggedIn } = React.useContext(AuthContext);

  return (
    <div className="fullscreen">
      <div className="home-wrapper">
        <div className="text-heading text-home">
          <h4>Welcome to MovieQuest!</h4>
          <p className="text-body">Discover movies from all around the world.</p>

        </div>
        <img className="home-img" src={homeImage} alt="home" />
        </div>
        <h4 style={{color:" #463F3A", fontSize: "30px"}}>Features</h4>
        <div className="button-group-home">
          <div className="feature-card-home">
            <h2>Find Movies</h2>
            <p>Discover and explore movies from all around the world!</p>
            <Link to ="/movies/search">
              <button className="btn-main">Find Movies</button>
            </Link>
          </div>
          

          {isLoggedIn === false ? (
            <>
            <div className="feature-card-home">
              <h2>Login / Signup</h2>
              <p>Create your account to enjoy personalized features!</p>
              <Link to = "/register">
                <button className="btn-main">Login / Signup</button>
              </Link>
            </div>
            </>
          ): (
            <>
            <div className="feature-card-home">
              <h2>Profile</h2>
              <p>View and manage your personal information.</p>
              <Link to = "/profile">
                <button className="btn-main">Profile</button>
              </Link>
            </div>
            </>
            
          )}
        </div>
      
          
    </div>
  );
}

export default Home;
