import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const fetchMarketData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/global');
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  return response.json();
};

const MarketOverview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-sm font-bold text-red-600">Error: {error.message}</div>;

  const marketData = data.data;

  const formatLargeNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  const dominanceData = [
    { name: 'BTC', value: marketData.market_cap_percentage.btc },
    { name: 'ETH', value: marketData.market_cap_percentage.eth },
    { name: 'Others', value: 100 - marketData.market_cap_percentage.btc - marketData.market_cap_percentage.eth },
  ];

  const COLORS = ['#F7931A', '#627EEA', '#8884d8'];

  return (
    <div className="grid grid-cols-2 gap-2 h-full text-xs">
      <div className="bg-card p-2 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Active Cryptos</h3>
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
        <p className="text-xl font-bold text-primary">{marketData.active_cryptocurrencies.toLocaleString()}</p>
      </div>
      <div className="bg-card p-2 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Total Market Cap</h3>
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <p className="text-xl font-bold text-primary">${formatLargeNumber(marketData.total_market_cap.usd)}</p>
        <div className="flex items-center mt-1">
          {marketData.market_cap_change_percentage_24h_usd >= 0 ? (
            <TrendingUp className="text-green-500 mr-1" size={12} />
          ) : (
            <TrendingDown className="text-red-500 mr-1" size={12} />
          )}
          <span className={`font-semibold ${marketData.market_cap_change_percentage_24h_usd >= 0 ? "text-green-500" : "text-red-500"}`}>
            {marketData.market_cap_change_percentage_24h_usd.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="bg-card p-2 rounded-lg shadow-sm col-span-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold">24h Trading Volume</h3>
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
        <p className="text-lg font-bold text-primary">${formatLargeNumber(marketData.total_volume.usd)}</p>
        <Progress 
          value={marketData.total_volume.usd / marketData.total_market_cap.usd * 100} 
          className="mt-1 h-1.5" 
        />
        <p className="text-right text-xs mt-1">
          {(marketData.total_volume.usd / marketData.total_market_cap.usd * 100).toFixed(2)}% of Market Cap
        </p>
      </div>
      <div className="bg-card p-2 rounded-lg shadow-sm col-span-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold">Market Dominance</h3>
          <PieChartIcon className="h-4 w-4 text-primary" />
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie
              data={dominanceData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={40}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {dominanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-around text-xs mt-1">
          {dominanceData.map((entry, index) => (
            <div key={entry.name} className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index] }}></div>
              <span>{entry.name}: {entry.value.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;