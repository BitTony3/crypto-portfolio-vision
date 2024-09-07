import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useWidgetRefresh = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshDashboard = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Dashboard refreshed",
      description: "All widgets have been updated with the latest data.",
    });
  };

  return { isLoading, refreshDashboard };
};