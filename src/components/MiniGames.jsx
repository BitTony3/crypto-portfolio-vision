import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SnakeGame from './SnakeGame';
import MarioGame from './MarioGame';
import CandyCrushGame from './CandyCrushGame';
import TetrisGame from './TetrisGame';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MiniGames = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const games = [
    { name: 'Snake', component: SnakeGame, image: '/snake-game.png', color: 'bg-green-500' },
    { name: 'Mario', component: MarioGame, image: '/mario-game.png', color: 'bg-red-500' },
    { name: 'Candy Crush', component: CandyCrushGame, image: '/candy-crush-game.png', color: 'bg-pink-500' },
    { name: 'Tetris', component: TetrisGame, image: '/tetris-game.png', color: 'bg-purple-500' },
  ];

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg mb-8">
      <h2 className="text-4xl font-bold mb-4 text-primary">Mini Games</h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {games.map((game) => (
              <div key={game.name} className="flex-[0_0_100%] min-w-0 pl-4">
                <div
                  className={`cursor-pointer ${game.color} rounded-lg overflow-hidden transition-transform hover:scale-105 ${
                    selectedGame === game.name ? 'ring-4 ring-accent' : ''
                  }`}
                  onClick={() => setSelectedGame(game.name)}
                >
                  <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                  <div className="p-4 text-center text-white font-bold text-xl">{game.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary text-secondary hover:bg-accent rounded-full p-2"
        >
          <ChevronLeft size={24} />
        </Button>
        <Button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-secondary hover:bg-accent rounded-full p-2"
        >
          <ChevronRight size={24} />
        </Button>
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
