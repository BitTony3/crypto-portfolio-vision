import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MarketOverview from './MarketOverview';
import GreedFearIndex from './GreedFearIndex';
import TopPerformers from './TopPerformers';
import TrendingCoins from './TrendingCoins';
import TokenPairExplorer from './TokenPairExplorer';
import LiquidityPoolsOverview from './LiquidityPoolsOverview';
import TradingViewChart from './TradingViewChart';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const assetsPerPage = 20;

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
        if (sortConfig.key === 'rank') {
          return sortConfig.direction === 'asc' 
            ? parseInt(a.rank) - parseInt(b.rank)
            : parseInt(b.rank) - parseInt(a.rank);
        }
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

  const paginatedAssets = sortedAssets.slice(
    (currentPage - 1) * assetsPerPage,
    currentPage * assetsPerPage
  );

  const totalPages = Math.ceil(sortedAssets.length / assetsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return <div className="text-2xl font-bold">Loading...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2 bg-secondary/50 backdrop-blur-sm border border-primary/20 animate-glow">
          <CardHeader>
            <CardTitle className="text-lg">Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketOverview />
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20 animate-glow">
          <CardHeader>
            <CardTitle className="text-lg">Fear & Greed Index</CardTitle>
          </CardHeader>
          <CardContent>
            <GreedFearIndex />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Token Pair Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenPairExplorer />
          </CardContent>
        </Card>
        <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <TopPerformers />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Trending Coins</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingCoins />
          </CardContent>
        </Card>
        <Card className="col-span-2 bg-secondary/50 backdrop-blur-sm border border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Liquidity Pools Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <LiquidityPoolsOverview />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Advanced Chart</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TradingViewChart />
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Crypto Asset Search</CardTitle>
          <CardDescription>Search and sort through cryptocurrency assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search for assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-muted/50"
              />
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                size="sm"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/20">
                  {['Rank', 'Name', 'Symbol', 'Price (USD)', 'Market Cap (USD)', '24h Change (%)'].map((header, index) => (
                    <th key={index} className="p-2 text-left font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(['rank', 'name', 'symbol', 'priceUsd', 'marketCapUsd', 'changePercent24Hr'][index])}
                        className="hover:text-primary"
                      >
                        {header}
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-muted/10">
                    <td className="p-2 text-sm">{asset.rank}</td>
                    <td className="p-2 text-sm font-semibold" style={{color: `var(--crypto-${asset.symbol.toLowerCase()}, var(--primary))`}}>{asset.name}</td>
                    <td className="p-2 text-sm">{asset.symbol}</td>
                    <td className="p-2 text-sm">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                    <td className="p-2 text-sm">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                    <td className={`p-2 text-sm ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                size="sm"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
