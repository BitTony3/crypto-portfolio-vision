import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Maximize2, Minimize2, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
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
  ChartWidget: { width: 2, height: 2 },
  MarketOverview: { width: 1, height: 1 },
  GreedFearIndex: { width: 1, height: 1 },
  TopPerformers: { width: 1, height: 1 },
  TrendingCoins: { width: 1, height: 1 },
  CryptoNews: { width: 1, height: 1 },
  TokenPairExplorer: { width: 1, height: 1 },
  LiquidityPoolsOverview: { width: 1, height: 1 },
  GasTracker: { width: 1, height: 1 },
  DeFiOverview: { width: 1, height: 1 },
  NFTMarketplace: { width: 1, height: 1 },
  BlockchainExplorer: { width: 1, height: 1 },
  TopCryptoAssets: { width: 1, height: 1 },
  Portfolio: { width: 1, height: 1 },
  PortfolioPerformance: { width: 1, height: 1 },
  TradeTerminal: { width: 1, height: 1 },
};

const locations = [
  { id: 'global', name: 'Global' },
  { id: 'us', name: 'United States' },
  { id: 'eu', name: 'European Union' },
  { id: 'asia', name: 'Asia' },
];

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [
      'ChartWidget',
      'MarketOverview',
      'GreedFearIndex',
      'TopPerformers',
      'TrendingCoins',
      'CryptoNews',
    ];
  });
  const [expandedWidgets, setExpandedWidgets] = useState({});
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [columns, setColumns] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState('global');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const addWidget = (widgetName) => {
    if (!widgets.includes(widgetName)) {
      setWidgets([...widgets, widgetName]);
    }
    setIsAddWidgetOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Customizable Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300">
                <Plus className="mr-2 h-4 w-4" /> Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new widget</DialogTitle>
                <DialogDescription>
                  Choose a widget to add to your dashboard.
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={addWidget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a widget" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(widgetComponents).map((widgetName) => (
                    <SelectItem key={widgetName} value={widgetName}>
                      {widgetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}
            >
              {widgets.map((widgetName, index) => {
                const WidgetComponent = widgetComponents[widgetName];
                if (!WidgetComponent) {
                  console.error(`Widget component not found: ${widgetName}`);
                  return null;
                }
                const isExpanded = expandedWidgets[widgetName];
                return (
                  <Draggable key={widgetName} draggableId={widgetName} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group ${isExpanded ? 'col-span-full' : ''}`}
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader className="p-2 flex flex-row items-center justify-between bg-card/50 backdrop-blur-sm">
                              <CardTitle className="text-sm font-medium">{widgetName}</CardTitle>
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
                                        {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {isExpanded ? 'Minimize' : 'Maximize'}
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
                                <div {...provided.dragHandleProps} className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="h-3 w-3" />
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-2 overflow-auto relative" style={{ height: isExpanded ? '500px' : '300px' }}>
                              <WidgetComponent location={selectedLocation} />
                            </CardContent>
                          </Card>
                        </motion.div>
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