import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

const mockWebSocket = {
  onmessage: null,
  send: () => {},
  close: () => {},
};

const TopCryptoAssets = () => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);
  const [assets, setAssets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });

  useEffect(() => {
    const ws = mockWebSocket;

    ws.onmessage = () => {
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: `asset-${i}`,
        rank: i + 1,
        name: `Crypto ${i + 1}`,
        symbol: `C${i + 1}`,
        priceUsd: (Math.random() * 10000).toFixed(2),
        marketCapUsd: (Math.random() * 1000000000).toFixed(2),
        changePercent24Hr: (Math.random() * 20 - 10).toFixed(2),
      }));
      setAssets(mockData);
    };

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

  const sortedAssets = React.useMemo(() => {
    let sortableItems = [...assets];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [assets, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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
          {sortedAssets.map((asset) => (
            <span key={asset.id} className="inline-block mr-4 text-primary">
              {asset.name} ({asset.symbol}): ${parseFloat(asset.priceUsd).toFixed(2)}
              <span className={`ml-1 ${asset.changePercent24Hr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {asset.changePercent24Hr >= 0 ? <TrendingUp className="inline h-4 w-4" /> : <TrendingDown className="inline h-4 w-4" />}
                {asset.changePercent24Hr}%
              </span>
            </span>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-4 border-primary min-w-[300px]">
            <thead>
              <tr className="bg-primary text-secondary">
                {['Rank', 'Name', 'Symbol', 'Price (USD)', 'Market Cap (USD)', '24h Change (%)'].map((header, index) => (
                  <th key={index} className="p-2 border-2 border-secondary">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(['rank', 'name', 'symbol', 'priceUsd', 'marketCapUsd', 'changePercent24Hr'][index])}
                      className="text-xs hover:text-accent"
                    >
                      {header}
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-background text-text">
                  <td className="p-2 border-2 border-primary">{asset.rank}</td>
                  <td className="p-2 border-2 border-primary">{asset.name}</td>
                  <td className="p-2 border-2 border-primary">{asset.symbol}</td>
                  <td className="p-2 border-2 border-primary">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                  <td className="p-2 border-2 border-primary">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                  <td className={`p-2 border-2 border-primary ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.changePercent24Hr >= 0 ? <TrendingUp className="inline mr-1 h-4 w-4" /> : <TrendingDown className="inline mr-1 h-4 w-4" />}
                    {asset.changePercent24Hr}%
                  </td>
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
