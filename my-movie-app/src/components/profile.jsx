import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../App.css';
import api from './api';


function Profile() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [redirecting, setRedirecting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const handleUpdate = async (e) => {

    e.preventDefault();


    try {
      const response = await api.put(`/user/${userEmail}/profile`, {
        userEmail,
        firstName,
        lastName,
        dob,
        address
      },
    {withCredentials: true});

    if(response.status == 200){
      setMessage("Succcessfully user profile updated! Reloading page...");
      setError(null);
      window.location.reload();
    }
    }catch(err) {
      if(err.response){
        console.log("server responded with error:", err.response.data)
        setError(err.response.data.message)
      }else{
        console.log("Error occured", err.message)

      }

    }

  }

    
  useEffect(() => {
    if (!userEmail) {
      setRedirecting(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      // Fetch user data
      api.get(`/user/${userEmail}/profile`, { withCredentials: true })
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userEmail, navigate]);

  useEffect(() => {
  if (userData) {
    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");
    setDob(userData.dob || "");
    setAddress(userData.address || "");
  }
}, [userData]);


  if (redirecting) {
    return (
      <div className="fullscreen" style={{ textAlign: "center", marginTop: "100px" }}>
        <h2 className="text-body">
            This is a profile page for logged in users <br />
            You need to login first... Redirecting to login page...</h2>
      </div>
    );
  }

  return (
    <div className="fullscreen">
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <div className="profile-card">
          <h1 className="text-heading">User Profile</h1>
          <div className="profile-info">
            <div className="info-box">
              <p className="label">Email</p>
              <p className="value">{userEmail}</p>
            </div>
          </div>
          <form id="profile-form">

            <div className="profile-info">
              <div className="info-box">
                <p className="label">FirstName</p>
                <p className="value">{isPanelOpen ? (
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                ) : (
                  userData?.firstName || "No data Available"
                )}</p>
              </div>
            </div>
            <div className="profile-info">
              <div className="info-box">
                <p className="label">LastName</p>
                {isPanelOpen ? (
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                ): (
                  <p className="value">{userData?.lastName || "No data Available"}</p>
                )}
              </div>
            </div>
            <div className="profile-info">
              <div className="info-box">
                <p className="label">dob</p>
                {isPanelOpen ? (
                  <input type="text" value={dob} onChange={(e) => setDob(e.target.value)}/>
                ) : (
                  <p className="value">{userData?.dob || "No data Available"}</p>
                )}
              </div>
            </div>
            <div className="profile-info">
              <div className="info-box">
                <p className="label">Address</p>
                {isPanelOpen ? (
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
                ) : (
                  <p className="value">{userData?.address || "No data Available"}</p>
                )}
              </div>
            </div>
            {isPanelOpen && (
              <>
              {error && <p className="error-text">{error}</p>}
              {message && <p>{message}</p>}
              <button onClick={handleUpdate} className="btn-main" type="submit" style={{ marginBottom: "20px" }}>
                Submit Changes
              </button>
              
              </>
            )}
          </form>

          <button className="btn-main" onClick={() => {
            setIsPanelOpen(!isPanelOpen);
            setError("")}}>
            {isPanelOpen ? "Close Profile" : "Open Profile"}
          </button>
          
        <Link to="/Home">
          <button className="btn-main" style={{ marginTop: "20px" }}>Back to Home</button>
        </Link>
      </div>
    </div>
  </div>
  );
}

export default Profile;
