import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const fetchAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const GainerOfTheDay = () => {
  const [showGainers, setShowGainers] = useState(true);
  const { data, isLoading, error } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-lg font-bold text-red-600">Error: {error.message}</div>;

  const sortedAssets = [...data.data].sort((a, b) => 
    parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)
  );

  const topAssets = showGainers 
    ? sortedAssets.slice(0, 10) 
    : sortedAssets.slice(-10).reverse();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {showGainers ? "Top 10 Gainers" : "Top 10 Losers"}
        </h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="gainer-loser-switch"
            checked={showGainers}
            onCheckedChange={setShowGainers}
          />
          <Label htmlFor="gainer-loser-switch">
            {showGainers ? "Show Losers" : "Show Gainers"}
          </Label>
        </div>
      </div>
      <div className="space-y-2">
        {topAssets.map((asset, index) => (
          <div key={asset.id} className="flex justify-between items-center p-2 bg-card rounded-lg">
            <div>
              <p className="font-semibold">{asset.name} ({asset.symbol})</p>
              <p className="text-sm">Rank: {asset.rank}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${parseFloat(asset.priceUsd).toFixed(2)}</p>
              <p className={`text-sm font-semibold ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(asset.changePercent24Hr) >= 0 ? '+' : ''}
                {parseFloat(asset.changePercent24Hr).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GainerOfTheDay;
