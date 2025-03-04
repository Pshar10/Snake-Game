import React, { useState } from 'react';
import { Github } from 'lucide-react';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'leaderboard'>('game');
  const [playerName, setPlayerName] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setIsNameSet(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-black/30 p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Snaky Sprint</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentView('game')}
              className={`px-4 py-2 rounded-md transition-colors ${currentView === 'game' ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Game
            </button>
            <button 
              onClick={() => setCurrentView('leaderboard')}
              className={`px-4 py-2 rounded-md transition-colors ${currentView === 'leaderboard' ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              Leaderboard
            </button>
          </div>
        </header>
        
        <main className="p-6">
          {currentView === 'game' ? (
            <Game playerName={playerName} isNameSet={isNameSet} onStartGame={handleStartGame} />
          ) : (
            <Leaderboard />
          )}
        </main>
        
        <footer className="bg-black/30 p-4 text-white/70 text-sm flex justify-between items-center">
          <div>© 2025 Snaky Sprint</div>
          <a 
            href="https://github.com/yourusername/snaky-sprint" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <Github size={18} />
            <span>View on GitHub</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;