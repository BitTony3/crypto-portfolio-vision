import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { apiRouter } from '../lib/apiRouter';

const fetchMarketData = async () => {
  return apiRouter('/global');
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

  const dominanceData = [
    { name: 'BTC', value: marketData.market_cap_percentage.btc },
    { name: 'ETH', value: marketData.market_cap_percentage.eth },
    { name: 'Others', value: 100 - marketData.market_cap_percentage.btc - marketData.market_cap_percentage.eth },
  ];

  const COLORS = ['#F7931A', '#627EEA', '#8884d8'];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <div className="bg-background p-4 rounded-lg shadow-md flex flex-col justify-between">
          <h3 className="text-sm font-semibold">Active Cryptocurrencies</h3>
          <p className="text-3xl font-bold text-primary animate-pulse">{marketData.active_cryptocurrencies}</p>
        </div>
        <div className="bg-background p-4 rounded-lg shadow-md flex flex-col justify-between">
          <h3 className="text-sm font-semibold">Total Market Cap</h3>
          <p className="text-2xl font-bold text-primary">${formatLargeNumber(marketData.total_market_cap.usd)}</p>
          <div className="flex items-center mt-2">
            {marketData.market_cap_change_percentage_24h_usd >= 0 ? (
              <TrendingUp className="text-green-500 mr-1 animate-bounce" size={16} />
            ) : (
              <TrendingDown className="text-red-500 mr-1 animate-bounce" size={16} />
            )}
            <span className={`text-sm font-semibold ${marketData.market_cap_change_percentage_24h_usd >= 0 ? "text-green-500" : "text-red-500"}`}>
              {marketData.market_cap_change_percentage_24h_usd.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="bg-background p-4 rounded-lg shadow-md flex-grow">
        <h3 className="text-sm font-semibold mb-2">24h Trading Volume</h3>
        <p className="text-2xl font-bold text-primary">${formatLargeNumber(marketData.total_volume.usd)}</p>
        <Progress value={marketData.total_volume.usd / marketData.total_market_cap.usd * 100} className="mt-2 h-2 bg-blue-200" indicatorClassName="bg-blue-600" />
      </div>
      <div className="bg-background p-4 rounded-lg shadow-md flex-grow">
        <h3 className="text-sm font-semibold mb-2">Market Dominance</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={dominanceData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {dominanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketOverview;
