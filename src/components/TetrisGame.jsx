import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const TETROMINOS = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]]
];

const TetrisGame = () => {
  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const createNewPiece = useCallback(() => {
    const newPiece = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
    setCurrentPiece(newPiece);
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece[0].length / 2), y: 0 });
    if (!isValidMove(newPiece, { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece[0].length / 2), y: 0 })) {
      setGameOver(true);
    }
  }, []);

  const isValidMove = (piece, position) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const mergePieceToBoard = () => {
    const newBoard = [...board];
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          newBoard[currentPosition.y + y][currentPosition.x + x] = 1;
        }
      }
    }
    setBoard(newBoard);
    checkLines();
    createNewPiece();
  };

  const movePiece = (dx, dy) => {
    const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
    if (isValidMove(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
    } else if (dy > 0) {
      mergePieceToBoard();
    }
  };

  const rotatePiece = () => {
    const rotatedPiece = currentPiece[0].map((_, index) =>
      currentPiece.map(row => row[index]).reverse()
    );
    if (isValidMove(rotatedPiece, currentPosition)) {
      setCurrentPiece(rotatedPiece);
    }
  };

  const checkLines = () => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell === 1)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    setBoard(newBoard);
    setScore(prevScore => prevScore + linesCleared * 100);
  };

  const handleKeyPress = useCallback((e) => {
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
    }
  }, [gameStarted, gameOver, movePiece, rotatePiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      movePiece(0, 1);
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, movePiece]);

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    createNewPiece();
  };

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold mb-2 text-primary">Tetris</h3>
      <div className="grid grid-cols-10 gap-px mb-4" style={{ width: BOARD_WIDTH * 20 }}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-5 h-5 ${
                cell || (currentPiece && currentPosition.y <= y && y < currentPosition.y + currentPiece.length &&
                         currentPosition.x <= x && x < currentPosition.x + currentPiece[0].length &&
                         currentPiece[y - currentPosition.y][x - currentPosition.x])
                  ? 'bg-primary'
                  : 'bg-gray-200'
              }`}
            ></div>
          ))
        )}
      </div>
      <div className="mt-2">
        <p className="text-lg font-bold text-primary">Score: {score}</p>
        {gameOver && <p className="text-lg font-bold text-red-600">Game Over!</p>}
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

export default TetrisGame;
