import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SnakeGame from './SnakeGame';
import MarioGame from './MarioGame';
import CandyCrushGame from './CandyCrushGame';
import TetrisGame from './TetrisGame';

const MiniGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { name: 'Snake', component: SnakeGame, image: '/snake-game.png' },
    { name: 'Mario', component: MarioGame, image: '/mario-game.png' },
    { name: 'Candy Crush', component: CandyCrushGame, image: '/candy-crush-game.png' },
    { name: 'Tetris', component: TetrisGame, image: '/tetris-game.png' },
  ];

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg mb-8">
      <h2 className="text-4xl font-bold mb-4 text-primary">Mini Games</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {games.map((game) => (
          <div
            key={game.name}
            className={`cursor-pointer bg-primary rounded-lg overflow-hidden transition-transform hover:scale-105 ${
              selectedGame === game.name ? 'ring-4 ring-accent' : ''
            }`}
            onClick={() => setSelectedGame(game.name)}
          >
            <img src={game.image} alt={game.name} className="w-full h-32 object-cover" />
            <div className="p-2 text-center text-secondary font-bold">{game.name}</div>
          </div>
        ))}
      </div>
      {selectedGame && (
        <div className="mt-4">
          <Button
            onClick={() => setSelectedGame(null)}
            className="mb-2 bg-primary text-secondary hover:bg-accent"
          >
            Back to Gallery
          </Button>
          {React.createElement(games.find((game) => game.name === selectedGame).component)}
        </div>
      )}
    </div>
  );
};

export default MiniGames;
