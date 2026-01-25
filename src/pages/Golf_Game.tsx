import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { golfService, type GolfRound, type YTDStats } from "../services/golfService";
import "./Golf_Game.css";

interface Achievement {
  id: string;
  title: string;
  description: string;
  threshold: number;
  medal: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  icon: string;
}

function Golf_Game() {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState<GolfRound[]>([]);
  const [stats, setStats] = useState<YTDStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roundsData, statsData] = await Promise.all([
          golfService.getRounds(),
          golfService.getYTDStats()
        ]);
        setRounds(roundsData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define achievements
  const achievements: Achievement[] = [
    // Rounds Played
    { id: "rounds-1", title: "Getting Started", description: "Log 5 rounds", threshold: 5, medal: "Bronze", icon: "🏌️" },
    { id: "rounds-2", title: "Regular Player", description: "Log 20 rounds", threshold: 20, medal: "Bronze", icon: "🏌️" },
    { id: "rounds-3", title: "Dedicated Golfer", description: "Log 60 rounds", threshold: 60, medal: "Silver", icon: "🏌️" },
    { id: "rounds-4", title: "Golf Enthusiast", description: "Log 100 rounds", threshold: 100, medal: "Gold", icon: "🏌️" },
    { id: "rounds-5", title: "Course Master", description: "Log 150+ rounds", threshold: 150, medal: "Platinum", icon: "🏌️" },
    
    // FIR (Fairways in Regulation)
    { id: "fir-1", title: "Straight Shooter", description: "Achieve 50% FIR average", threshold: 50, medal: "Bronze", icon: "🎯" },
    { id: "fir-2", title: "Fairway Finder", description: "Achieve 60% FIR average", threshold: 60, medal: "Silver", icon: "🎯" },
    { id: "fir-3", title: "Laser Precision", description: "Achieve 70% FIR average", threshold: 70, medal: "Gold", icon: "🎯" },
    { id: "fir-4", title: "Fairway Legend", description: "Achieve 80%+ FIR average", threshold: 80, medal: "Platinum", icon: "🎯" },
    
    // GIR (Greens in Regulation)
    { id: "gir-1", title: "On Target", description: "Achieve 40% GIR average", threshold: 40, medal: "Bronze", icon: "🎪" },
    { id: "gir-2", title: "Green Seeker", description: "Achieve 50% GIR average", threshold: 50, medal: "Silver", icon: "🎪" },
    { id: "gir-3", title: "Pin Hunter", description: "Achieve 60% GIR average", threshold: 60, medal: "Gold", icon: "🎪" },
    { id: "gir-4", title: "Green Machine", description: "Achieve 70%+ GIR average", threshold: 70, medal: "Platinum", icon: "🎪" },
    
    // Putting
    { id: "putts-1", title: "Putter Pro", description: "Average under 34 putts", threshold: 34, medal: "Bronze", icon: "⛳" },
    { id: "putts-2", title: "Smooth Roller", description: "Average under 32 putts", threshold: 32, medal: "Silver", icon: "⛳" },
    { id: "putts-3", title: "Putting Wizard", description: "Average under 30 putts", threshold: 30, medal: "Gold", icon: "⛳" },
    { id: "putts-4", title: "Putting Master", description: "Average under 28 putts", threshold: 28, medal: "Platinum", icon: "⛳" },
    
    // Scoring
    { id: "score-1", title: "Breaking 100", description: "Score under 100", threshold: 100, medal: "Bronze", icon: "⭐" },
    { id: "score-2", title: "Breaking 90", description: "Score under 90", threshold: 90, medal: "Silver", icon: "⭐" },
    { id: "score-3", title: "Breaking 80", description: "Score under 80", threshold: 80, medal: "Gold", icon: "⭐" },
    { id: "score-4", title: "Scratch Golfer", description: "Score par or better (72)", threshold: 72, medal: "Platinum", icon: "⭐" },
  ];

  // Check if achievement is unlocked
  const isAchievementUnlocked = (achievement: Achievement): boolean => {
    if (!stats || stats.total_rounds === 0) return false;

    switch (true) {
      case achievement.id.startsWith("rounds-"):
        return stats.total_rounds >= achievement.threshold;
      
      case achievement.id.startsWith("fir-"):
        return stats.fir_percentage >= achievement.threshold;
      
      case achievement.id.startsWith("gir-"):
        return stats.gir_percentage >= achievement.threshold;
      
      case achievement.id.startsWith("putts-"):
        return stats.average_putts <= achievement.threshold;
      
      case achievement.id.startsWith("score-"):
        // Find the best (lowest) score
        if (rounds.length === 0) return false;
        const bestScore = Math.min(...rounds.map(r => r.score));
        return bestScore <= achievement.threshold;
      
      default:
        return false;
    }
  };

  // Get current progress for an achievement
  const getProgress = (achievement: Achievement): { current: number; target: number; text: string } => {
    if (!stats) return { current: 0, target: achievement.threshold, text: "0" };

    switch (true) {
      case achievement.id.startsWith("rounds-"):
        return {
          current: stats.total_rounds,
          target: achievement.threshold,
          text: `${stats.total_rounds}/${achievement.threshold} rounds`
        };
      
      case achievement.id.startsWith("fir-"):
        return {
          current: stats.fir_percentage,
          target: achievement.threshold,
          text: `${stats.fir_percentage.toFixed(1)}%/${achievement.threshold}%`
        };
      
      case achievement.id.startsWith("gir-"):
        return {
          current: stats.gir_percentage,
          target: achievement.threshold,
          text: `${stats.gir_percentage.toFixed(1)}%/${achievement.threshold}%`
        };
      
      case achievement.id.startsWith("putts-"):
        return {
          current: achievement.threshold - stats.average_putts,
          target: achievement.threshold,
          text: `${stats.average_putts.toFixed(1)}/${achievement.threshold} avg putts`
        };
      
      case achievement.id.startsWith("score-"):
        const bestScore = rounds.length > 0 ? Math.min(...rounds.map(r => r.score)) : 999;
        return {
          current: achievement.threshold - bestScore,
          target: achievement.threshold,
          text: `Best: ${bestScore === 999 ? '--' : bestScore} / Target: ${achievement.threshold}`
        };
      
      default:
        return { current: 0, target: achievement.threshold, text: "N/A" };
    }
  };

  const getMedalColor = (medal: string): string => {
    switch (medal) {
      case "Bronze": return "#CD7F32";
      case "Silver": return "#C0C0C0";
      case "Gold": return "#FFD700";
      case "Platinum": return "#E5E4E2";
      case "Diamond": return "#B9F2FF";
      default: return "#888";
    }
  };

  const unlockedAchievements = achievements.filter(isAchievementUnlocked);
  const lockedAchievements = achievements.filter(a => !isAchievementUnlocked(a));

  if (isLoading) {
    return (
      <div className="achievements-container">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <h1>Achievements</h1>
        <p>Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <h1>Achievements</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="achievements-summary">
        <p>{unlockedAchievements.length} of {achievements.length} Unlocked</p>
      </div>

      {stats && stats.total_rounds === 0 ? (
        <p className="no-achievements">Start logging rounds to unlock achievements!</p>
      ) : (
        <>
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <>
              <div className="section-divider">
                <h2>Unlocked</h2>
              </div>
              <div className="achievements-list">
                {unlockedAchievements.map(achievement => {
                  const progress = getProgress(achievement);
                  return (
                    <div key={achievement.id} className="achievement-card unlocked">
                      <div className="achievement-header">
                        <h3>{achievement.title}</h3>
                        <div 
                          className="achievement-medal" 
                          style={{ backgroundColor: getMedalColor(achievement.medal) }}
                        >
                          {achievement.medal}
                        </div>
                      </div>
                      
                      <div className="achievement-details">
                        <div className="achievement-stat">
                          <label>Description:</label>
                          <span className="achievement-stat-value">{achievement.description}</span>
                        </div>
                        
                        <div className="achievement-stat">
                          <label>Progress:</label>
                          <span className="achievement-stat-value">{progress.text}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <>
              <div className="section-divider">
                <h2>Locked</h2>
              </div>
              <div className="achievements-list">
                {lockedAchievements.map(achievement => {
                  const progress = getProgress(achievement);
                  const progressPercentage = Math.min(
                    (progress.current / progress.target) * 100,
                    100
                  );
                  
                  return (
                    <div key={achievement.id} className="achievement-card locked">
                      <div className="achievement-header">
                        <h3>{achievement.title}</h3>
                        <div 
                          className="achievement-medal" 
                          style={{ backgroundColor: getMedalColor(achievement.medal) }}
                        >
                          {achievement.medal}
                        </div>
                      </div>
                      
                      <div className="achievement-details">
                        <div className="achievement-stat">
                          <label>Description:</label>
                          <span className="achievement-stat-value">{achievement.description}</span>
                        </div>
                        
                        <div className="achievement-stat">
                          <label>Progress:</label>
                          <span className="achievement-stat-value">{progress.text}</span>
                        </div>
                      </div>
                      
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Golf_Game;
