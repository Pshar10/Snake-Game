import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react';
import { useGameLogic } from '../hooks/useGameLogic';
import { saveScore } from '../services/leaderboardService';

interface GameProps {
  playerName: string;
  isNameSet: boolean;
  onStartGame: (name: string) => void;
}

const Game: React.FC<GameProps> = ({ playerName, isNameSet, onStartGame }) => {
  const [nameInput, setNameInput] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    snake,
    food,
    direction,
    score,
    gameOver,
    isPaused,
    setDirection,
    resetGame,
    togglePause,
    gridSize,
    cellSize
  } = useGameLogic(canvasRef);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (countdown !== null) return; // Ignore key presses during countdown
    
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
        togglePause();
        break;
      default:
        break;
    }
  }, [direction, setDirection, togglePause, countdown]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSubmitScore = async () => {
    if (playerName && score > 0) {
      await saveScore(playerName, score);
      resetGame();
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onStartGame(nameInput.trim());
      // Start countdown when name is submitted
      setCountdown(3);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // When countdown reaches 0, start the game
      const timer = setTimeout(() => {
        setCountdown(null);
        togglePause(); // Unpause the game when countdown finishes
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, togglePause]);

  // Reset countdown when game is reset
  useEffect(() => {
    if (gameOver) {
      setCountdown(null);
    }
  }, [gameOver]);

  const startNewGame = () => {
    resetGame();
    setCountdown(3);
  };

  if (!isNameSet) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="bg-black/40 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Your Name</h2>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={15}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Play size={18} />
              Start Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={gridSize * cellSize}
            height={gridSize * cellSize}
            className="bg-black/80 rounded-lg shadow-lg"
          />
          
          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {countdown === 0 ? "GO!" : countdown}
                </h2>
                <p className="text-white/70">Get ready...</p>
              </div>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
              <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
              <p className="text-xl text-white mb-6">Your score: {score}</p>
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitScore}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                  <Trophy size={18} />
                  Save Score
                </button>
                <button
                  onClick={startNewGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Play Again
                </button>
              </div>
            </div>
          )}
          
          {isPaused && !gameOver && countdown === null && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <h2 className="text-3xl font-bold text-white">Paused</h2>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-white">
            <p className="text-lg">Player: <span className="font-bold">{playerName}</span></p>
            <p className="text-2xl mt-1">Score: <span className="font-bold">{score}</span></p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={togglePause}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              disabled={countdown !== null}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={startNewGame}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              disabled={countdown !== null}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="md:w-64 bg-black/40 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">How to Play</h2>
        <ul className="text-white/80 space-y-2 text-sm">
          <li>• Use <span className="font-bold">arrow keys</span> to control the snake</li>
          <li>• Eat food to grow and earn points</li>
          <li>• Avoid hitting walls and yourself</li>
          <li>• Press <span className="font-bold">space</span> to pause/resume</li>
        </ul>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-lg font-bold text-white mb-2">Controls</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div></div>
            <div className="bg-white/20 p-2 rounded">↑</div>
            <div></div>
            <div className="bg-white/20 p-2 rounded">←</div>
            <div className="bg-white/20 p-2 rounded">↓</div>
            <div className="bg-white/20 p-2 rounded">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;