import { LeaderboardEntry } from '../types';

// In a real application, this would be an API call to a backend server
// For now, we'll use localStorage to persist the leaderboard data

const LEADERBOARD_KEY = 'snaky-sprint-leaderboard';

// Get leaderboard data
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const storedData = localStorage.getItem(LEADERBOARD_KEY);
    if (storedData) {
      const leaderboard: LeaderboardEntry[] = JSON.parse(storedData);
      // Sort by score (highest first)
      return leaderboard.sort((a, b) => b.score - a.score);
    }
    return [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Save a new score
export const saveScore = async (playerName: string, score: number): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const newEntry: LeaderboardEntry = {
      playerName,
      score,
      date: new Date().toISOString()
    };
    
    const currentLeaderboard = await getLeaderboard();
    const updatedLeaderboard = [...currentLeaderboard, newEntry];
    
    // Sort and limit to top 100 scores
    const sortedLeaderboard = updatedLeaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedLeaderboard));
  } catch (error) {
    console.error('Error saving score:', error);
    throw new Error('Failed to save score');
  }
};

// Clear leaderboard (for testing)
export const clearLeaderboard = async (): Promise<void> => {
  localStorage.removeItem(LEADERBOARD_KEY);
};