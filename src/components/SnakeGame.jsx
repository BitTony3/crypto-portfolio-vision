import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 1, y: 0 };

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1);
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(moveSnake, 100);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold mb-2 text-primary">Snake Game</h3>
      <div className="relative" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
        <div className="absolute inset-0 bg-background border-2 border-primary"></div>
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-primary"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          ></div>
        ))}
        <div
          className="absolute bg-accent"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        ></div>
      </div>
      <div className="mt-2">
        <p className="text-lg font-bold text-primary">Score: {score}</p>
        {gameOver && <p className="text-lg font-bold text-red-600">Game Over!</p>}
        <Button
          onClick={resetGame}
          className="mt-1 bg-primary text-secondary hover:bg-accent text-sm"
        >
          {gameStarted ? 'Restart' : 'Start'}
        </Button>
      </div>
    </div>
  );
};

export default SnakeGame;
