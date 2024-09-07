import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings, HelpCircle, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DashboardHeader = ({ onAddWidget, onRefresh, onStartTour, onOpenSettings }) => {
  return (
    <div className="flex justify-between items-center mb-6 dashboard-header">
      <h2 className="text-3xl font-bold text-primary">Customizable Dashboard</h2>
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Refresh Dashboard
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 add-widget-button" onClick={onAddWidget}>
          <Plus className="mr-2 h-4 w-4" /> Add Widget
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onOpenSettings}>
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
              <Button variant="outline" size="icon" onClick={onStartTour}>
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
  );
};

export default DashboardHeader;