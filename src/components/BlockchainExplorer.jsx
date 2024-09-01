import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from 'lucide-react';
import BlockchainPicker from './BlockchainPicker';

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

const SUPPORTED_CHAINS = [
  { id: 'eth', name: 'Ethereum', apiUrl: 'https://api.etherscan.io/api' },
  // Add other supported chains here if they have similar APIs
];

const fetchBlockchainData = async (chain, query) => {
  const apiUrl = SUPPORTED_CHAINS.find(c => c.id === chain)?.apiUrl;
  if (!apiUrl) throw new Error('Unsupported blockchain');

  let endpoint;
  if (query.startsWith('0x')) {
    // It's a transaction hash
    endpoint = `${apiUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${query}&apikey=${ETHERSCAN_API_KEY}`;
  } else {
    // It's a block number
    endpoint = `${apiUrl}?module=proxy&action=eth_getBlockByNumber&tag=${parseInt(query).toString(16)}&boolean=true&apikey=${ETHERSCAN_API_KEY}`;
  }

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Failed to fetch data');
  const data = await response.json();
  return data.result;
};

const BlockchainExplorer = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState('eth');
  const [query, setQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['blockchainData', selectedBlockchain, query, searchTrigger],
    queryFn: () => fetchBlockchainData(selectedBlockchain, query),
    enabled: !!query && searchTrigger > 0,
  });

  const handleSearch = () => {
    if (query) {
      setSearchTrigger(prev => prev + 1);
    }
  };

  const renderBlockchainData = () => {
    if (!data) return null;

    if (data.hash && data.blockNumber) {
      // This is a transaction
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Transaction Hash</TableCell>
              <TableCell>{data.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Block Number</TableCell>
              <TableCell>{parseInt(data.blockNumber, 16)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>{data.from}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>To</TableCell>
              <TableCell>{data.to}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell>{parseInt(data.value, 16)} Wei</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    } else if (data.number) {
      // This is a block
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Block Number</TableCell>
              <TableCell>{parseInt(data.number, 16)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Block Hash</TableCell>
              <TableCell>{data.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>{new Date(parseInt(data.timestamp, 16) * 1000).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transactions</TableCell>
              <TableCell>{data.transactions.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Blockchain Explorer</CardTitle>
        <CardDescription>Explore blocks and transactions on Ethereum</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <BlockchainPicker
            selectedBlockchain={selectedBlockchain}
            onBlockchainChange={setSelectedBlockchain}
            blockchains={SUPPORTED_CHAINS}
          />
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter block number or tx hash"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {data && renderBlockchainData()}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainExplorer;
