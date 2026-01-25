import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { golfService, type GolfRound } from "../services/golfService";
import "./Previous_Round.css"

function Previous_Round() {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState<GolfRound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch rounds when component loads
  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    try {
      const data = await golfService.getRounds();
      setRounds(data);
      setError('');
    } catch (err) {
      setError('Failed to load rounds. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a round
  const handleDeleteRound = async (roundId: number, courseName: string) => {
    if (!confirm(`Are you sure you want to delete the round at ${courseName}?`)) {
      return;
    }

    setDeletingId(roundId);
    try {
      await golfService.deleteRound(roundId);
      // Refresh the rounds list
      await fetchRounds();
      alert('Round deleted successfully!');
    } catch (err) {
      setError('Failed to delete round. Please try again.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate percentages
  const calculateFIR = (round: GolfRound) => {
    return ((round.fairways_hit / round.total_fairways) * 100).toFixed(1);
  };

  const calculateGIR = (round: GolfRound) => {
    return ((round.greens_in_regulation / round.total_greens) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="previous-round-container">
        <h1>Previous Rounds</h1>
        <p>Loading rounds...</p>
        <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="previous-round-container">
      <h1>Previous Rounds</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {rounds.length === 0 ? (
        <p className="no-rounds">No rounds logged yet. Go log your first round!</p>
      ) : (
        <div className="rounds-list">
          {rounds.map((round) => (
            <div key={round.id} className="round-card">
              <div className="round-header">
                <h3>{round.course_name}</h3>
                <span className="round-date">{formatDate(round.date)}</span>
              </div>
              
              <div className="round-stats">
                <div className="stat">
                  <label>Score:</label>
                  <span className="stat-value">{round.score}</span>
                </div>
                
                <div className="stat">
                  <label>FIR:</label>
                  <span className="stat-value">
                    {round.fairways_hit}/{round.total_fairways} ({calculateFIR(round)}%)
                  </span>
                </div>
                
                <div className="stat">
                  <label>GIR:</label>
                  <span className="stat-value">
                    {round.greens_in_regulation}/{round.total_greens} ({calculateGIR(round)}%)
                  </span>
                </div>
                
                <div className="stat">
                  <label>Putts:</label>
                  <span className="stat-value">{round.total_putts}</span>
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={() => handleDeleteRound(round.id, round.course_name)}
                disabled={deletingId === round.id}
              >
                {deletingId === round.id ? 'Deleting...' : 'Delete Round'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default Previous_Round;