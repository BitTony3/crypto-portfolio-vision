import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockData = [
  { symbol: 'BTC', chain: 'Bitcoin', price: 50000, priceChangePercentage24h: 5.2 },
  { symbol: 'ETH', chain: 'Ethereum', price: 3000, priceChangePercentage24h: 3.8 },
  { symbol: 'BNB', chain: 'Binance Smart Chain', price: 400, priceChangePercentage24h: 2.5 },
  { symbol: 'ADA', chain: 'Cardano', price: 1.5, priceChangePercentage24h: 1.9 },
  { symbol: 'SOL', chain: 'Solana', price: 100, priceChangePercentage24h: 4.1 },
];

const TopPerformers = () => {
  return (
    <Card className="h-full flex flex-col p-2">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm">Top 5 Gainers (Mock Data)</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2">Token</TableHead>
              <TableHead className="py-2">Chain</TableHead>
              <TableHead className="py-2">Price</TableHead>
              <TableHead className="py-2">24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((token, index) => (
              <TableRow key={index}>
                <TableCell className="py-2">{token.symbol}</TableCell>
                <TableCell className="py-2">{token.chain}</TableCell>
                <TableCell className="py-2">${token.price.toFixed(2)}</TableCell>
                <TableCell className="py-2">
                  <span className={token.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {token.priceChangePercentage24h >= 0 ? <TrendingUp className="inline mr-1 h-4 w-4" /> : <TrendingDown className="inline mr-1 h-4 w-4" />}
                    {token.priceChangePercentage24h.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
