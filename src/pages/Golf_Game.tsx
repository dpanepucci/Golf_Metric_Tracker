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
  const [currentTheme, setCurrentTheme] = useState<'original' | 'forest' | 'midnight' | 'sage' | 'slate'>('original');

  // Theme definitions
  const themes = {
    original: {
      primaryDark: '#5f5933',
      primaryCream: '#f9e6bf',
      secondaryBlue: '#3c505c',
      sageGray: '#9caca7',
      mutedGreen: '#6c844c'
    },
    forest: {
      primaryDark: '#212914',
      primaryCream: '#d9bf77',
      secondaryBlue: '#3d060f',
      sageGray: '#3d422e',
      mutedGreen: '#5c6f42'
    },
    midnight: {
      primaryDark: '#070c05',
      primaryCream: '#c7d1e2',
      secondaryBlue: '#067971',
      sageGray: '#4f612a',
      mutedGreen: '#c4ac6c'
    },
    sage: {
      primaryDark: '#122710',
      primaryCream: '#bccd93',
      secondaryBlue: '#749950',
      sageGray: '#040c04',
      mutedGreen: '#141310'
    },
    slate: {
      primaryDark: '#2f4f4f',
      primaryCream: '#e5e4e2',
      secondaryBlue: '#708090',
      sageGray: '#778899',
      mutedGreen: '#b0c4de'
    }
  };

  // Apply theme to document
  const applyTheme = (themeName: 'original' | 'forest' | 'midnight' | 'sage' | 'slate') => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-dark', theme.primaryDark);
    root.style.setProperty('--primary-cream', theme.primaryCream);
    root.style.setProperty('--secondary-blue', theme.secondaryBlue);
    root.style.setProperty('--sage-gray', theme.sageGray);
    root.style.setProperty('--muted-green', theme.mutedGreen);
    
    setCurrentTheme(themeName);
    localStorage.setItem('golf-theme', themeName);
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('golf-theme') as 'original' | 'forest' | 'midnight' | 'sage' | 'slate' | null;
    if (savedTheme && ['original', 'forest', 'midnight', 'sage', 'slate'].includes(savedTheme)) {
      applyTheme(savedTheme);
    }
  }, []);

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
    { id: "fir-1", title: "Straight Shooter", description: "Hit 50%+ FIR in a round", threshold: 50, medal: "Bronze", icon: "🎯" },
    { id: "fir-2", title: "Fairway Finder", description: "Hit 60%+ FIR in a round", threshold: 60, medal: "Silver", icon: "🎯" },
    { id: "fir-3", title: "Laser Precision", description: "Hit 70%+ FIR in a round", threshold: 70, medal: "Gold", icon: "🎯" },
    { id: "fir-4", title: "Fairway Legend", description: "Hit 80%+ FIR in a round", threshold: 80, medal: "Platinum", icon: "🎯" },
    
    // GIR (Greens in Regulation)
    { id: "gir-1", title: "On Target", description: "Hit 40%+ GIR in a round", threshold: 40, medal: "Bronze", icon: "🎪" },
    { id: "gir-2", title: "Green Seeker", description: "Hit 50%+ GIR in a round", threshold: 50, medal: "Silver", icon: "🎪" },
    { id: "gir-3", title: "Pin Hunter", description: "Hit 60%+ GIR in a round", threshold: 60, medal: "Gold", icon: "🎪" },
    { id: "gir-4", title: "Green Machine", description: "Hit 70%+ GIR in a round", threshold: 70, medal: "Platinum", icon: "🎪" },
    
    // Putting
    { id: "putts-1", title: "Putter Pro", description: "34 putts or less in a round", threshold: 34, medal: "Bronze", icon: "⛳" },
    { id: "putts-2", title: "Smooth Roller", description: "32 putts or less in a round", threshold: 32, medal: "Silver", icon: "⛳" },
    { id: "putts-3", title: "Putting Wizard", description: "30 putts or less in a round", threshold: 30, medal: "Gold", icon: "⛳" },
    { id: "putts-4", title: "Putting Master", description: "28 putts or less in a round", threshold: 28, medal: "Platinum", icon: "⛳" },
    
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
        // Check if any round has FIR percentage >= threshold
        return rounds.some(round => {
          const firPercentage = (round.fairways_hit / round.total_fairways) * 100;
          return firPercentage >= achievement.threshold;
        });
      
      case achievement.id.startsWith("gir-"):
        // Check if any round has GIR percentage >= threshold
        return rounds.some(round => {
          const girPercentage = (round.greens_in_regulation / round.total_greens) * 100;
          return girPercentage >= achievement.threshold;
        });
      
      case achievement.id.startsWith("putts-"):
        // Check if any round has putts <= threshold
        return rounds.some(round => round.total_putts <= achievement.threshold);
      
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
        const bestFir = rounds.length > 0 
          ? Math.max(...rounds.map(r => (r.fairways_hit / r.total_fairways) * 100))
          : 0;
        return {
          current: bestFir,
          target: achievement.threshold,
          text: `Best: ${bestFir.toFixed(1)}% / Target: ${achievement.threshold}%`
        };
      
      case achievement.id.startsWith("gir-"):
        const bestGir = rounds.length > 0
          ? Math.max(...rounds.map(r => (r.greens_in_regulation / r.total_greens) * 100))
          : 0;
        return {
          current: bestGir,
          target: achievement.threshold,
          text: `Best: ${bestGir.toFixed(1)}% / Target: ${achievement.threshold}%`
        };
      
      case achievement.id.startsWith("putts-"):
        const bestPutts = rounds.length > 0
          ? Math.min(...rounds.map(r => r.total_putts))
          : 99;
        return {
          current: achievement.threshold - bestPutts,
          target: achievement.threshold,
          text: `Best: ${bestPutts === 99 ? '--' : bestPutts} / Target: ${achievement.threshold}`
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

  // Calculate level based on achievements unlocked
  const getLevelInfo = (achievementsUnlocked: number): { level: number; nextLevelAt: number; isMaxLevel: boolean } => {
    if (achievementsUnlocked < 3) return { level: 1, nextLevelAt: 4, isMaxLevel: false };
    if (achievementsUnlocked >= 4 && achievementsUnlocked <= 6) return { level: 2, nextLevelAt: 7, isMaxLevel: false };
    if (achievementsUnlocked >= 7 && achievementsUnlocked <= 11) return { level: 3, nextLevelAt: 12, isMaxLevel: false };
    if (achievementsUnlocked >= 12 && achievementsUnlocked <= 15) return { level: 4, nextLevelAt: 16, isMaxLevel: false };
    return { level: 5, nextLevelAt: 0, isMaxLevel: true };
  };

  // Get required level for a theme
  const getThemeRequiredLevel = (themeName: string): number => {
    switch (themeName) {
      case 'original': return 1;
      case 'forest': return 2;
      case 'midnight': return 3;
      case 'sage': return 4;
      case 'slate': return 5;
      default: return 1;
    }
  };

  const unlockedAchievements = achievements.filter(isAchievementUnlocked);
  const lockedAchievements = achievements.filter(a => !isAchievementUnlocked(a));
  const levelInfo = getLevelInfo(unlockedAchievements.length);

  // Check if current theme is still unlocked, if not reset to original
  // Only run this check after data has loaded to avoid resetting during initial render
  useEffect(() => {
    if (isLoading) return; // Don't check until data is loaded
    
    const requiredLevel = getThemeRequiredLevel(currentTheme);
    if (levelInfo.level < requiredLevel) {
      // User no longer has access to this theme, reset to original
      applyTheme('original');
    }
  }, [levelInfo.level, currentTheme, isLoading]);

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

      {/* Level Display */}
      <div className="level-card">
        <div className="level-header">
          <h3>Player Level</h3>
          <div className="level-badge">Level {levelInfo.level}</div>
        </div>
        
        <div className="level-details">
          <div className="level-stat">
            <label>Current Level:</label>
            <span className="level-stat-value">Level {levelInfo.level}</span>
          </div>
          
          <div className="level-stat">
            <label>{levelInfo.isMaxLevel ? 'Status:' : 'Next Level At:'}</label>
            <span className="level-stat-value">
              {levelInfo.isMaxLevel ? 'Max Level!' : `${levelInfo.nextLevelAt} Achievements`}
            </span>
          </div>
        </div>
        
        {!levelInfo.isMaxLevel && (
          <div className="level-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(unlockedAchievements.length / levelInfo.nextLevelAt) * 100}%` 
                }}
              />
            </div>
            <p className="progress-label">
              {levelInfo.nextLevelAt - unlockedAchievements.length} more to Level {levelInfo.level + 1}
            </p>
          </div>
        )}
      </div>

      {/* Theme Switcher - Unlocks at Level 2 */}
      {levelInfo.level >= 2 && (
        <div className="theme-switcher-card">
          <div className="theme-header">
            <h3>Themes Unlocked!</h3>
            <span className="unlock-badge">Level {levelInfo.level} Rewards</span>
          </div>
          <p className="theme-description">Choose your preferred color theme:</p>
          <div className="theme-buttons">
            <button 
              className={`theme-btn ${currentTheme === 'original' ? 'active' : ''}`}
              onClick={() => applyTheme('original')}
            >
              <div className="theme-preview original-preview"></div>
              <span>Classic Golf</span>
            </button>
            <button 
              className={`theme-btn ${currentTheme === 'forest' ? 'active' : ''}`}
              onClick={() => applyTheme('forest')}
            >
              <div className="theme-preview forest-preview"></div>
              <span>Forest Green</span>
            </button>
            {levelInfo.level >= 3 && (
              <button 
                className={`theme-btn ${currentTheme === 'midnight' ? 'active' : ''}`}
                onClick={() => applyTheme('midnight')}
              >
                <div className="theme-preview midnight-preview"></div>
                <span>Midnight Blue</span>
              </button>
            )}
            {levelInfo.level >= 4 && (
              <button 
                className={`theme-btn ${currentTheme === 'sage' ? 'active' : ''}`}
                onClick={() => applyTheme('sage')}
              >
                <div className="theme-preview sage-preview"></div>
                <span>Sage Garden</span>
              </button>
            )}
            {levelInfo.level >= 5 && (
              <button 
                className={`theme-btn ${currentTheme === 'slate' ? 'active' : ''}`}
                onClick={() => applyTheme('slate')}
              >
                <div className="theme-preview slate-preview"></div>
                <span>Slate Gray</span>
              </button>
            )}
          </div>
        </div>
      )}

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
