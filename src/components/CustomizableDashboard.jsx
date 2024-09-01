import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import MarketOverview from './MarketOverview';
import GreedFearIndex from './GreedFearIndex';
import TopPerformers from './TopPerformers';
import TrendingCoins from './TrendingCoins';
import CryptoNews from './CryptoNews';

const widgetComponents = {
  MarketOverview,
  GreedFearIndex,
  TopPerformers,
  TrendingCoins,
  CryptoNews,
};

const CustomizableDashboard = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : ['MarketOverview', 'GreedFearIndex'];
  });

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
  };

  const removeWidget = (index) => {
    const newWidgets = widgets.filter((_, i) => i !== index);
    setWidgets(newWidgets);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Dashboard</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {widgets.map((widgetName, index) => {
                const WidgetComponent = widgetComponents[widgetName];
                return (
                  <Draggable key={widgetName + index} draggableId={widgetName + index} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{widgetName}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => removeWidget(index)}>Remove</Button>
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
        <Button onClick={() => addWidget('TopPerformers')} className="mr-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Top Performers
        </Button>
        <Button onClick={() => addWidget('TrendingCoins')} className="mr-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Trending Coins
        </Button>
        <Button onClick={() => addWidget('CryptoNews')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Crypto News
        </Button>
      </div>
    </div>
  );
};

export default CustomizableDashboard;