import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchTrendingCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TrendingCoins = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      {data.coins.slice(0, 5).map((coin) => (
        <div key={coin.item.id} className="flex justify-between items-center">
          <span className="font-medium">{coin.item.symbol}</span>
          <span className="font-bold">#{coin.item.market_cap_rank}</span>
        </div>
      ))}
    </div>
  );
};

export default TrendingCoins;