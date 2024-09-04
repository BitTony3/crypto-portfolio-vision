import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Maximize2, Minimize2, Plus, Settings, HelpCircle, RefreshCw } from 'lucide-react';
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
import { useToast } from "@/components/ui/use-toast";
import Joyride, { STATUS } from 'react-joyride';
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
  ChartWidget: { width: 3, height: 2 },
  MarketOverview: { width: 1, height: 1 },
  GreedFearIndex: { width: 1, height: 1 },
  TopPerformers: { width: 1, height: 1 },
  TrendingCoins: { width: 1, height: 1 },
  CryptoNews: { width: 1, height: 1 },
  TokenPairExplorer: { width: 2, height: 1 },
  LiquidityPoolsOverview: { width: 2, height: 1 },
  GasTracker: { width: 1, height: 1 },
  DeFiOverview: { width: 1, height: 1 },
  NFTMarketplace: { width: 1, height: 1 },
  BlockchainExplorer: { width: 2, height: 1 },
  TopCryptoAssets: { width: 3, height: 1 },
  Portfolio: { width: 2, height: 2 },
  PortfolioPerformance: { width: 2, height: 1 },
  TradeTerminal: { width: 1, height: 1 },
};

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
      'Portfolio',
    ];
  });
  const [expandedWidgets, setExpandedWidgets] = useState({ ChartWidget: true });
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [columns, setColumns] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const [runTour, setRunTour] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dashboardRef = useRef(null);

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

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
    toast({
      title: "Widget moved",
      description: `${reorderedItem} has been repositioned.`,
    });
  };

  const removeWidget = (index) => {
    const newWidgets = widgets.filter((_, i) => i !== index);
    setWidgets(newWidgets);
    toast({
      title: "Widget removed",
      description: `${widgets[index]} has been removed from your dashboard.`,
      variant: "destructive",
    });
  };

  const toggleWidgetExpansion = (widgetName) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
    toast({
      title: expandedWidgets[widgetName] ? "Widget collapsed" : "Widget expanded",
      description: `${widgetName} has been ${expandedWidgets[widgetName] ? "collapsed" : "expanded"}.`,
    });
  };

  const addWidget = (widgetName) => {
    if (!widgets.includes(widgetName)) {
      setWidgets([...widgets, widgetName]);
      toast({
        title: "Widget added",
        description: `${widgetName} has been added to your dashboard.`,
      });
    }
    setIsAddWidgetOpen(false);
  };

  const getWidgetSize = (widgetName, isExpanded) => {
    const size = initialWidgetSizes[widgetName] || { width: 1, height: 1 };
    return isExpanded ? { width: columns, height: size.height * 2 } : size;
  };

  const steps = [
    {
      target: '.dashboard-header',
      content: 'Welcome to your customizable dashboard! Here you can manage your widgets and settings.',
      disableBeacon: true,
    },
    {
      target: '.add-widget-button',
      content: 'Click here to add new widgets to your dashboard.',
    },
    {
      target: '.widget-card',
      content: 'These are your widgets. You can drag them to reorder, expand, or remove them.',
    },
    {
      target: '.widget-controls',
      content: 'Use these controls to expand, collapse, or remove widgets.',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  const refreshDashboard = async () => {
    setIsLoading(true);
    // Simulate a refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Dashboard refreshed",
      description: "All widgets have been updated with the latest data.",
    });
  };

  return (
    <div ref={dashboardRef} className="p-4">
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        styles={{
          options: {
            primaryColor: '#3b82f6',
            zIndex: 1000,
          },
        }}
        callback={handleJoyrideCallback}
      />
      <div className="flex justify-between items-center mb-6 dashboard-header">
        <h2 className="text-3xl font-bold text-primary">Customizable Dashboard</h2>
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={refreshDashboard}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Refresh Dashboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 add-widget-button">
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Dashboard Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setRunTour(true)}>
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Start Guided Tour
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-${columns} gap-4`}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: '1rem',
              }}
            >
              {widgets.map((widgetName, index) => {
                const WidgetComponent = widgetComponents[widgetName];
                if (!WidgetComponent) {
                  console.error(`Widget component not found: ${widgetName}`);
                  return null;
                }
                const isExpanded = expandedWidgets[widgetName];
                const { width, height } = getWidgetSize(widgetName, isExpanded);
                return (
                  <Draggable key={widgetName} draggableId={widgetName} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group col-span-${width} row-span-${height} widget-card`}
                        style={{
                          ...provided.draggableProps.style,
                          gridColumn: `span ${width}`,
                          gridRow: `span ${height}`,
                        }}
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className={`h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        >
                          <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader className="p-2 flex flex-row items-center justify-between bg-card/50 backdrop-blur-sm">
                              <CardTitle className="text-sm font-medium">{widgetName}</CardTitle>
                              <div className="flex items-center space-x-1 widget-controls">
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
                            <CardContent className="p-2 overflow-auto relative" style={{ height: isExpanded ? '550px' : '330px' }}>
                              {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                              ) : (
                                <WidgetComponent />
                              )}
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
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dashboard Settings</DialogTitle>
            <DialogDescription>
              Customize your dashboard layout and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Number of Columns</label>
              <Select value={columns.toString()} onValueChange={(value) => setColumns(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomizableDashboard;