import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Activity, Cpu, Database, Zap } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import BlockchainPicker from './BlockchainPicker';

const API_KEYS = {
  ethereum: 'YourEtherscanAPIKey',
  solana: 'YourSolanaAPIKey',
  bitcoin: 'YourBitcoinAPIKey',
  tron: 'YourTronAPIKey',
  ton: 'YourTONAPIKey',
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

  try {
    const responses = await Promise.all(endpoints.map(url => fetch(url).then(res => res.json())));
    return {
      price: responses[0].result.ethusd,
      gasPrice: responses[1].result.ProposeGasPrice,
      supply: responses[2].result,
      latestBlock: parseInt(responses[3].result, 16)
    };
  } catch (error) {
    console.error('Error fetching Ethereum data:', error);
    throw error;
  }
};

const fetchSolanaData = async () => {
  try {
    const [priceResponse, supplyResponse, blockResponse] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'),
      fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getSupply",
          "params": [{"commitment": "finalized"}]
        })
      }),
      fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getBlockHeight"
        })
      })
    ]);

    const priceData = await priceResponse.json();
    const supplyData = await supplyResponse.json();
    const blockData = await blockResponse.json();

    return {
      price: priceData.solana.usd,
      gasPrice: 0, // Solana doesn't have gas prices
      supply: supplyData.result.value.total,
      latestBlock: blockData.result
    };
  } catch (error) {
    console.error('Error fetching Solana data:', error);
    throw error;
  }
};

const fetchBitcoinData = async () => {
  try {
    const [priceResponse, blockchainInfoResponse] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
      fetch('https://blockchain.info/q/getblockcount')
    ]);

    const priceData = await priceResponse.json();
    const latestBlock = await blockchainInfoResponse.text();

    return {
      price: priceData.bitcoin.usd,
      gasPrice: 0, // Bitcoin doesn't have gas prices
      supply: 21000000, // Fixed supply
      latestBlock: parseInt(latestBlock)
    };
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    throw error;
  }
};

const fetchTronData = async () => {
  try {
    const [priceResponse, nodeResponse] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd'),
      fetch('https://api.trongrid.io/wallet/getnowblock')
    ]);

    const priceData = await priceResponse.json();
    const nodeData = await nodeResponse.json();

    return {
      price: priceData.tron.usd,
      gasPrice: 0, // Tron uses bandwidth and energy instead of gas
      supply: 100000000000, // Total TRX supply
      latestBlock: nodeData.block_header.raw_data.number
    };
  } catch (error) {
    console.error('Error fetching Tron data:', error);
    throw error;
  }
};

const fetchTonData = async () => {
  try {
    const [priceResponse, tonResponse] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd'),
      fetch('https://toncenter.com/api/v2/getmasterchaininfo')
    ]);

    const priceData = await priceResponse.json();
    const tonData = await tonResponse.json();

    return {
      price: priceData['the-open-network'].usd,
      gasPrice: 0, // TON doesn't use gas in the same way as Ethereum
      supply: 5000000000, // Total TON supply
      latestBlock: tonData.result.last.seqno
    };
  } catch (error) {
    console.error('Error fetching TON data:', error);
    throw error;
  }
};

const OnChainActivity = () => {
  const [showChart, setShowChart] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [chartData, setChartData] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['onChainData', selectedBlockchain],
    queryFn: () => fetchOnChainData(selectedBlockchain),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (data) {
      setChartData(prevData => [
        ...prevData,
        { name: new Date().toLocaleTimeString(), value: parseFloat(data.gasPrice) || 0 }
      ].slice(-10)); // Keep only the last 10 data points
    }
  }, [data]);

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

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
              {selectedBlockchain === 'ethereum' ? 'Gas Price' : 'Network Fee'}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedBlockchain === 'ethereum' 
                ? `${formatNumber(data.gasPrice)} Gwei` 
                : selectedBlockchain === 'solana'
                ? 'Variable'
                : selectedBlockchain === 'bitcoin'
                ? 'Variable (sat/vB)'
                : selectedBlockchain === 'tron'
                ? 'Bandwidth/Energy'
                : 'Variable'}
            </div>
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
          {showChart ? "Hide Chart" : `Show ${selectedBlockchain === 'ethereum' ? 'Gas Price' : 'Network Fee'} Chart`}
        </Label>
      </div>

      {showChart && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedBlockchain === 'ethereum' ? 'Gas Price' : 'Network Fee'} Chart</CardTitle>
            <CardDescription>{selectedBlockchain === 'ethereum' ? 'Gas price' : 'Network fee'} over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
