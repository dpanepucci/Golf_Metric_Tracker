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
  isSpecial?: boolean;
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
    { id: "putts-1", title: "Putter Pro", description: "40 putts or less in a round", threshold: 40, medal: "Bronze", icon: "⛳" },
    { id: "putts-2", title: "Smooth Roller", description: "38 putts or less in a round", threshold: 38, medal: "Silver", icon: "⛳" },
    { id: "putts-3", title: "Putting Wizard", description: "36 putts or less in a round", threshold: 36, medal: "Gold", icon: "⛳" },
    { id: "putts-4", title: "Putting Master", description: "34 putts or less in a round", threshold: 34, medal: "Platinum", icon: "⛳" },
    
    // Scoring
    { id: "score-1", title: "Breaking 100", description: "Score under 100", threshold: 100, medal: "Bronze", icon: "⭐" },
    { id: "score-2", title: "Breaking 90", description: "Score under 90", threshold: 90, medal: "Silver", icon: "⭐" },
    { id: "score-3", title: "Breaking 80", description: "Score under 80", threshold: 80, medal: "Gold", icon: "⭐" },
    { id: "score-4", title: "Scratch Golfer", description: "Score par or better (72)", threshold: 72, medal: "Platinum", icon: "⭐" },

    // Offseason Rounds (Nov-Mar)
    { id: "offseason-1", title: "Frosty Fairways", description: "Play 3-4 rounds in the offseason", threshold: 3, medal: "Bronze", icon: "❄️" },
    { id: "offseason-2", title: "Cold-Weather Grinder", description: "Play 5-6 rounds in the offseason", threshold: 5, medal: "Silver", icon: "❄️" },
    { id: "offseason-3", title: "Winter Warrior", description: "Play 7-8 rounds in the offseason", threshold: 7, medal: "Gold", icon: "❄️" },
    { id: "offseason-4", title: "Snowbird Ace", description: "Play 9+ rounds in the offseason", threshold: 9, medal: "Platinum", icon: "❄️" },
    
    // Special Achievements
    { id: "double-trouble", title: "Double Trouble", description: "Hit all fairways and greens in one round", threshold: 1, medal: "Diamond", icon: "💎", isSpecial: true },
    { id: "consistent-10", title: "Mr. Consistent", description: "Play 10 rounds within 5 strokes of each other", threshold: 10, medal: "Silver", icon: "📊", isSpecial: true },
    { id: "marathon-man", title: "Marathon Man", description: "Log 10 rounds in a single month", threshold: 10, medal: "Silver", icon: "🏃", isSpecial: true },
    { id: "get-a-job", title: "Get a Job!", description: "Log 3 consecutive 18-hole rounds in a single week", threshold: 3, medal: "Bronze", icon: "💼", isSpecial: true },
    { id: "max-level-8", title: "Level 8 Legend", description: "Reach Player Level 8", threshold: 8, medal: "Diamond", icon: "👑", isSpecial: true },
  ];

  // Check if achievement is unlocked
  const isAchievementUnlocked = (achievement: Achievement): boolean => {
    if (!stats || stats.total_rounds === 0) return false;

    switch (true) {
      case achievement.id.startsWith("rounds-"):
        return stats.total_rounds >= achievement.threshold;
      
      case achievement.id.startsWith("fir-"):
        // Check if any 18-hole round has FIR percentage >= threshold
        return rounds.some(round => {
          if (round.total_greens !== 18) return false;
          const firPercentage = (round.fairways_hit / round.total_fairways) * 100;
          return firPercentage >= achievement.threshold;
        });
      
      case achievement.id.startsWith("gir-"):
        // Check if any 18-hole round has GIR percentage >= threshold
        return rounds.some(round => {
          if (round.total_greens !== 18) return false;
          const girPercentage = (round.greens_in_regulation / round.total_greens) * 100;
          return girPercentage >= achievement.threshold;
        });
      
      case achievement.id.startsWith("putts-"):
        // Check if any 18-hole round has putts <= threshold
        return rounds.some(round => round.total_greens === 18 && round.total_putts <= achievement.threshold);
      
      case achievement.id.startsWith("score-"):
        // Find the best (lowest) score from 18-hole rounds only
        const fullRounds = rounds.filter(r => r.total_greens === 18);
        if (fullRounds.length === 0) return false;
        const bestScore = Math.min(...fullRounds.map(r => r.score));
        return bestScore <= achievement.threshold;

      case achievement.id.startsWith("offseason-"):
        // Offseason months: Nov, Dec, Jan, Feb, Mar
        const offseasonRounds = rounds.filter(round => {
          const month = new Date(round.date).getMonth();
          return [10, 11, 0, 1, 2].includes(month);
        }).length;
        return offseasonRounds >= achievement.threshold;
      
      case achievement.id === "double-trouble":
        // Check if any 18-hole round has perfect fairways AND perfect greens
        return rounds.some(round => 
          round.total_greens === 18 &&
          round.fairways_hit === round.total_fairways && 
          round.greens_in_regulation === round.total_greens
        );
      
      case achievement.id === "consistent-10":
        // Check if user has 10+ 18-hole rounds within 5 strokes of each other
        const fullRoundsConsistent = rounds.filter(r => r.total_greens === 18);
        if (fullRoundsConsistent.length < 10) return false;
        const sortedScores = fullRoundsConsistent.map(r => r.score).sort((a, b) => a - b);
        // Check each window of 10 consecutive scores
        for (let i = 0; i <= sortedScores.length - 10; i++) {
          const window = sortedScores.slice(i, i + 10);
          const range = window[window.length - 1] - window[0];
          if (range <= 5) return true;
        }
        return false;
      
      case achievement.id === "marathon-man":
        // Check if user has 10+ rounds in any single month
        const roundsByMonth: { [key: string]: number } = {};
        rounds.forEach(round => {
          const monthKey = round.date.substring(0, 7); // YYYY-MM format
          roundsByMonth[monthKey] = (roundsByMonth[monthKey] || 0) + 1;
        });
        return Object.values(roundsByMonth).some(count => count >= 10);
      
      case achievement.id === "get-a-job":
        // Check if user has 3 consecutive 18-hole rounds within a single week (7 days)
        if (rounds.length < 3) return false;
        // Sort rounds by date
        const sortedRounds = [...rounds].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        // Check for 3 consecutive 18-hole rounds within 7 days
        for (let i = 0; i <= sortedRounds.length - 3; i++) {
          if (
            sortedRounds[i].total_greens === 18 &&
            sortedRounds[i + 1].total_greens === 18 &&
            sortedRounds[i + 2].total_greens === 18
          ) {
            // Check if all 3 rounds are within 7 days of each other
            const firstDate = new Date(sortedRounds[i].date).getTime();
            const thirdDate = new Date(sortedRounds[i + 2].date).getTime();
            const daysDifference = (thirdDate - firstDate) / (1000 * 60 * 60 * 24);
            if (daysDifference <= 7) {
              return true;
            }
          }
        }
        return false;
      
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
        const fullRoundsFir = rounds.filter(r => r.total_greens === 18);
        const bestFir = fullRoundsFir.length > 0 
          ? Math.max(...fullRoundsFir.map(r => (r.fairways_hit / r.total_fairways) * 100))
          : 0;
        return {
          current: bestFir,
          target: achievement.threshold,
          text: `Best: ${bestFir.toFixed(1)}% / Target: ${achievement.threshold}%`
        };
      
      case achievement.id.startsWith("gir-"):
        const fullRoundsGir = rounds.filter(r => r.total_greens === 18);
        const bestGir = fullRoundsGir.length > 0
          ? Math.max(...fullRoundsGir.map(r => (r.greens_in_regulation / r.total_greens) * 100))
          : 0;
        return {
          current: bestGir,
          target: achievement.threshold,
          text: `Best: ${bestGir.toFixed(1)}% / Target: ${achievement.threshold}%`
        };
      
      case achievement.id.startsWith("putts-"):
        const fullRoundsPutts = rounds.filter(r => r.total_greens === 18);
        const bestPutts = fullRoundsPutts.length > 0
          ? Math.min(...fullRoundsPutts.map(r => r.total_putts))
          : 99;
        return {
          current: achievement.threshold - bestPutts,
          target: achievement.threshold,
          text: `Best: ${bestPutts === 99 ? '--' : bestPutts} / Target: ${achievement.threshold}`
        };
      
      case achievement.id.startsWith("score-"):
        const fullRoundsScore = rounds.filter(r => r.total_greens === 18);
        const bestScore = fullRoundsScore.length > 0 ? Math.min(...fullRoundsScore.map(r => r.score)) : 999;
        return {
          current: achievement.threshold - bestScore,
          target: achievement.threshold,
          text: `Best: ${bestScore === 999 ? '--' : bestScore} / Target: ${achievement.threshold}`
        };

      case achievement.id.startsWith("offseason-"):
        const offseasonCount = rounds.filter(round => {
          const month = new Date(round.date).getMonth();
          return [10, 11, 0, 1, 2].includes(month);
        }).length;
        return {
          current: offseasonCount,
          target: achievement.threshold,
          text: `${offseasonCount}/${achievement.threshold} offseason rounds`
        };
      
      case achievement.id === "max-level-8":
        const unlockedCount = achievements
          .filter(a => a.id !== "max-level-8")
          .filter(isAchievementUnlocked).length;
        const currentLevel = getLevelInfo(unlockedCount).level;
        return {
          current: currentLevel,
          target: 8,
          text: currentLevel >= 8 ? "Level 8 achieved!" : `Level ${currentLevel} / 8`
        };

      case achievement.id === "double-trouble":
        const perfectRounds = rounds.filter(round => 
          round.total_greens === 18 &&
          round.fairways_hit === round.total_fairways && 
          round.greens_in_regulation === round.total_greens
        ).length;
        return {
          current: perfectRounds,
          target: 1,
          text: perfectRounds > 0 ? "Perfect round achieved!" : "Not yet achieved"
        };
      
      case achievement.id === "consistent-10":
        const fullRoundsConsistentProgress = rounds.filter(r => r.total_greens === 18);
        if (fullRoundsConsistentProgress.length < 10) {
          return {
            current: fullRoundsConsistentProgress.length,
            target: 10,
            text: `${fullRoundsConsistentProgress.length}/10 full rounds logged`
          };
        }
        const sortedScores = fullRoundsConsistentProgress.map(r => r.score).sort((a, b) => a - b);
        let minRange = Infinity;
        for (let i = 0; i <= sortedScores.length - 10; i++) {
          const window = sortedScores.slice(i, i + 10);
          const range = window[window.length - 1] - window[0];
          if (range < minRange) minRange = range;
        }
        return {
          current: Math.max(0, 5 - minRange),
          target: 5,
          text: minRange === Infinity ? "Need 10 full rounds" : `Best range: ${minRange} strokes`
        };
      
      case achievement.id === "marathon-man":
        const roundsByMonth: { [key: string]: number } = {};
        rounds.forEach(round => {
          const monthKey = round.date.substring(0, 7);
          roundsByMonth[monthKey] = (roundsByMonth[monthKey] || 0) + 1;
        });
        const maxMonthlyRounds = Object.values(roundsByMonth).length > 0 
          ? Math.max(...Object.values(roundsByMonth)) 
          : 0;
        return {
          current: maxMonthlyRounds,
          target: 10,
          text: `Best month: ${maxMonthlyRounds} rounds`
        };
      
      case achievement.id === "get-a-job":
        if (rounds.length < 3) {
          return {
            current: rounds.length,
            target: 3,
            text: `${rounds.length}/3 rounds logged`
          };
        }
        // Find longest streak of consecutive 18-hole rounds within a week
        const sortedByDate = [...rounds].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        let maxStreakInWeek = 0;
        for (let i = 0; i <= sortedByDate.length - 3; i++) {
          let streak = 0;
          for (let j = i; j < sortedByDate.length; j++) {
            if (sortedByDate[j].total_greens === 18) {
              const daysDiff = (new Date(sortedByDate[j].date).getTime() - new Date(sortedByDate[i].date).getTime()) / (1000 * 60 * 60 * 24);
              if (daysDiff <= 7) {
                streak++;
                if (streak > maxStreakInWeek) maxStreakInWeek = streak;
              }
            }
          }
        }
        return {
          current: Math.min(maxStreakInWeek, 3),
          target: 3,
          text: maxStreakInWeek >= 3 ? "Three 18s in a week!" : `Best streak: ${maxStreakInWeek} rounds in a week`
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

  // Calculate level based on achievements unlocked (8 levels total)
  const getLevelInfo = (achievementsUnlocked: number): { level: number; nextLevelAt: number; isMaxLevel: boolean } => {
    if (achievementsUnlocked <= 2) return { level: 1, nextLevelAt: 3, isMaxLevel: false };
    if (achievementsUnlocked >= 3 && achievementsUnlocked <= 5) return { level: 2, nextLevelAt: 6, isMaxLevel: false };
    if (achievementsUnlocked >= 6 && achievementsUnlocked <= 9) return { level: 3, nextLevelAt: 10, isMaxLevel: false };
    if (achievementsUnlocked >= 10 && achievementsUnlocked <= 13) return { level: 4, nextLevelAt: 14, isMaxLevel: false };
    if (achievementsUnlocked >= 14 && achievementsUnlocked <= 17) return { level: 5, nextLevelAt: 18, isMaxLevel: false };
    if (achievementsUnlocked >= 18 && achievementsUnlocked <= 21) return { level: 6, nextLevelAt: 22, isMaxLevel: false };
    if (achievementsUnlocked >= 22 && achievementsUnlocked <= 24) return { level: 7, nextLevelAt: 25, isMaxLevel: false };
    return { level: 8, nextLevelAt: 0, isMaxLevel: true };
  };

  // Get required level for a theme
  const getThemeRequiredLevel = (themeName: string): number => {
    switch (themeName) {
      case 'original': return 1;
      case 'forest': return 4;
      case 'midnight': return 5;
      case 'sage': return 6;
      case 'slate': return 7;
      default: return 1;
    }
  };

  // Separate regular and special achievements
  const regularAchievements = achievements.filter(a => !a.isSpecial);
  const specialAchievements = achievements.filter(a => a.isSpecial);
  const maxLevelAchievement = specialAchievements.find(a => a.id === "max-level-8");
  const baseSpecialAchievements = specialAchievements.filter(a => a.id !== "max-level-8");
  
  const unlockedAchievements = regularAchievements.filter(isAchievementUnlocked);
  
  const unlockedSpecialAchievements = baseSpecialAchievements.filter(isAchievementUnlocked);
  const lockedSpecialAchievements = baseSpecialAchievements.filter(a => !isAchievementUnlocked(a));
  
  const baseUnlockedCount = unlockedAchievements.length + unlockedSpecialAchievements.length;
  const levelInfo = getLevelInfo(baseUnlockedCount);
  const isMaxLevelAchievementUnlocked = Boolean(maxLevelAchievement && levelInfo.isMaxLevel);
  const unlockedSpecialDisplay = isMaxLevelAchievementUnlocked && maxLevelAchievement
    ? [...unlockedSpecialAchievements, maxLevelAchievement]
    : unlockedSpecialAchievements;
  const lockedSpecialDisplay = !isMaxLevelAchievementUnlocked && maxLevelAchievement
    ? [...lockedSpecialAchievements, maxLevelAchievement]
    : lockedSpecialAchievements;
  const totalUnlockedCount = baseUnlockedCount + (isMaxLevelAchievementUnlocked ? 1 : 0);

  // Calculate achievement counts by medal type
  const getAchievementCounts = () => {
    const bronzeTotal = regularAchievements.filter(a => a.medal === "Bronze").length;
    const bronzeUnlocked = unlockedAchievements.filter(a => a.medal === "Bronze").length;
    
    const silverTotal = regularAchievements.filter(a => a.medal === "Silver").length;
    const silverUnlocked = unlockedAchievements.filter(a => a.medal === "Silver").length;
    
    const goldTotal = regularAchievements.filter(a => a.medal === "Gold").length;
    const goldUnlocked = unlockedAchievements.filter(a => a.medal === "Gold").length;
    
    const platinumTotal = regularAchievements.filter(a => a.medal === "Platinum").length;
    const platinumUnlocked = unlockedAchievements.filter(a => a.medal === "Platinum").length;
    
    const specialTotal = specialAchievements.length;
    const specialUnlocked = unlockedSpecialDisplay.length;
    
    return [
      { type: "Bronze", unlocked: bronzeUnlocked, total: bronzeTotal },
      { type: "Silver", unlocked: silverUnlocked, total: silverTotal },
      { type: "Gold", unlocked: goldUnlocked, total: goldTotal },
      { type: "Platinum", unlocked: platinumUnlocked, total: platinumTotal },
      { type: "Special", unlocked: specialUnlocked, total: specialTotal }
    ].filter(item => item.total > 0); // Only show categories that exist
  };

  const achievementCounts = getAchievementCounts();

  const medalOrder: Achievement["medal"][] = ["Bronze", "Silver", "Gold", "Platinum"];
  const achievementGroups = [
    { key: "rounds", title: "Rounds Played", description: "Log more rounds to climb the ranks." },
    { key: "fir", title: "Fairways in Regulation", description: "Hit fairways consistently in a round." },
    { key: "gir", title: "Greens in Regulation", description: "Reach greens in regulation." },
    { key: "putts", title: "Putting", description: "Fewer putts in a round." },
    { key: "score", title: "Scoring", description: "Lower your total score." },
    { key: "offseason", title: "Offseason Rounds", description: "Keep playing through the winter months." }
  ];

  const groupedRegularAchievements = achievementGroups
    .map(group => {
      const items = regularAchievements
        .filter(achievement => achievement.id.startsWith(`${group.key}-`))
        .sort((a, b) => medalOrder.indexOf(a.medal) - medalOrder.indexOf(b.medal));
      return { ...group, items };
    })
    .filter(group => group.items.length > 0);

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
        <p>{totalUnlockedCount} of {achievements.length} Unlocked</p>
      </div>

      {/* Level Display */}
      <div className="level-card">
        <div className="level-header">
          <h3>Player Level</h3>
          <div className="level-badge">Level {levelInfo.level}</div>
        </div>
        
        {/* Achievement Counts by Type */}
        <div className="achievement-counts">
          {achievementCounts.map(({ type, unlocked, total }) => (
            <div key={type} className="achievement-count-item">
              <span className="count-text">{unlocked}/{total} {type}</span>
            </div>
          ))}
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
                  width: `${(baseUnlockedCount / levelInfo.nextLevelAt) * 100}%` 
                }}
              />
            </div>
            <p className="progress-label">
              {levelInfo.nextLevelAt - baseUnlockedCount} more to Level {levelInfo.level + 1}
            </p>
          </div>
        )}
      </div>

      {/* Theme Switcher - Unlocks at Level 4 */}
      {levelInfo.level >= 4 && (
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
            {levelInfo.level >= 5 && (
              <button 
                className={`theme-btn ${currentTheme === 'midnight' ? 'active' : ''}`}
                onClick={() => applyTheme('midnight')}
              >
                <div className="theme-preview midnight-preview"></div>
                <span>Midnight Blue</span>
              </button>
            )}
            {levelInfo.level >= 6 && (
              <button 
                className={`theme-btn ${currentTheme === 'sage' ? 'active' : ''}`}
                onClick={() => applyTheme('sage')}
              >
                <div className="theme-preview sage-preview"></div>
                <span>Sage Garden</span>
              </button>
            )}
            {levelInfo.level >= 7 && (
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
          {/* Grouped Achievements */}
          {groupedRegularAchievements.length > 0 && (
            <>
              <div className="section-divider">
                <h2>Achievement Categories</h2>
              </div>
              <div className="achievement-groups">
                {groupedRegularAchievements.map(group => {
                  const unlockedCount = group.items.filter(isAchievementUnlocked).length;
                  const groupIcon = group.items[0]?.icon ?? "🏌️";

                  return (
                    <details key={group.key} className="achievement-group">
                      <summary className="achievement-group-summary">
                        <div className="achievement-group-title">
                          <span className="achievement-group-icon">{groupIcon}</span>
                          <div className="achievement-group-text">
                            <h2>{group.title}</h2>
                            <p>{group.description}</p>
                          </div>
                        </div>
                        <div className="achievement-group-status">
                          <span className="group-unlocked-count">{unlockedCount}/{group.items.length} unlocked</span>
                          <span className="group-toggle">View</span>
                        </div>
                      </summary>

                      <div className="achievement-group-list">
                        {group.items.map(achievement => {
                          const progress = getProgress(achievement);
                          const isUnlocked = isAchievementUnlocked(achievement);
                          const progressPercentage = Math.min(
                            (progress.current / progress.target) * 100,
                            100
                          );

                          return (
                            <div
                              key={achievement.id}
                              className={`achievement-tier ${isUnlocked ? "unlocked" : "locked"}`}
                            >
                              <div className="achievement-tier-header">
                                <div className="achievement-tier-title">
                                  <span
                                    className="achievement-tier-medal"
                                    style={{ backgroundColor: getMedalColor(achievement.medal) }}
                                  >
                                    {achievement.medal}
                                  </span>
                                  <h3>{achievement.title}</h3>
                                </div>
                                <span className={`achievement-tier-status ${isUnlocked ? "unlocked" : "locked"}`}>
                                  {isUnlocked ? "Unlocked" : "Locked"}
                                </span>
                              </div>

                              <div className="achievement-details">
                                <div className="achievement-stat">
                                  <label>Requirement:</label>
                                  <span className="achievement-stat-value">{achievement.description}</span>
                                </div>

                                <div className="achievement-stat">
                                  <label>Progress:</label>
                                  <span className="achievement-stat-value">{progress.text}</span>
                                </div>
                              </div>

                              {!isUnlocked && (
                                <div className="achievement-progress">
                                  <div className="progress-bar">
                                    <div
                                      className="progress-fill"
                                      style={{ width: `${progressPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
            </>
          )}

          {/* Unlocked Special Achievements */}
          {unlockedSpecialDisplay.length > 0 && (
            <>
              <div className="section-divider special-section">
                <h2>🌟 Special Achievements Unlocked</h2>
              </div>
              <div className="achievements-list">
                {unlockedSpecialDisplay.map(achievement => {
                  const progress = getProgress(achievement);
                  return (
                    <div key={achievement.id} className="achievement-card unlocked special">
                      <div className="achievement-header">
                        <h3>{achievement.icon} {achievement.title}</h3>
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

          {/* Locked Special Achievements */}
          {lockedSpecialDisplay.length > 0 && (
            <>
              <div className="section-divider special-section">
                <h2>🌟 Special Achievements Locked</h2>
                <p className="special-hint">Rare accomplishments that test your skills</p>
              </div>
              <div className="achievements-list">
                {lockedSpecialDisplay.map(achievement => {
                  const progress = getProgress(achievement);
                  const progressPercentage = Math.min(
                    (progress.current / progress.target) * 100,
                    100
                  );
                  
                  return (
                    <div key={achievement.id} className="achievement-card locked special">
                      <div className="achievement-header">
                        <h3>{achievement.icon} {achievement.title}</h3>
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
