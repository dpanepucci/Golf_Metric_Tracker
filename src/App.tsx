import "./App.css";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import { golfService, type YTDStats } from "./services/golfService";
import Log_Round from "./pages/Log_Round";
import Previous_Round from "./pages/Previous_Round";
import Golf_Game from "./pages/Golf_Game";
import Login from "./pages/Login";
import Header from "./components/Header";

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isLoggedIn = golfService.isLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<YTDStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch YTD stats when component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await golfService.getYTDStats();
        setStats(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stats';
        if (errorMessage.includes('Session expired')) {
          navigate('/login');
        } else {
          setError(errorMessage);
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <>
      <div className="YTD">
        <h3>Year to Date:</h3>
        {isLoading ? (
          <p>Loading stats...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : stats ? (
          <>
            <li>FIR: {stats.fir_percentage}%</li>
            <li>GIR: {stats.gir_percentage}%</li>
            <li>Average Putts: {stats.average_putts}</li>
            <li>Rounds Played: {stats.total_rounds}</li>
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <button className="log_round_btn" onClick={() => navigate("/log-round")}>
        Log Round
      </button>

      <button
        className="previous_round_btn" onClick={() => navigate("/previous-round")}>
        Previous Round
      </button>

      <button
        className="achievements_btn" onClick={() => navigate("/achievements")}>
        Achievements
      </button>
    </>
  );
}

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== "/login";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/log-round" 
        element={
          <ProtectedRoute>
            <Log_Round />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/previous-round" 
        element={
          <ProtectedRoute>
            <Previous_Round />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/achievements" 
        element={
          <ProtectedRoute>
            <Golf_Game />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;