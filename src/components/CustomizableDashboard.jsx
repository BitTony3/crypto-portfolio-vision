import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarketOverview from './MarketOverview';
import GreedFearIndex from './GreedFearIndex';
import TopPerformers from './TopPerformers';
import TrendingCoins from './TrendingCoins';
import CryptoNews from './CryptoNews';
import TokenPairExplorer from './TokenPairExplorer';
import LiquidityPoolsOverview from './LiquidityPoolsOverview';
import TradingViewChart from './TradingViewChart';
import GasTracker from './GasTracker';
import DeFiOverview from './DeFiOverview';
import NFTMarketplace from './NFTMarketplace';
import BlockchainExplorer from './BlockchainExplorer';
import TopCryptoAssets from './TopCryptoAssets';
import Portfolio from './Portfolio';
import PortfolioPerformance from './PortfolioPerformance';
import MiniGames from './MiniGames';
import CandyCrushGame from './CandyCrushGame';
import MarioGame from './MarioGame';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';

const widgetComponents = {
  MarketOverview,
  GreedFearIndex,
  TopPerformers,
  TrendingCoins,
  CryptoNews,
  TokenPairExplorer,
  LiquidityPoolsOverview,
  TradingViewChart,
  GasTracker,
  DeFiOverview,
  NFTMarketplace,
  BlockchainExplorer,
  TopCryptoAssets,
  Portfolio,
  PortfolioPerformance,
  MiniGames,
  CandyCrushGame,
  MarioGame,
  SnakeGame,
  TetrisGame,
};

const widgetDescriptions = {
  MarketOverview: "Overview of the cryptocurrency market",
  GreedFearIndex: "Crypto market sentiment indicator",
  TopPerformers: "Best performing cryptocurrencies",
  TrendingCoins: "Most popular coins right now",
  CryptoNews: "Latest news in the crypto world",
  TokenPairExplorer: "Analyze token pair metrics",
  LiquidityPoolsOverview: "Overview of DeFi liquidity pools",
  TradingViewChart: "Advanced price charts",
  GasTracker: "Ethereum gas price tracker",
  DeFiOverview: "Decentralized Finance market overview",
  NFTMarketplace: "Non-Fungible Token market trends",
  BlockchainExplorer: "Explore blockchain data",
  TopCryptoAssets: "Top cryptocurrencies by market cap",
  Portfolio: "Your cryptocurrency portfolio",
  PortfolioPerformance: "Track your portfolio performance",
  MiniGames: "Collection of mini-games",
  CandyCrushGame: "Play Candy Crush",
  MarioGame: "Play Mario",
  SnakeGame: "Play Snake",
  TetrisGame: "Play Tetris",
};

const widgetSizes = {
  MarketOverview: 'medium',
  GreedFearIndex: 'small',
  TopPerformers: 'medium',
  TrendingCoins: 'small',
  CryptoNews: 'medium',
  TokenPairExplorer: 'large',
  LiquidityPoolsOverview: 'medium',
  TradingViewChart: 'large',
  GasTracker: 'small',
  DeFiOverview: 'medium',
  NFTMarketplace: 'medium',
  BlockchainExplorer: 'large',
  TopCryptoAssets: 'large',
  Portfolio: 'large',
  PortfolioPerformance: 'medium',
  MiniGames: 'medium',
  CandyCrushGame: 'medium',
  MarioGame: 'medium',
  SnakeGame: 'medium',
  TetrisGame: 'medium',
};

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : ['MarketOverview', 'GreedFearIndex'];
  });
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
  };

  const addWidget = (widgetName) => {
    setWidgets([...widgets, widgetName]);
    setIsAddWidgetOpen(false);
  };

  const removeWidget = (index) => {
    const newWidgets = widgets.filter((_, i) => i !== index);
    setWidgets(newWidgets);
  };

  const getWidgetClassName = (size) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      default:
        return 'col-span-2';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Personalized Dashboard</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min"
            >
              {widgets.map((widgetName, index) => {
                const WidgetComponent = widgetComponents[widgetName];
                const widgetSize = widgetSizes[widgetName];
                return (
                  <Draggable key={widgetName + index} draggableId={widgetName + index} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group ${getWidgetClassName(widgetSize)}`}
                      >
                        <Card className="relative h-full">
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{widgetName}</CardTitle>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeWidget(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 cursor-move" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <WidgetComponent />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="mt-4">
        <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Widget</DialogTitle>
              <DialogDescription>
                Choose a widget to add to your dashboard.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[300px] mt-4">
              <div className="space-y-2">
                {Object.keys(widgetComponents).map((widgetName) => (
                  <Button
                    key={widgetName}
                    onClick={() => addWidget(widgetName)}
                    className="w-full justify-start"
                    variant="ghost"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {widgetName}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {widgetDescriptions[widgetName]}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomizableDashboard;
