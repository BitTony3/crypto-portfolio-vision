import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from "@/components/ui/use-toast";
import Joyride, { STATUS } from 'react-joyride';
import { useWidgetLayout } from '../hooks/useWidgetLayout';
import { useWidgetExpansion } from '../hooks/useWidgetExpansion';
import { useWidgetRefresh } from '../hooks/useWidgetRefresh';
import WidgetCard from './WidgetCard';
import DashboardHeader from './DashboardHeader';
import SettingsDialog from './SettingsDialog';
import AddWidgetDialog from './AddWidgetDialog';
import { widgetComponents } from './WidgetComponents';

const CustomizableDashboard = () => {
  const { widgets, setWidgets, addWidget, removeWidget } = useWidgetLayout();
  const { expandedWidgets, toggleWidgetExpansion } = useWidgetExpansion();
  const { isLoading, refreshDashboard } = useWidgetRefresh();
  const [columns, setColumns] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const { toast } = useToast();
  const [runTour, setRunTour] = useState(false);

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

  const onDragStart = () => setIsDragging(true);
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

  const handleAddWidget = (widgetName) => {
    addWidget(widgetName);
    setIsAddWidgetOpen(false);
    toast({
      title: "Widget added",
      description: `${widgetName} has been added to your dashboard.`,
    });
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
      <DashboardHeader
        onAddWidget={() => setIsAddWidgetOpen(true)}
        onRefresh={refreshDashboard}
        onStartTour={() => setRunTour(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
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
              {widgets.map((widgetName, index) => (
                <Draggable key={widgetName} draggableId={widgetName} index={index}>
                  {(provided) => (
                    <WidgetCard
                      widgetName={widgetName}
                      index={index}
                      isExpanded={expandedWidgets[widgetName]}
                      onToggleExpansion={() => toggleWidgetExpansion(widgetName)}
                      onRemove={() => removeWidget(index)}
                      provided={provided}
                      isDragging={isDragging}
                      isLoading={isLoading}
                      columns={columns}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        columns={columns}
        setColumns={setColumns}
      />
      <AddWidgetDialog
        isOpen={isAddWidgetOpen}
        onClose={() => setIsAddWidgetOpen(false)}
        onAddWidget={handleAddWidget}
        availableWidgets={Object.keys(widgetComponents)}
      />
    </div>
  );
};

export default CustomizableDashboard;