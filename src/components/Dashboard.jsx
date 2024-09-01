import React, { useState, useEffect } from 'react';
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
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const fetchAllAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Dashboard = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const assetsPerPage = 20;

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: assetsData, isLoading: assetsLoading, error: assetsError } = useQuery({
    queryKey: ['allAssets'],
    queryFn: fetchAllAssets,
  });

  const filteredAssets = React.useMemo(() => {
    if (!assetsData || !assetsData.data) return [];
    return assetsData.data.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assetsData, searchTerm]);

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

  if (assetsLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-[200px] col-span-3" />
        <Skeleton className="h-[150px]" />
        <Skeleton className="h-[150px]" />
        <Skeleton className="h-[150px]" />
        <Skeleton className="h-[300px] col-span-3" />
      </div>
    );
  }

  if (assetsError) {
    toast.error(`Error loading data: ${assetsError.message}`);
    return <div className="text-lg text-red-600">Error: {assetsError.message}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Market Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <MarketOverview />
        </CardContent>
      </Card>
  
      <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Fear & Greed Index</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <GreedFearIndex />
        </CardContent>
      </Card>
  
      <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Top Performers</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <TopPerformers />
        </CardContent>
      </Card>
  
      <Card className="bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Trending Coins</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <TrendingCoins />
        </CardContent>
      </Card>

      <Card className="col-span-2 bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Token Pair Explorer</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <TokenPairExplorer />
        </CardContent>
      </Card>
  
      <Card className="col-span-2 bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Liquidity Pools Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <LiquidityPoolsOverview />
        </CardContent>
      </Card>

      <Card className="col-span-4 bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardContent className="p-2">
          <TradingViewChart />
        </CardContent>
      </Card>
      
      <Card className="col-span-4 bg-secondary/50 backdrop-blur-sm border border-primary/20">
        <CardHeader className="p-2">
          <CardTitle className="text-sm text-primary">Crypto Asset Search</CardTitle>
          <CardDescription className="text-xs">Search and sort through cryptocurrency assets</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs bg-muted/50"
              />
              <Button className="text-xs bg-primary hover:bg-primary/90">
                <Search className="mr-1 h-3 w-3" /> Search
              </Button>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted/20">
                  {['Rank', 'Name', 'Symbol', 'Price (USD)', 'Market Cap (USD)', '24h Change (%)'].map((header, index) => (
                    <th key={index} className="p-1 text-left font-normal text-muted-foreground">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(['rank', 'name', 'symbol', 'priceUsd', 'marketCapUsd', 'changePercent24Hr'][index])}
                        className="text-xs hover:text-primary"
                      >
                        {header}
                        <ArrowUpDown className="ml-1 h-2 w-2" />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-border hover:bg-muted/10">
                    <td className="p-1">{asset.rank}</td>
                    <td className="p-1" style={{color: `var(--crypto-${asset.symbol.toLowerCase()}, var(--primary))`}}>{asset.name}</td>
                    <td className="p-1">{asset.symbol}</td>
                    <td className="p-1">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                    <td className="p-1">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
                    <td className={`p-1 ${parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs">
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-2 right-2"
          >
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="sm" className="rounded-full">
              <ArrowUp className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
