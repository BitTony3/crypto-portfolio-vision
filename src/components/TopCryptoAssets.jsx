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
    <div className="bg-dark-blue border-4 border-neon-blue p-4 shadow-[0_0_10px_#00FFFF]">
      <h2 className="text-4xl font-bold mb-4 text-neon-blue">Top 50 Crypto Assets</h2>
      {!expanded ? (
        <div 
          ref={scrollRef} 
          className="whitespace-nowrap overflow-hidden cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          {data.data.map((asset) => (
            <span key={asset.id} className="inline-block mr-4 text-neon-blue">
              {asset.name}: ${parseFloat(asset.priceUsd).toFixed(2)}
            </span>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-4 border-neon-blue min-w-[300px]">
            <thead>
              <tr className="bg-black text-neon-blue">
                <th className="p-2 border-2 border-neon-blue">Rank</th>
                <th className="p-2 border-2 border-neon-blue">Name</th>
                <th className="p-2 border-2 border-neon-blue">Price (USD)</th>
                <th className="p-2 border-2 border-neon-blue">Market Cap (USD)</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((asset) => (
                <tr key={asset.id} className="hover:bg-black text-off-white">
                  <td className="p-2 border-2 border-neon-blue">{asset.rank}</td>
                  <td className="p-2 border-2 border-neon-blue">{asset.name}</td>
                  <td className="p-2 border-2 border-neon-blue">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                  <td className="p-2 border-2 border-neon-blue">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button 
            onClick={() => setExpanded(false)} 
            className="mt-4 bg-neon-blue text-black hover:bg-blue-400"
          >
            Collapse
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopCryptoAssets;
