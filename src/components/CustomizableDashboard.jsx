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

const widgetSizes = {
  ChartWidget: { width: 'col-span-4', height: 'row-span-3' },
  MarketOverview: { width: 'col-span-2', height: 'row-span-2' },
  GreedFearIndex: { width: 'col-span-1', height: 'row-span-1' },
  TopPerformers: { width: 'col-span-1', height: 'row-span-2' },
  TrendingCoins: { width: 'col-span-1', height: 'row-span-1' },
  CryptoNews: { width: 'col-span-2', height: 'row-span-2' },
  TokenPairExplorer: { width: 'col-span-2', height: 'row-span-2' },
  LiquidityPoolsOverview: { width: 'col-span-2', height: 'row-span-2' },
  GasTracker: { width: 'col-span-1', height: 'row-span-1' },
  DeFiOverview: { width: 'col-span-2', height: 'row-span-1' },
  NFTMarketplace: { width: 'col-span-2', height: 'row-span-2' },
  BlockchainExplorer: { width: 'col-span-2', height: 'row-span-2' },
  TopCryptoAssets: { width: 'col-span-2', height: 'row-span-2' },
  Portfolio: { width: 'col-span-2', height: 'row-span-2' },
  PortfolioPerformance: { width: 'col-span-2', height: 'row-span-1' },
  TradeTerminal: { width: 'col-span-2', height: 'row-span-2' },
};

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : Object.keys(widgetComponents);
  });
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
    return `${widgetSizes[widgetName].width} ${widgetSizes[widgetName].height}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customizable Dashboard</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-6 gap-4 auto-rows-min"
            >
              {widgets.map((widgetName, index) => {
                const WidgetComponent = widgetComponents[widgetName];
                return (
                  <Draggable key={widgetName} draggableId={widgetName} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group ${getWidgetClassName(widgetName)}`}
                      >
                        <Card className="h-full overflow-hidden">
                          <CardHeader className="p-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">{widgetName}</CardTitle>
                            <div className="flex items-center space-x-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleWidgetExpansion(widgetName)}
                                      className="h-6 w-6 p-0"
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
                                      className="h-6 w-6 p-0"
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
                          <CardContent className="p-2 overflow-auto">
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
    </div>
  );
};

export default CustomizableDashboard;