import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchDeFiData = async () => {
  // Implement API call to fetch DeFi data
  // For now, we'll return mock data
  return {
    totalValueLocked: 150000000000,
    topProtocol: 'Aave',
    topProtocolTVL: 20000000000,
  };
};

const DeFiOverview = () => {
  const { data: defiData, isLoading, error } = useQuery({
    queryKey: ['defiData'],
    queryFn: fetchDeFiData,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Total Value Locked:</span>
        <span className="font-semibold">${(defiData.totalValueLocked / 1e9).toFixed(2)}B</span>
      </div>
      <div className="flex justify-between">
        <span>Top Protocol:</span>
        <span className="font-semibold">{defiData.topProtocol}</span>
      </div>
      <div className="flex justify-between">
        <span>Top Protocol TVL:</span>
        <span className="font-semibold">${(defiData.topProtocolTVL / 1e9).toFixed(2)}B</span>
      </div>
    </div>
  );
};

export default DeFiOverview;