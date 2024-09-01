import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const fetchGainerOfTheDay = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const GainerOfTheDay = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['gainerOfTheDay'],
    queryFn: fetchGainerOfTheDay,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-lg font-bold text-red-600">Error: {error.message}</div>;

  const gainer = data.data.reduce((max, asset) => {
    return parseFloat(asset.changePercent24Hr) > parseFloat(max.changePercent24Hr) ? asset : max;
  }, data.data[0]);

  const chartData = Array(24).fill().map((_, i) => ({
    name: i,
    value: Math.random() * 100
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-lg font-semibold">{gainer.name} ({gainer.symbol})</p>
          <p className="text-sm">Rank: {gainer.rank}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${parseFloat(gainer.priceUsd).toFixed(2)}</p>
          <p className="text-sm font-semibold text-green-600">
            +{parseFloat(gainer.changePercent24Hr).toFixed(2)}%
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GainerOfTheDay;
