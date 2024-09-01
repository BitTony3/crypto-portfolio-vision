import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRouter } from '../lib/apiRouter';

const fetchTrendingCoins = async () => {
  return apiRouter('/search/trending');
};

const TrendingCoins = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins,
  });

  if (isLoading) return (
    <Card className="h-full flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </Card>
  );
  if (error) return (
    <Card className="h-full flex items-center justify-center">
      <div className="text-xs text-red-600">Error: {error.message}</div>
    </Card>
  );

  return (
    <Card className="h-full flex flex-col p-2">
      <CardHeader className="pb-1 px-0">
        <CardTitle className="text-sm flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          Trending Coins
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-0 text-xs">
        <div className="grid grid-cols-3 gap-1 font-semibold mb-1">
          <div>Coin</div>
          <div>Symbol</div>
          <div>Rank</div>
        </div>
        {data.coins.slice(0, 5).map((coin) => (
          <div key={coin.item.id} className="grid grid-cols-3 gap-1 py-1 border-t border-border">
            <div className="truncate">{coin.item.name}</div>
            <div>{coin.item.symbol}</div>
            <div>#{coin.item.market_cap_rank || 'N/A'}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingCoins;
