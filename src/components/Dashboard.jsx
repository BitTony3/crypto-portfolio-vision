import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketOverview from './MarketOverview';
import GainerOfTheDay from './GainerOfTheDay';
import GreedFearIndex from './GreedFearIndex';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetchAllAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
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

  const sortedAssets = React.useMemo(() => {
    let sortableItems = [...filteredAssets];
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
  }, [filteredAssets, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) return <div className="text-2xl font-bold">Loading...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketOverview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Greed & Fear Index</CardTitle>
          </CardHeader>
          <CardContent>
            <GreedFearIndex />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Gainer of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <GainerOfTheDay />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Crypto Asset Search</CardTitle>
          <CardDescription>Search and sort through cryptocurrency assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search for assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  {['Rank', 'Name', 'Symbol', 'Price (USD)', 'Market Cap (USD)', '24h Change (%)'].map((header, index) => (
                    <th key={index} className="p-2 text-left font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(['rank', 'name', 'symbol', 'priceUsd', 'marketCapUsd', 'changePercent24Hr'][index])}
                        className="hover:text-primary"
                      >
                        {header}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedAssets.slice(0, 50).map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-2">{asset.rank}</td>
                    <td className="p-2">{asset.name}</td>
                    <td className="p-2">{asset.symbol}</td>
                    <td className="p-2">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                    <td className="p-2">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                    <td className={`p-2 ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
