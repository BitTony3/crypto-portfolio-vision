import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Moralis from 'moralis';

const fetchLiquidityPools = async () => {
  try {
    const response = await Moralis.EvmApi.defi.getPairReserves({
      chain: '0x1',
      limit: 10,
    });

    const pools = response.result;

    const tokenAddresses = pools.flatMap(pool => [pool.token0Address, pool.token1Address]);
    const uniqueAddresses = [...new Set(tokenAddresses)];

    const tokenDetailsPromises = uniqueAddresses.map(address =>
      Moralis.EvmApi.token.getTokenMetadata({
        addresses: [address],
        chain: '0x1',
      })
    );

    const tokenDetailsResponses = await Promise.all(tokenDetailsPromises);
    const tokenDetails = Object.fromEntries(
      tokenDetailsResponses.map(response => [response.result[0].address, response.result[0]])
    );

    return pools.map(pool => ({
      id: pool.pairAddress,
      token0: tokenDetails[pool.token0Address].name,
      token1: tokenDetails[pool.token1Address].name,
      tvl: parseFloat(pool.reserve0) + parseFloat(pool.reserve1),
      apr: Math.random() * 100 + 10, // Simulated APR
      volume24h: Math.random() * 5000000 + 500000, // Simulated 24h volume
    }));
  } catch (error) {
    console.error('Error fetching liquidity pools:', error);
    throw error;
  }
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
