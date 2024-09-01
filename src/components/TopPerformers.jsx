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
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Gainers (Mock Data)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((token, index) => (
              <TableRow key={index}>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>{token.chain}</TableCell>
                <TableCell>${token.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={token.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {token.priceChangePercentage24h >= 0 ? <TrendingUp className="inline mr-1" /> : <TrendingDown className="inline mr-1" />}
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
