import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchGasPrices = async () => {
  // Implement API call to fetch gas prices
  // For now, we'll return mock data
  return {
    low: 20,
    average: 35,
    high: 50,
  };
};

const GasTracker = () => {
  const { data: gasPrices, isLoading, error } = useQuery({
    queryKey: ['gasPrices'],
    queryFn: fetchGasPrices,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Low:</span>
        <span className="font-semibold">{gasPrices.low} Gwei</span>
      </div>
      <div className="flex justify-between">
        <span>Average:</span>
        <span className="font-semibold">{gasPrices.average} Gwei</span>
      </div>
      <div className="flex justify-between">
        <span>High:</span>
        <span className="font-semibold">{gasPrices.high} Gwei</span>
      </div>
    </div>
  );
};

export default GasTracker;