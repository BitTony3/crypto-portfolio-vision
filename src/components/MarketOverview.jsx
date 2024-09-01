import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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

  const formatLargeNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Active Cryptocurrencies</h3>
          <p className="text-2xl font-bold text-primary">{marketData.active_cryptocurrencies}</p>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Total Market Cap</h3>
          <p className="text-2xl font-bold text-primary">${formatLargeNumber(marketData.total_market_cap.usd)}</p>
          <div className="flex items-center mt-2">
            {marketData.market_cap_change_percentage_24h_usd >= 0 ? (
              <TrendingUp className="text-green-500 mr-1" size={16} />
            ) : (
              <TrendingDown className="text-red-500 mr-1" size={16} />
            )}
            <span className={marketData.market_cap_change_percentage_24h_usd >= 0 ? "text-green-500" : "text-red-500"}>
              {marketData.market_cap_change_percentage_24h_usd.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">24h Trading Volume</h3>
        <p className="text-2xl font-bold text-primary">${formatLargeNumber(marketData.total_volume.usd)}</p>
        <Progress value={marketData.total_volume.usd / marketData.total_market_cap.usd * 100} className="mt-2" />
      </div>
      <div className="bg-background p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Market Dominance</h3>
        <div className="flex justify-between items-center">
          <span>BTC</span>
          <Progress value={marketData.market_cap_percentage.btc} className="w-3/4" />
          <span>{marketData.market_cap_percentage.btc.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>ETH</span>
          <Progress value={marketData.market_cap_percentage.eth} className="w-3/4" />
          <span>{marketData.market_cap_percentage.eth.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
