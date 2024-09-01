import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Activity, Cpu, Database, Zap } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY'; // Replace with your actual Etherscan API key

const fetchOnChainData = async () => {
  const endpoints = [
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`,
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`,
    `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${ETHERSCAN_API_KEY}`,
    `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`
  ];

  const responses = await Promise.all(endpoints.map(url => fetch(url).then(res => res.json())));
  return {
    ethPrice: responses[0].result,
    gasOracle: responses[1].result,
    ethSupply: responses[2].result,
    latestBlock: parseInt(responses[3].result, 16)
  };
};

const OnChainActivity = () => {
  const [showChart, setShowChart] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['onChainData'],
    queryFn: fetchOnChainData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

  const gasChartData = [
    { name: 'Safe Low', value: parseInt(data.gasOracle.SafeGasPrice) },
    { name: 'Standard', value: parseInt(data.gasOracle.ProposeGasPrice) },
    { name: 'Fast', value: parseInt(data.gasOracle.FastGasPrice) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ethereum On-Chain Activity</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-chart"
            checked={showChart}
            onCheckedChange={setShowChart}
          />
          <Label htmlFor="show-chart">
            {showChart ? "Hide Chart" : "Show Gas Chart"}
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ETH Price
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(data.ethPrice.ethusd)}</div>
            <p className="text-xs text-muted-foreground">
              Updated: {new Date(data.ethPrice.ethusd_timestamp * 1000).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gas Prices (Gwei)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.gasOracle.ProposeGasPrice}</div>
            <p className="text-xs text-muted-foreground">
              Safe Low: {data.gasOracle.SafeGasPrice} | Fast: {data.gasOracle.FastGasPrice}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ETH Supply
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.ethSupply / 1e18)}</div>
            <p className="text-xs text-muted-foreground">
              Total ETH in circulation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Block
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.latestBlock)}</div>
            <p className="text-xs text-muted-foreground">
              Current Ethereum block height
            </p>
          </CardContent>
        </Card>
      </div>

      {showChart && (
        <Card>
          <CardHeader>
            <CardTitle>Gas Price Chart</CardTitle>
            <CardDescription>Comparison of different gas price levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gasChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnChainActivity;
