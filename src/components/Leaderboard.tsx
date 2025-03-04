import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, RefreshCw } from 'lucide-react';
import { getLeaderboard } from '../services/leaderboardService';
import { LeaderboardEntry } from '../types';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-400'; // Gold
      case 1: return 'text-gray-300'; // Silver
      case 2: return 'text-amber-600'; // Bronze
      default: return 'text-white/50';
    }
  };

  return (
    <div className="bg-black/40 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="text-yellow-400" />
          Leaderboard
        </h2>
        <button 
          onClick={fetchLeaderboard}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 text-white/70">
          <p className="text-xl mb-2">No scores yet!</p>
          <p>Be the first to play and set a high score.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-black/50 text-white/80">
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Player</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr 
                  key={index} 
                  className={`border-t border-white/10 ${index < 3 ? 'bg-white/5' : ''} hover:bg-white/10 transition-colors`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <Medal className={getMedalColor(index)} size={20} />
                      ) : (
                        <span className="text-white/50 w-5 text-center">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{entry.playerName}</td>
                  <td className="py-3 px-4 text-right text-white font-bold">{entry.score}</td>
                  <td className="py-3 px-4 text-right text-white/70 flex items-center justify-end gap-1">
                    <Clock size={14} />
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;