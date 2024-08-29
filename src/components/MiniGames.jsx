import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SnakeGame from './SnakeGame';
import MarioGame from './MarioGame';
import CandyCrushGame from './CandyCrushGame';
import TetrisGame from './TetrisGame';

const MiniGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { name: 'Snake', component: SnakeGame },
    { name: 'Mario', component: MarioGame },
    { name: 'Candy Crush', component: CandyCrushGame },
    { name: 'Tetris', component: TetrisGame },
  ];

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg mb-8">
      <h2 className="text-4xl font-bold mb-4 text-primary">Mini Games</h2>
      <div className="flex space-x-2 mb-4">
        {games.map((game) => (
          <Button
            key={game.name}
            onClick={() => setSelectedGame(game.name)}
            className={`bg-primary text-secondary hover:bg-accent ${
              selectedGame === game.name ? 'ring-2 ring-accent' : ''
            }`}
          >
            {game.name}
          </Button>
        ))}
      </div>
      {selectedGame && (
        <div className="mt-4">
          {React.createElement(games.find((game) => game.name === selectedGame).component)}
        </div>
      )}
    </div>
  );
};

export default MiniGames;