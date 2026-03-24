import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-4 border-[#ff00ff] shadow-[-8px_8px_0px_#00ffff] relative">
      <div className="absolute top-0 right-0 bg-[#ff00ff] text-black font-pixel text-[10px] px-2 py-1">
        PID: 8934
      </div>
      
      <div className="flex justify-between w-full mb-4 items-end px-2 border-b-4 border-[#00ffff] pb-2">
        <h2 className="text-2xl font-pixel text-white uppercase glitch" data-text="SNAKE.EXE">
          SNAKE.EXE
        </h2>
        <div className="text-3xl font-terminal text-[#00ffff]">
          SCORE:{score.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#00ffff] overflow-hidden"
        style={{
          width: `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`,
        }}
      >
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ff00ff 1px, transparent 1px), linear-gradient(to bottom, #ff00ff 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-[#00ffff] animate-ping"
          style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
          }}
        />
        <div
          className="absolute bg-[#00ffff]"
          style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-white z-10' : 'bg-[#ff00ff]'}`}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
                border: '1px solid black'
              }}
            />
          );
        })}

        {/* Overlays */}
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff] m-4">
            {gameOver ? (
              <>
                <h3 className="text-2xl font-pixel text-[#ff00ff] mb-4 glitch" data-text="FATAL_ERR">
                  FATAL_ERR
                </h3>
                <p className="text-[#00ffff] font-terminal text-3xl mb-6">&gt; SCORE: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-[#00ffff] text-black font-pixel text-sm hover:bg-white transition-none uppercase"
                >
                  REBOOT
                </button>
              </>
            ) : (
              <h3 className="text-2xl font-pixel text-[#00ffff] glitch" data-text="PAUSED">
                PAUSED
              </h3>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-[#ff00ff] font-terminal text-2xl flex flex-col items-center leading-none">
        <span>&gt; INPUT: [W,A,S,D] OR [ARROWS]</span>
        <span>&gt; INTERRUPT: [SPACE]</span>
      </div>
    </div>
  );
}
