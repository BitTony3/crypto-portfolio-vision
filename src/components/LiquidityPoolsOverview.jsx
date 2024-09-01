import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const fetchLiquidityPools = async () => {
  // Mock data for liquidity pools
  const mockPools = [
    { id: '0x1', token0: 'ETH', token1: 'USDT', tvl: 1000000, apr: 15.5, volume24h: 500000 },
    { id: '0x2', token0: 'BTC', token1: 'USDC', tvl: 2000000, apr: 12.3, volume24h: 750000 },
    { id: '0x3', token0: 'LINK', token1: 'ETH', tvl: 500000, apr: 18.7, volume24h: 250000 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPools), 1000); // Simulate API delay
  });
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
                <TableCell>{pool.token0} / {pool.token1}</TableCell>
                <TableCell>${pool.tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                <TableCell>{pool.apr.toFixed(2)}%</TableCell>
                <TableCell>${pool.volume24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LiquidityPoolsOverview;