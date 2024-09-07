import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import { widgetComponents, initialWidgetSizes } from './WidgetComponents';

const WidgetCard = ({ widgetName, index, isExpanded, onToggleExpansion, onRemove, provided, isDragging, isLoading, columns }) => {
  const WidgetComponent = widgetComponents[widgetName];
  const { width, height } = getWidgetSize(widgetName, isExpanded, columns);

  return (
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
            <div className="flex items-center space-x-1 widget-controls">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleExpansion}
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
                      onClick={() => onRemove(index)}
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
  );
};

const getWidgetSize = (widgetName, isExpanded, columns) => {
  const size = initialWidgetSizes[widgetName] || { width: 1, height: 1 };
  return isExpanded ? { width: columns, height: size.height * 2 } : size;
};

export default WidgetCard;