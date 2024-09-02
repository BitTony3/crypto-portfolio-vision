import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MarketOverview from './MarketOverview';
import GreedFearIndex from './GreedFearIndex';
import TopPerformers from './TopPerformers';
import TrendingCoins from './TrendingCoins';
import CryptoNews from './CryptoNews';
import TokenPairExplorer from './TokenPairExplorer';
import LiquidityPoolsOverview from './LiquidityPoolsOverview';
import GasTracker from './GasTracker';
import DeFiOverview from './DeFiOverview';
import NFTMarketplace from './NFTMarketplace';
import BlockchainExplorer from './BlockchainExplorer';
import TopCryptoAssets from './TopCryptoAssets';
import Portfolio from './Portfolio';
import PortfolioPerformance from './PortfolioPerformance';
import ChartWidget from './ChartWidget';
import TradeTerminal from './TradeTerminal';

const widgetComponents = {
  MarketOverview,
  GreedFearIndex,
  TopPerformers,
  TrendingCoins,
  CryptoNews,
  TokenPairExplorer,
  LiquidityPoolsOverview,
  GasTracker,
  DeFiOverview,
  NFTMarketplace,
  BlockchainExplorer,
  TopCryptoAssets,
  Portfolio,
  PortfolioPerformance,
  ChartWidget,
  TradeTerminal,
};

const widgetDescriptions = {
  MarketOverview: "Overview of the cryptocurrency market",
  GreedFearIndex: "Crypto market sentiment indicator",
  TopPerformers: "Best performing cryptocurrencies",
  TrendingCoins: "Most popular coins right now",
  CryptoNews: "Latest news in the crypto world",
  TokenPairExplorer: "Analyze token pair metrics",
  LiquidityPoolsOverview: "Overview of DeFi liquidity pools",
  GasTracker: "Ethereum gas price tracker",
  DeFiOverview: "Decentralized Finance market overview",
  NFTMarketplace: "Non-Fungible Token market trends",
  BlockchainExplorer: "Explore blockchain data",
  TopCryptoAssets: "Top cryptocurrencies by market cap",
  Portfolio: "Your cryptocurrency portfolio",
  PortfolioPerformance: "Track your portfolio performance",
  ChartWidget: "Interactive TradingView chart",
  TradeTerminal: "Execute trades quickly",
};

const widgetSizes = {
  MarketOverview: { minWidth: 300, minHeight: 300 },
  GreedFearIndex: { minWidth: 200, minHeight: 200 },
  TopPerformers: { minWidth: 300, minHeight: 300 },
  TrendingCoins: { minWidth: 200, minHeight: 200 },
  CryptoNews: { minWidth: 300, minHeight: 300 },
  TokenPairExplorer: { minWidth: 400, minHeight: 400 },
  LiquidityPoolsOverview: { minWidth: 300, minHeight: 300 },
  GasTracker: { minWidth: 200, minHeight: 200 },
  DeFiOverview: { minWidth: 300, minHeight: 300 },
  NFTMarketplace: { minWidth: 300, minHeight: 300 },
  BlockchainExplorer: { minWidth: 400, minHeight: 400 },
  TopCryptoAssets: { minWidth: 400, minHeight: 400 },
  Portfolio: { minWidth: 400, minHeight: 400 },
  PortfolioPerformance: { minWidth: 300, minHeight: 300 },
  ChartWidget: { minWidth: 600, minHeight: 400 },
  TradeTerminal: { minWidth: 300, minHeight: 300 },
};

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : ['MarketOverview', 'GreedFearIndex', 'ChartWidget', 'TradeTerminal'];
  });
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [expandedWidgets, setExpandedWidgets] = useState({});

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

  const toggleWidgetExpansion = (widgetName) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  };

  const getWidgetClassName = (widgetName) => {
    const isExpanded = expandedWidgets[widgetName];
    if (isExpanded) {
      return 'col-span-full row-span-full';
    }
    return `col-span-1 row-span-1`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-background p-2">
      <h2 className="text-xl font-bold mb-2">Your Personalized Dashboard</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 h-[calc(100vh-80px)] overflow-auto auto-rows-fr"
            >
              {widgets.map((widgetName, index) => {
                const WidgetComponent = widgetComponents[widgetName];
                return (
                  <Draggable key={widgetName + index} draggableId={widgetName + index} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group ${getWidgetClassName(widgetName)}`}
                      >
                        <Card className="relative h-full overflow-hidden flex flex-col">
                          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between p-1 sticky top-0 bg-card z-10">
                            <CardTitle className="text-xs font-medium">{widgetName}</CardTitle>
                            <div className="flex items-center space-x-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleWidgetExpansion(widgetName)}
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      {expandedWidgets[widgetName] ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {expandedWidgets[widgetName] ? 'Minimize' : 'Maximize'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeWidget(index)}
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Remove Widget
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div {...provided.dragHandleProps} className="cursor-move">
                                <GripVertical className="h-3 w-3" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow overflow-auto p-1">
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
      <div className="fixed bottom-2 right-2">
        <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs">
              <PlusCircle className="mr-1 h-3 w-3" /> Add Widget
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
                    size="sm"
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
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