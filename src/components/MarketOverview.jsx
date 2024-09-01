import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchMarketData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/global');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const MarketOverview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  const marketData = data.data;

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-primary">Market Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Active Cryptocurrencies</h3>
          <p className="text-2xl font-bold text-primary">{marketData.active_cryptocurrencies}</p>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Market Cap</h3>
          <p className="text-2xl font-bold text-primary">${marketData.total_market_cap.usd.toLocaleString()}</p>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold">24h Trading Volume</h3>
          <p className="text-2xl font-bold text-primary">${marketData.total_volume.usd.toLocaleString()}</p>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Bitcoin Dominance</h3>
          <p className="text-2xl font-bold text-primary">{marketData.market_cap_percentage.btc.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;