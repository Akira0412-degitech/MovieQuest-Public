import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

import '../App.css';
import api from './api';
import { AuthContext } from './AuthContext';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);


function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);

useEffect(() => {
  if(!isLoggedIn) return;

  const fetchPerson = async () => {
    try {
      const res = await api.get(`/people/${id}`);
      setPerson(res.data);
      setError(null);
    } catch (err) {
      console.error("API error", err);
      setError("Failed to load person data");
    }
  };

  fetchPerson();
}, [id]);


  // Remaining chart + grid logic unchanged
  const columnDefs = [
    {
      headerName: "Movie Title",
      field: "movieName",
      flex: 2,
      cellRenderer: (params) => (
        <a className="clickable-link" onClick={() => navigate(`/movies/data/${params.data.movieId}`)}>
          {params.value}
        </a>
      )
    },
    {
      headerName: "Character(s)",
      field: "characters",
      valueFormatter: (params) =>
        Array.isArray(params.value) && params.value.length > 0
          ? params.value.join(", ")
          : "None"
    },
    { headerName: "Role", field: "category" },
    { headerName: "IMDb Rating", field: "imdbRating" }
  ];

  const generateRatingBins = () => {
    const bins = {};
    for (let i = 5.0; i < 8.5; i += 0.5) {
      const key = `${i.toFixed(1)}–${(i + 0.5).toFixed(1)}`;
      bins[key] = 0;
    }

    person?.roles?.forEach((role) => {
      const rating = role.imdbRating;
      if (rating >= 5 && rating <= 8) {
        const lower = Math.floor(rating * 2) / 2;
        const key = `${lower.toFixed(1)}–${(lower + 0.5).toFixed(1)}`;
        if (bins[key] !== undefined) {
          bins[key]++;
        }
      }
    });

    return bins;
  };

  const distributionChartData = {
    labels: Object.keys(generateRatingBins()),
    datasets: [
      {
        label: "Number of Movies",
        data: Object.values(generateRatingBins()),
        backgroundColor: "rgba(100, 108, 255, 0.6)",
        borderColor: "rgba(100, 108, 255, 1)",
        borderWidth: 1
      }
    ]
  };

  const distributionChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "IMDb Rating Distribution (5.0 - 8.5)",
        font: { size: 18 }
      },
      legend: { display: false }
    },
    scales: {
      x: { title: { display: true, text: "Rating Range" } },
      y: { beginAtZero: true, title: { display: true, text: "Number of Movies" } }
    }
  };

  const generateRoleCounts = () => {
    const counts = {};
    person?.roles?.forEach((role) => {
      const category = role.category ?? "Unknown";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  };

  const doughnutChartData = {
    labels: Object.keys(generateRoleCounts()),
    datasets: [
      {
        label: "Roles",
        data: Object.values(generateRoleCounts()),
        backgroundColor: [
          'rgba(100, 108, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }
    ]
  };

  const calculateIMDbStats = () => {
    const ratings = person?.roles?.map(r => r.imdbRating).filter(r => typeof r === 'number') || [];
    if (ratings.length === 0) return { average: 0, min: 0, max: 0 };
    const sum = ratings.reduce((acc, val) => acc + val, 0);
    return {
      average: (sum / ratings.length).toFixed(1),
      min: Math.min(...ratings),
      max: Math.max(...ratings)
    };
  };

  const imdbStats = calculateIMDbStats();

  if (isLoggedIn === false) {
    return (
      <div className='nonlogin-page'>
        <div className="text-body" style={{ textAlign: "center"}}>
          <h2>Login required to see the details</h2>
          <button className="btn-main" onClick={() => navigate("/login")}>Go to Login Page</button>
          <h2>Have you registered yet?</h2>
          <button className="btn-main" onClick={() => navigate("/register")}>Go to Register Page</button>
        </div>
      </div>
    );
      
      
  }

  return (
    <div className="fullscreen">
      {person && (
        <>
        <h1 className='text-home' style={{color:" #463F3A"}} >Details</h1>
          <div className="person-detail-wrapper">
            <div className="person-info-box text-body">
              <h1>{person.name}</h1>
              <p>{(person.birthYear == null && person.deathYear == null)
                ? "Unknown"
                : `${person.birthYear ?? "Unknown"} - ${person.deathYear ?? "Present"}`}</p>
            </div>
            <div className="person-chart-box">
              <Bar data={distributionChartData} options={distributionChartOptions} />
            </div>
          </div>

          <div className="chart-and-stats-container">
            <div className="person-chart-card">
              <h2 className="text-body">Role Distribution</h2>
              <div style={{ width: "200px", height: "200px" }}>
                <Doughnut data={doughnutChartData} />
              </div>
            </div>
            <div className="stats-cards-container">
              <div className="stat-card"><h3>Average IMDb</h3><p>{imdbStats.average}</p></div>
              <div className="stat-card"><h3>Highest IMDb</h3><p>{imdbStats.max}</p></div>
              <div className="stat-card"><h3>Lowest IMDb</h3><p>{imdbStats.min}</p></div>
            </div>
          </div>
          <h4 className='text-body'>Casting History</h4>
          <div className="ag-theme-balham person-table-box">
            <AgGridReact
              modules={[ClientSideRowModelModule]}
              rowData={person.roles}
              columnDefs={columnDefs}
            />
          </div>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!person && !error && <p>Loading...</p>}
    </div>
  );
}

export default PersonDetail;
