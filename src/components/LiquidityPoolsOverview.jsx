import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchLiquidityPools = async () => {
  // This is a mock function. In a real application, you would fetch data from a DEX API
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    pair: `Token${i + 1}/USDT`,
    tvl: Math.random() * 10000000 + 1000000,
    apr: Math.random() * 100 + 10,
    volume24h: Math.random() * 5000000 + 500000,
  }));
};

const LiquidityPoolsOverview = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['liquidityPools'],
    queryFn: fetchLiquidityPools,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Liquidity Pools</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead>APR</TableHead>
              <TableHead>24h Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>{pool.pair}</TableCell>
                <TableCell>${pool.tvl.toLocaleString()}</TableCell>
                <TableCell>{pool.apr.toFixed(2)}%</TableCell>
                <TableCell>${pool.volume24h.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LiquidityPoolsOverview;