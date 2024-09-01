import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockData = [
  { symbol: 'BTC', chain: 'Bitcoin', price: 50000, priceChangePercentage24h: 5.2 },
  { symbol: 'ETH', chain: 'Ethereum', price: 3000, priceChangePercentage24h: 3.8 },
  { symbol: 'BNB', chain: 'BSC', price: 400, priceChangePercentage24h: 2.5 },
  { symbol: 'ADA', chain: 'Cardano', price: 1.5, priceChangePercentage24h: 1.9 },
  { symbol: 'SOL', chain: 'Solana', price: 100, priceChangePercentage24h: 4.1 },
];

const TopPerformers = () => {
  return (
    <Card className="h-full flex flex-col p-2">
      <CardHeader className="pb-1 px-0">
        <CardTitle className="text-sm">Top 5 Gainers (Mock Data)</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-0 text-xs">
        <div className="grid grid-cols-4 gap-1 font-semibold mb-1">
          <div>Token</div>
          <div>Chain</div>
          <div>Price</div>
          <div>24h</div>
        </div>
        {mockData.map((token, index) => (
          <div key={index} className="grid grid-cols-4 gap-1 py-1 border-t border-border">
            <div>{token.symbol}</div>
            <div>{token.chain}</div>
            <div>${token.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div className={token.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}>
              {token.priceChangePercentage24h >= 0 ? <TrendingUp className="inline mr-0.5 h-3 w-3" /> : <TrendingDown className="inline mr-0.5 h-3 w-3" />}
              {token.priceChangePercentage24h.toFixed(2)}%
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
