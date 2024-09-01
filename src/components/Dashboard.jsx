import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketOverview from './MarketOverview';
import GainerOfTheDay from './GainerOfTheDay';
import GreedFearIndex from './GreedFearIndex';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fetchAllAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
  });

  const filteredAssets = React.useMemo(() => {
    if (!data || !data.data) return [];
    return data.data.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (isLoading) return <div className="text-2xl font-bold">Loading...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MarketOverview />
        <GreedFearIndex />
      </div>
      
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Crypto Asset Search</TabsTrigger>
          <TabsTrigger value="gainer">Gainer of the Day</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
            <h2 className="text-4xl font-bold mb-4 text-primary">Crypto Asset Search</h2>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Search for assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button className="bg-primary text-secondary hover:bg-accent">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-4 border-primary">
                <thead>
                  <tr className="bg-primary text-secondary">
                    <th className="p-2 border-2 border-secondary">Rank</th>
                    <th className="p-2 border-2 border-secondary">Name</th>
                    <th className="p-2 border-2 border-secondary">Symbol</th>
                    <th className="p-2 border-2 border-secondary">Price (USD)</th>
                    <th className="p-2 border-2 border-secondary">Market Cap (USD)</th>
                    <th className="p-2 border-2 border-secondary">24h Change (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.slice(0, 50).map((asset) => (
                    <tr key={asset.id} className="hover:bg-background text-text">
                      <td className="p-2 border-2 border-primary">{asset.rank}</td>
                      <td className="p-2 border-2 border-primary">{asset.name}</td>
                      <td className="p-2 border-2 border-primary">{asset.symbol}</td>
                      <td className="p-2 border-2 border-primary">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                      <td className="p-2 border-2 border-primary">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                      <td className={`p-2 border-2 border-primary ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="gainer">
          <GainerOfTheDay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
