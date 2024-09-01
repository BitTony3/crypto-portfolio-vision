import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Moralis from 'moralis';

const SUPPORTED_CHAINS = [
  { id: 'eth', name: 'Ethereum' },
  { id: 'bsc', name: 'Binance Smart Chain' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'avalanche', name: 'Avalanche' },
  { id: 'fantom', name: 'Fantom' },
];

const fetchTopPerformers = async () => {
  const results = await Promise.all(SUPPORTED_CHAINS.map(async (chain) => {
    try {
      const response = await Moralis.EvmApi.token.getTopERC20TokensByPriceMovers({
        chain: chain.id,
        limit: 10,
      });
      return response.result.map(token => ({
        symbol: token.symbol,
        chain: chain.name,
        price: token.price?.usdPrice,
        priceChangePercentage24h: token.price?.['24hPercentChange'],
        address: token.address,
      }));
    } catch (error) {
      console.error(`Error fetching data for ${chain.name}:`, error);
      return [];
    }
  }));

  return results.flat().sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h).slice(0, 10);
};

const TopPerformers = () => {
  const { data: topGainers, isLoading, error } = useQuery({
    queryKey: ['topPerformers'],
    queryFn: fetchTopPerformers,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Gainers Across Chains</CardTitle>
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
            {topGainers?.map((token, index) => (
              <TableRow key={`${token.chain}-${token.address}`}>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>{token.chain}</TableCell>
                <TableCell>${parseFloat(token.price).toFixed(4)}</TableCell>
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
