import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const BOARD_SIZE = 8;
const CANDY_TYPES = ['🍬', '🍭', '🍫', '🍪', '🍩'];

const CandyCrushGame = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedCandy, setSelectedCandy] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() =>
      Array(BOARD_SIZE).fill().map(() => CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)])
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    if (gameStarted) {
      initializeBoard();
    }
  }, [gameStarted]);

  const handleCandyClick = (row, col) => {
    if (!selectedCandy) {
      setSelectedCandy({ row, col });
    } else {
      const isAdjacent = (
        (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row)
      );

      if (isAdjacent) {
        swapCandies(selectedCandy, { row, col });
        setSelectedCandy(null);
      } else {
        setSelectedCandy({ row, col });
      }
    }
  };

  const swapCandies = (candy1, candy2) => {
    const newBoard = [...board];
    const temp = newBoard[candy1.row][candy1.col];
    newBoard[candy1.row][candy1.col] = newBoard[candy2.row][candy2.col];
    newBoard[candy2.row][candy2.col] = temp;
    setBoard(newBoard);
    checkMatches();
  };

  const checkMatches = () => {
    let matches = [];

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        if (board[row][col] === board[row][col + 1] && board[row][col] === board[row][col + 2]) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }

    // Check vertical matches
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === board[row + 1][col] && board[row][col] === board[row + 2][col]) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }

    if (matches.length > 0) {
      removeMatches(matches);
    }
  };

  const removeMatches = (matches) => {
    const newBoard = [...board];
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });
    setBoard(newBoard);
    setScore(prevScore => prevScore + matches.length);
    setTimeout(() => {
      fillEmptySpaces();
    }, 300);
  };

  const fillEmptySpaces = () => {
    const newBoard = [...board];
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0;
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newBoard[row + emptySpaces][col] = newBoard[row][col];
          newBoard[row][col] = null;
        }
      }
      for (let row = 0; row < emptySpaces; row++) {
        newBoard[row][col] = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
      }
    }
    setBoard(newBoard);
    checkMatches();
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    initializeBoard();
  };

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold mb-2 text-primary">Candy Crush</h3>
      <div className="grid grid-cols-8 gap-1 mb-4">
        {board.map((row, rowIndex) =>
          row.map((candy, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 text-2xl ${selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex ? 'bg-yellow-200' : 'bg-white'}`}
              onClick={() => handleCandyClick(rowIndex, colIndex)}
            >
              {candy}
            </button>
          ))
        )}
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

export default CandyCrushGame;
