import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";

const fetchTopAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=50');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TopCryptoAssets = () => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['topAssets'],
    queryFn: fetchTopAssets,
  });

  useEffect(() => {
    if (scrollRef.current && !expanded) {
      const scrollContent = scrollRef.current;
      let scrollAmount = 0;
      const step = 1;
      const interval = setInterval(() => {
        scrollContent.scrollLeft += step;
        scrollAmount += step;
        if (scrollAmount >= scrollContent.scrollWidth) {
          scrollContent.scrollLeft = 0;
          scrollAmount = 0;
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [expanded, data]);

  if (isLoading) return <div className="text-2xl font-bold">Loading...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg h-full">
      <h2 className="text-4xl font-bold mb-4 text-primary">Top 50 Crypto Assets</h2>
      {!expanded ? (
        <div 
          ref={scrollRef} 
          className="whitespace-nowrap overflow-hidden cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          {data.data.map((asset) => (
            <span key={asset.id} className="inline-block mr-4 text-primary">
              {asset.name}: ${parseFloat(asset.priceUsd).toFixed(2)}
            </span>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-4 border-primary min-w-[300px]">
            <thead>
              <tr className="bg-primary text-secondary">
                <th className="p-2 border-2 border-secondary">Rank</th>
                <th className="p-2 border-2 border-secondary">Name</th>
                <th className="p-2 border-2 border-secondary">Price (USD)</th>
                <th className="p-2 border-2 border-secondary">Market Cap (USD)</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((asset) => (
                <tr key={asset.id} className="hover:bg-background text-text">
                  <td className="p-2 border-2 border-primary">{asset.rank}</td>
                  <td className="p-2 border-2 border-primary">{asset.name}</td>
                  <td className="p-2 border-2 border-primary">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                  <td className="p-2 border-2 border-primary">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button 
            onClick={() => setExpanded(false)} 
            className="mt-4 bg-primary text-secondary hover:bg-accent"
          >
            Collapse
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopCryptoAssets;
