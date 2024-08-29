import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const MARIO_WIDTH = 40;
const MARIO_HEIGHT = 60;
const GRAVITY = 0.5;
const JUMP_STRENGTH = 12;

const MarioGame = () => {
  const [marioPosition, setMarioPosition] = useState({ x: 50, y: GAME_HEIGHT - MARIO_HEIGHT });
  const [marioVelocity, setMarioVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const updateGame = useCallback(() => {
    if (!gameStarted) return;

    setMarioPosition(prev => ({
      x: prev.x + marioVelocity.x,
      y: Math.min(prev.y + marioVelocity.y, GAME_HEIGHT - MARIO_HEIGHT)
    }));

    setMarioVelocity(prev => ({
      x: prev.x * 0.9,
      y: prev.y + GRAVITY
    }));

    if (marioPosition.y >= GAME_HEIGHT - MARIO_HEIGHT) {
      setIsJumping(false);
    }

    setScore(prev => prev + 1);
  }, [gameStarted, marioPosition.y, marioVelocity.x, marioVelocity.y]);

  useEffect(() => {
    const gameLoop = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [updateGame]);

  const handleKeyDown = useCallback((e) => {
    if (!gameStarted) return;

    switch (e.key) {
      case 'ArrowLeft':
        setMarioVelocity(prev => ({ ...prev, x: -5 }));
        break;
      case 'ArrowRight':
        setMarioVelocity(prev => ({ ...prev, x: 5 }));
        break;
      case 'ArrowUp':
      case ' ':
        if (!isJumping) {
          setMarioVelocity(prev => ({ ...prev, y: -JUMP_STRENGTH }));
          setIsJumping(true);
        }
        break;
    }
  }, [gameStarted, isJumping]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setMarioPosition({ x: 50, y: GAME_HEIGHT - MARIO_HEIGHT });
    setMarioVelocity({ x: 0, y: 0 });
  };

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold mb-2 text-primary">Mario Game</h3>
      <div className="relative bg-blue-200" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        <div
          className="absolute bg-red-500"
          style={{
            left: marioPosition.x,
            top: marioPosition.y,
            width: MARIO_WIDTH,
            height: MARIO_HEIGHT,
          }}
        ></div>
      </div>
      <div className="mt-2">
        <p className="text-lg font-bold text-primary">Score: {score}</p>
        <Button
          onClick={startGame}
          className="mt-1 bg-primary text-secondary hover:bg-accent text-sm"
        >
          {gameStarted ? 'Restart' : 'Start'}
        </Button>
      </div>
    </div>
  );
};

export default MarioGame;
