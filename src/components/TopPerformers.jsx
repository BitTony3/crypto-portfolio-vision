import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Activity, Cpu, Database, Zap } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import BlockchainPicker from './BlockchainPicker';

const API_KEYS = {
  ethereum: 'YOUR_ETHERSCAN_API_KEY',
  solana: 'YOUR_SOLANA_API_KEY',
  bitcoin: 'YOUR_BITCOIN_API_KEY',
  tron: 'YOUR_TRON_API_KEY',
  ton: 'YOUR_TON_API_KEY',
};

const fetchOnChainData = async (blockchain) => {
  switch (blockchain) {
    case 'ethereum':
      return fetchEthereumData();
    case 'solana':
      return fetchSolanaData();
    case 'bitcoin':
      return fetchBitcoinData();
    case 'tron':
      return fetchTronData();
    case 'ton':
      return fetchTonData();
    default:
      throw new Error('Unsupported blockchain');
  }
};

const fetchEthereumData = async () => {
  const endpoints = [
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEYS.ethereum}`,
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${API_KEYS.ethereum}`,
    `https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${API_KEYS.ethereum}`,
    `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${API_KEYS.ethereum}`
  ];

  const responses = await Promise.all(endpoints.map(url => fetch(url).then(res => res.json())));
  return {
    price: responses[0].result.ethusd,
    gasPrice: responses[1].result.ProposeGasPrice,
    supply: responses[2].result,
    latestBlock: parseInt(responses[3].result, 16)
  };
};

const fetchSolanaData = async () => {
  // Implement Solana data fetching
  // This is a placeholder implementation
  return {
    price: 0,
    gasPrice: 0,
    supply: 0,
    latestBlock: 0
  };
};

const fetchBitcoinData = async () => {
  // Implement Bitcoin data fetching
  // This is a placeholder implementation
  return {
    price: 0,
    gasPrice: 0,
    supply: 0,
    latestBlock: 0
  };
};

const fetchTronData = async () => {
  // Implement Tron data fetching
  // This is a placeholder implementation
  return {
    price: 0,
    gasPrice: 0,
    supply: 0,
    latestBlock: 0
  };
};

const fetchTonData = async () => {
  // Implement TON data fetching
  // This is a placeholder implementation
  return {
    price: 0,
    gasPrice: 0,
    supply: 0,
    latestBlock: 0
  };
};

const OnChainActivity = () => {
  const [showChart, setShowChart] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');

  const { data, isLoading, error } = useQuery({
    queryKey: ['onChainData', selectedBlockchain],
    queryFn: () => fetchOnChainData(selectedBlockchain),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

  const gasChartData = [
    { name: 'Gas Price', value: parseFloat(data.gasPrice) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedBlockchain.charAt(0).toUpperCase() + selectedBlockchain.slice(1)} On-Chain Activity</h2>
        <BlockchainPicker
          selectedBlockchain={selectedBlockchain}
          onBlockchainChange={setSelectedBlockchain}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Price
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(data.price)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gas Price
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.gasPrice)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Supply
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.supply)}</div>
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
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-chart"
          checked={showChart}
          onCheckedChange={setShowChart}
        />
        <Label htmlFor="show-chart">
          {showChart ? "Hide Chart" : "Show Gas Price Chart"}
        </Label>
      </div>

      {showChart && (
        <Card>
          <CardHeader>
            <CardTitle>Gas Price Chart</CardTitle>
            <CardDescription>Gas price over time</CardDescription>
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
