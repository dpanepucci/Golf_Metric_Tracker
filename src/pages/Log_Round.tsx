import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { golfService } from "../services/golfService";
import "./Log_Round.css"

interface HoleData {
  hole: number;
  score: number;
  fir: boolean | null; // null for par 3s
  gir: boolean;
  putts: number;
}

function Log_Round() {
  const navigate = useNavigate();
  
  // Step 1: Course setup
  const [step, setStep] = useState<'setup' | 'holes' | 'review'>('setup');
  const [courseName, setCourseName] = useState('');
  const [totalHoles, setTotalHoles] = useState<9 | 18>(18);
  
  // Step 2: Hole-by-hole tracking
  const [currentHole, setCurrentHole] = useState(1);
  const [holesData, setHolesData] = useState<HoleData[]>([]);
  const [currentHoleData, setCurrentHoleData] = useState<HoleData>({
    hole: 1,
    score: 4,
    fir: true,
    gir: false,
    putts: 2,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);

  // Start tracking holes
  const handleStartRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseName.trim()) {
      setStep('holes');
      setCurrentHole(1);
      setCurrentHoleData({ hole: 1, score: 4, fir: true, gir: false, putts: 2 });
    }
  };

  // Save current hole and move to next
  const handleNextHole = () => {
    // Check for hole-in-one (Par 3 + Score of 1)
    if (currentHoleData.fir === null && currentHoleData.score === 1) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 4000);
    }
    
    const updatedHoles = [...holesData, currentHoleData];
    setHolesData(updatedHoles);
    
    if (currentHole < totalHoles) {
      setCurrentHole(currentHole + 1);
      setCurrentHoleData({
        hole: currentHole + 1,
        score: 4,
        fir: true,
        gir: false,
        putts: 2,
      });
    } else {
      // All holes complete, move to review
      setStep('review');
    }
  };

  // Go back to previous hole
  const handlePreviousHole = () => {
    if (currentHole > 1) {
      const previousHoleData = holesData[holesData.length - 1];
      setHolesData(holesData.slice(0, -1));
      setCurrentHole(currentHole - 1);
      setCurrentHoleData(previousHoleData);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    // In review step, all holes are already in holesData. During holes step, include currentHoleData.
    const allHoles = step === 'review' ? holesData : [...holesData, currentHoleData];
    const totalScore = allHoles.reduce((sum, hole) => sum + hole.score, 0);
    const fairwaysHit = allHoles.filter(hole => hole.fir === true).length;
    const totalFairways = allHoles.filter(hole => hole.fir !== null).length; // Exclude par 3s
    const greensHit = allHoles.filter(hole => hole.gir === true).length;
    const totalPutts = allHoles.reduce((sum, hole) => sum + hole.putts, 0);
    
    return {
      totalScore,
      fairwaysHit,
      totalFairways,
      greensHit,
      totalGreens: totalHoles,
      totalPutts,
    };
  };

  // Submit final round
  const handleSubmitRound = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const totals = calculateTotals();
      await golfService.createRound({
        course_name: courseName,
        score: totals.totalScore,
        fairways_hit: totals.fairwaysHit,
        total_fairways: totals.totalFairways,
        greens_in_regulation: totals.greensHit,
        total_greens: totals.totalGreens,
        total_putts: totals.totalPutts,
      });
      
      alert('Round logged successfully!');
      navigate('/previous-round');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log round. Please try again.';
      if (errorMessage.includes('Session expired') || errorMessage.includes('login again')) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render setup step
  if (step === 'setup') {
    return (
      <div className="log-round-container">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <h1>Log Round</h1>
        
        <form onSubmit={handleStartRound} className="setup-form">
          <div className="form-group">
            <label htmlFor="course_name">Course Name:</label>
            <input
              type="text"
              id="course_name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              placeholder="Enter course name"
            />
          </div>

          <div className="form-group">
            <label>Number of Holes:</label>
            <div className="holes-selector">
              <button
                type="button"
                className={`hole-btn ${totalHoles === 9 ? 'active' : ''}`}
                onClick={() => setTotalHoles(9)}
              >
                9 Holes
              </button>
              <button
                type="button"
                className={`hole-btn ${totalHoles === 18 ? 'active' : ''}`}
                onClick={() => setTotalHoles(18)}
              >
                18 Holes
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Start Round
          </button>
        </form>
      </div>
    );
  }

  // Render hole-by-hole entry
  if (step === 'holes') {
    return (
      <div className="log-round-container">
        {showFireworks && (
          <div className="fireworks-overlay">
            <div className="hole-in-one-text">HOLE IN ONE! 🏌️‍♂️</div>
            <div className="firework" style={{ left: '20%', animationDelay: '0s' }}></div>
            <div className="firework" style={{ left: '50%', animationDelay: '0.3s' }}></div>
            <div className="firework" style={{ left: '80%', animationDelay: '0.6s' }}></div>
            <div className="firework" style={{ left: '35%', animationDelay: '0.9s' }}></div>
            <div className="firework" style={{ left: '65%', animationDelay: '1.2s' }}></div>
          </div>
        )}
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <h1>{courseName}</h1>
        <h2>Hole {currentHole} of {totalHoles}</h2>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(holesData.length / totalHoles) * 100}%` }}
          />
        </div>

        <div className="hole-entry-form">
          <div className="form-group">
            <label>Fairway in Regulation:</label>
            <div className="button-group">
              <button
                type="button"
                className={`choice-btn ${currentHoleData.fir === true ? 'active yes' : ''}`}
                onClick={() => setCurrentHoleData({ ...currentHoleData, fir: true })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`choice-btn ${currentHoleData.fir === false ? 'active no' : ''}`}
                onClick={() => setCurrentHoleData({ ...currentHoleData, fir: false })}
              >
                No
              </button>
              <button
                type="button"
                className={`choice-btn ${currentHoleData.fir === null ? 'active' : ''}`}
                onClick={() => setCurrentHoleData({ ...currentHoleData, fir: null })}
              >
                Par 3
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Green in Regulation:</label>
            <div className="button-group">
              <button
                type="button"
                className={`choice-btn ${currentHoleData.gir === true ? 'active yes' : ''}`}
                onClick={() => setCurrentHoleData({ ...currentHoleData, gir: true })}
              >
                Yes
              </button>
              <button
                type="button"
                className={`choice-btn ${currentHoleData.gir === false ? 'active no' : ''}`}
                onClick={() => setCurrentHoleData({ ...currentHoleData, gir: false })}
              >
                No
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="putts">Number of Putts:</label>
            <div className="number-input-group">
              <button
                type="button"
                className="decrement-btn"
                onClick={() => setCurrentHoleData({ ...currentHoleData, putts: Math.max(0, currentHoleData.putts - 1) })}
              >
                −
              </button>
              <input
                type="number"
                id="putts"
                value={currentHoleData.putts}
                onChange={(e) => setCurrentHoleData({ ...currentHoleData, putts: parseInt(e.target.value) || 0 })}
                min="0"
                max="10"
                readOnly
              />
              <button
                type="button"
                className="increment-btn"
                onClick={() => setCurrentHoleData({ ...currentHoleData, putts: Math.min(10, currentHoleData.putts + 1) })}
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="score">Score:</label>
            <div className="number-input-group">
              <button
                type="button"
                className="decrement-btn"
                onClick={() => setCurrentHoleData({ ...currentHoleData, score: Math.max(1, currentHoleData.score - 1) })}
              >
                −
              </button>
              <input
                type="number"
                id="score"
                value={currentHoleData.score}
                onChange={(e) => setCurrentHoleData({ ...currentHoleData, score: parseInt(e.target.value) || 1 })}
                min="1"
                max="15"
                readOnly
              />
              <button
                type="button"
                className="increment-btn"
                onClick={() => setCurrentHoleData({ ...currentHoleData, score: Math.min(15, currentHoleData.score + 1) })}
              >
                +
              </button>
            </div>
          </div>

          <div className="navigation-buttons">
            {currentHole > 1 && (
              <button 
                type="button" 
                className="prev-btn"
                onClick={handlePreviousHole}
              >
                Previous Hole
              </button>
            )}
            <button 
              type="button" 
              className="next-btn"
              onClick={handleNextHole}
            >
              {currentHole === totalHoles ? 'Review Round' : 'Next Hole'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render review step
  if (step === 'review') {
    const totals = calculateTotals();
    const allHoles = [...holesData];
    
    return (
      <div className="log-round-container">
        <h1>Review Round</h1>
        <h2>{courseName}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="review-summary">
          <h3>Round Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <label>Total Score:</label>
              <span>{totals.totalScore}</span>
            </div>
            <div className="stat-item">
              <label>Fairways Hit:</label>
              <span>{totals.fairwaysHit}/{totals.totalFairways}</span>
            </div>
            <div className="stat-item">
              <label>Greens in Regulation:</label>
              <span>{totals.greensHit}/{totals.totalGreens}</span>
            </div>
            <div className="stat-item">
              <label>Total Putts:</label>
              <span>{totals.totalPutts}</span>
            </div>
          </div>

          <div className="holes-review">
            <h4>Hole by Hole:</h4>
            <div className="holes-grid">
              {allHoles.map((hole, index) => (
                <div key={index} className="hole-summary">
                  <strong>Hole {hole.hole}</strong>
                  <span>Score: {hole.score}</span>
                  <span>Putts: {hole.putts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="review-buttons">
          <button 
            className="back-btn"
            onClick={() => setStep('holes')}
          >
            Edit Holes
          </button>
          <button 
            className="submit-btn"
            onClick={handleSubmitRound}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Round'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Log_Round;
