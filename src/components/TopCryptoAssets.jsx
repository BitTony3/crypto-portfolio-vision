import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const mockWebSocket = {
  onmessage: null,
  send: () => {},
  close: () => {},
};

const TopCryptoAssets = () => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    // Mock WebSocket connection
    const ws = mockWebSocket;

    ws.onmessage = (event) => {
      // In a real implementation, we would parse the event.data
      // For now, we'll just update with mock data every 5 seconds
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: `asset-${i}`,
        rank: i + 1,
        name: `Crypto ${i + 1}`,
        priceUsd: (Math.random() * 10000).toFixed(2),
        marketCapUsd: (Math.random() * 1000000000).toFixed(2),
      }));
      setAssets(mockData);
    };

    // Simulate receiving data every 5 seconds
    const interval = setInterval(() => {
      if (ws.onmessage) {
        ws.onmessage({ data: 'mock data' });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

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
  }, [expanded, assets]);

  if (assets.length === 0) return <div className="text-2xl font-bold">Loading...</div>;

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg h-full">
      <h2 className="text-4xl font-bold mb-4 text-primary">Top 50 Crypto Assets (Real-time)</h2>
      {!expanded ? (
        <div 
          ref={scrollRef} 
          className="whitespace-nowrap overflow-hidden cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          {assets.map((asset) => (
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
              {assets.map((asset) => (
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
