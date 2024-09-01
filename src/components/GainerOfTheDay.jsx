import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchGainerOfTheDay = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=1&sort=changePercent24Hr&order=desc');
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
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  const gainer = data.data[0];

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-primary">Gainer of the Day</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl font-semibold">{gainer.name} ({gainer.symbol})</p>
          <p className="text-lg">Rank: {gainer.rank}</p>
        </div>
        <div>
          <p className="text-lg">Price: ${parseFloat(gainer.priceUsd).toFixed(2)}</p>
          <p className="text-lg text-green-600">
            24h Change: {parseFloat(gainer.changePercent24Hr).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default GainerOfTheDay;