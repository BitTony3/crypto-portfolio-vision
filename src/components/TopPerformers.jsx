import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchTopPerformers = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=5');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TopPerformers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['topPerformers'],
    queryFn: fetchTopPerformers,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      {data.data.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)).map((asset) => (
        <div key={asset.id} className="flex justify-between items-center">
          <span className="font-medium">{asset.symbol}</span>
          <span className={`font-bold ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(asset.changePercent24Hr).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default TopPerformers;