import { useState, useEffect, useRef, RefObject } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export const useGameLogic = (canvasRef: RefObject<HTMLCanvasElement>) => {
  // Game configuration
  const gridSize = 20; // 20x20 grid
  const cellSize = 20; // 20px per cell
  const initialSpeed = 150; // ms per move
  const speedIncrease = 5; // ms faster per food eaten
  const edgeBuffer = 1; // Buffer to keep food away from edges

  // Game state
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true); // Start paused
  const [speed, setSpeed] = useState<number>(initialSpeed);
  
  const lastRenderTimeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number>(0);
  const gameInitializedRef = useRef<boolean>(false);

  // Generate random food position
  const generateFood = (): Position => {
    let newFood: Position;
    do {
      // Generate food position with buffer from edges
      newFood = {
        x: Math.floor(Math.random() * (gridSize - 2 * edgeBuffer)) + edgeBuffer,
        y: Math.floor(Math.random() * (gridSize - 2 * edgeBuffer)) + edgeBuffer
      };
      // Make sure food doesn't spawn on snake
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  };

  // Check if snake collided with itself or walls
  const checkCollision = (head: Position): boolean => {
    // Check wall collision
    if (
      head.x < 0 || 
      head.x >= gridSize || 
      head.y < 0 || 
      head.y >= gridSize
    ) {
      return true;
    }
    
    // Check self collision (skip the last segment as it will move)
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  };

  // Move the snake
  const moveSnake = () => {
    if (gameOver || isPaused) return;
    
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    
    // Calculate new head position based on direction
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }
    
    // Check for collision
    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }
    
    // Add new head
    newSnake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      setScore(prevScore => prevScore + 10);
      // Generate new food
      setFood(generateFood());
      // Increase speed
      setSpeed(prevSpeed => Math.max(prevSpeed - speedIncrease, 50));
    } else {
      // Remove tail if no food eaten
      newSnake.pop();
    }
    
    setSnake(newSnake);
  };

  // Game loop
  const gameLoop = (timestamp: number) => {
    if (!lastRenderTimeRef.current) {
      lastRenderTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastRenderTimeRef.current;
    
    if (elapsed > speed) {
      lastRenderTimeRef.current = timestamp;
      moveSnake();
    }
    
    // Draw game
    drawGame();
    
    // Continue loop
    if (!gameOver) {
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // Draw the game
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
      // Head is a different color
      if (index === 0) {
        ctx.fillStyle = '#4ade80'; // Green-500
      } else {
        // Gradient from green to blue for the body
        const ratio = index / snake.length;
        const r = Math.floor(74 * (1 - ratio) + 59 * ratio);
        const g = Math.floor(222 * (1 - ratio) + 130 * ratio);
        const b = Math.floor(128 * (1 - ratio) + 246 * ratio);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      }
      
      // Draw rounded rectangle for segments
      const radius = index === 0 ? 8 : 6;
      roundRect(
        ctx, 
        segment.x * cellSize, 
        segment.y * cellSize, 
        cellSize, 
        cellSize, 
        radius
      );
    });
    
    // Draw food
    ctx.fillStyle = '#f87171'; // Red-400
    roundRect(
      ctx, 
      food.x * cellSize, 
      food.y * cellSize, 
      cellSize, 
      cellSize, 
      8
    );
    
    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= gridSize; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, gridSize * cellSize);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(gridSize * cellSize, i * cellSize);
      ctx.stroke();
    }
  };

  // Helper function to draw rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  // Reset game
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ]);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(true); // Start paused until countdown finishes
    setSpeed(initialSpeed);
    lastRenderTimeRef.current = 0;
  };

  // Toggle pause
  const togglePause = () => {
    if (!gameOver) {
      setIsPaused(prev => !prev);
    }
  };

  // Start/stop game loop based on game state
  useEffect(() => {
    if (!gameOver && !isPaused) {
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [snake, food, direction, gameOver, isPaused, speed]);

  // Initial draw
  useEffect(() => {
    drawGame();
  }, []);

  return {
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
  };
};