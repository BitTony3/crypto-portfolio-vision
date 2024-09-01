import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fetchTokenPairData = async (tokenA, tokenB) => {
  // This is a mock function. In a real application, you would fetch data from a DEX API
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: Math.random() * 100 + 50,
    liquidity: Math.random() * 1000000 + 500000,
    volume: Math.random() * 500000 + 100000,
  }));
};

const TokenPairExplorer = () => {
  const [tokenA, setTokenA] = useState('ETH');
  const [tokenB, setTokenB] = useState('USDT');

  const { data, isLoading, error } = useQuery({
    queryKey: ['tokenPair', tokenA, tokenB],
    queryFn: () => fetchTokenPairData(tokenA, tokenB),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Token A"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
        />
        <Input
          placeholder="Token B"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
        />
        <Button>Explore</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{tokenA}/{tokenB} Price</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Liquidity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="liquidity" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenPairExplorer;