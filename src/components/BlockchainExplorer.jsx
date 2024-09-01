import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from 'lucide-react';
import BlockchainPicker from './BlockchainPicker';
import Moralis from 'moralis';

const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjlkMzc0YTFlLTFjODYtNDcwNS1hYjI1LTgzYWIzYjBlZDAxOSIsIm9yZ0lkIjoiNDA2NjEyIiwidXNlcklkIjoiNDE3ODE2IiwidHlwZUlkIjoiNDkxN2I4YTMtYzBmNS00NjEzLWEzZDctZWUxNWE0MDViNTYxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjUxNTk1NjgsImV4cCI6NDg4MDkxOTU2OH0.QbulgqYN3g8wKOpU2V26Rp6sbMuuNoLuIjl2_NFrj7c';

Moralis.start({ apiKey: MORALIS_API_KEY });

const SUPPORTED_CHAINS = [
  { id: 'eth', name: 'Ethereum' },
  { id: 'bsc', name: 'Binance Smart Chain' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'avalanche', name: 'Avalanche' },
  { id: 'fantom', name: 'Fantom' },
  { id: 'cronos', name: 'Cronos' },
];

const fetchBlockchainData = async (chain, query) => {
  let result;
  if (query.startsWith('0x')) {
    // It's a transaction hash
    result = await Moralis.EvmApi.transaction.getTransaction({
      chain,
      transactionHash: query,
    });
  } else {
    // It's a block number
    result = await Moralis.EvmApi.block.getBlock({
      chain,
      blockNumberOrHash: query,
    });
  }
  return result.toJSON();
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

    if (data.hash) {
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
              <TableCell>{data.block_number}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>{data.from_address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>To</TableCell>
              <TableCell>{data.to_address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell>{data.value}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    } else {
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
              <TableCell>{data.number}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Block Hash</TableCell>
              <TableCell>{data.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>{new Date(data.timestamp * 1000).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transactions</TableCell>
              <TableCell>{data.transaction_count}</TableCell>
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
        <CardDescription>Explore blocks and transactions across multiple blockchains</CardDescription>
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
