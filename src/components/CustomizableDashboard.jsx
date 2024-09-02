import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Maximize2, Minimize2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  ChartWidget,
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
  TradeTerminal,
};

const initialWidgetSizes = {
  ChartWidget: { width: 4, height: 4 },
  MarketOverview: { width: 2, height: 2 },
  GreedFearIndex: { width: 1, height: 1 },
  TopPerformers: { width: 1, height: 2 },
  TrendingCoins: { width: 1, height: 1 },
  CryptoNews: { width: 2, height: 2 },
  TokenPairExplorer: { width: 2, height: 2 },
  LiquidityPoolsOverview: { width: 2, height: 2 },
  GasTracker: { width: 1, height: 1 },
  DeFiOverview: { width: 2, height: 1 },
  NFTMarketplace: { width: 2, height: 2 },
  BlockchainExplorer: { width: 2, height: 2 },
  TopCryptoAssets: { width: 2, height: 2 },
  Portfolio: { width: 2, height: 2 },
  PortfolioPerformance: { width: 2, height: 1 },
  TradeTerminal: { width: 2, height: 2 },
};

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : Object.keys(widgetComponents);
  });
  const [widgetSizes, setWidgetSizes] = useState(() => {
    const savedSizes = localStorage.getItem('widgetSizes');
    return savedSizes ? JSON.parse(savedSizes) : initialWidgetSizes;
  });
  const [expandedWidgets, setExpandedWidgets] = useState({});

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    localStorage.setItem('widgetSizes', JSON.stringify(widgetSizes));
  }, [widgets, widgetSizes]);

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

  const resizeWidget = (widgetName, direction) => {
    setWidgetSizes(prev => {
      const newSizes = { ...prev };
      if (direction === 'width+') newSizes[widgetName].width = Math.min(newSizes[widgetName].width + 1, 6);
      if (direction === 'width-') newSizes[widgetName].width = Math.max(newSizes[widgetName].width - 1, 1);
      if (direction === 'height+') newSizes[widgetName].height = newSizes[widgetName].height + 1;
      if (direction === 'height-') newSizes[widgetName].height = Math.max(newSizes[widgetName].height - 1, 1);
      return newSizes;
    });
  };

  const getWidgetClassName = (widgetName) => {
    const isExpanded = expandedWidgets[widgetName];
    if (isExpanded) {
      return 'col-span-full row-span-full';
    }
    const size = widgetSizes[widgetName];
    return `col-span-${size.width} row-span-${size.height}`;
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
              className="grid grid-cols-6 auto-rows-min gap-4"
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
                          <CardContent className="p-2 overflow-auto relative" style={{ height: widgetName === 'ChartWidget' ? 'calc(100% - 2rem)' : 'auto' }}>
                            <WidgetComponent />
                            <div className="absolute bottom-1 right-1 flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resizeWidget(widgetName, 'width-')}
                                className="h-6 w-6 p-0 bg-secondary/50"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resizeWidget(widgetName, 'width+')}
                                className="h-6 w-6 p-0 bg-secondary/50"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resizeWidget(widgetName, 'height-')}
                                className="h-6 w-6 p-0 bg-secondary/50"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => resizeWidget(widgetName, 'height+')}
                                className="h-6 w-6 p-0 bg-secondary/50"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
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