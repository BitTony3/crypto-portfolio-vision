import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from 'lucide-react';
import BlockchainPicker from './BlockchainPicker';

const API_ENDPOINTS = {
  ethereum: 'https://api.etherscan.io/api',
  solana: 'https://api.solscan.io/block',
  bitcoin: 'https://blockchain.info',
  tron: 'https://api.trongrid.io',
  ton: 'https://toncenter.com/api/v2',
};

const API_KEYS = {
  ethereum: 'YOUR_ETHERSCAN_API_KEY',
  solana: 'YOUR_SOLSCAN_API_KEY',
  bitcoin: '', // No API key required for blockchain.info
  tron: 'YOUR_TRONGRID_API_KEY',
  ton: '', // No API key required for toncenter
};

const fetchBlockchainData = async (blockchain, query) => {
  let url;
  let params = new URLSearchParams();

  switch (blockchain) {
    case 'ethereum':
      params.append('module', 'proxy');
      params.append('action', query.startsWith('0x') ? 'eth_getTransactionByHash' : 'eth_getBlockByNumber');
      params.append('txhash', query);
      params.append('tag', 'latest');
      params.append('boolean', 'true');
      params.append('apikey', API_KEYS.ethereum);
      url = `${API_ENDPOINTS.ethereum}?${params.toString()}`;
      break;
    case 'solana':
      url = `${API_ENDPOINTS.solana}?block=${query}`;
      break;
    case 'bitcoin':
      url = `${API_ENDPOINTS.bitcoin}/rawblock/${query}`;
      break;
    case 'tron':
      url = `${API_ENDPOINTS.tron}/wallet/getblockbynum?num=${query}`;
      break;
    case 'ton':
      url = `${API_ENDPOINTS.ton}/getBlockHeader?workchain=-1&shard=-9223372036854775808&seqno=${query}`;
      break;
    default:
      throw new Error('Unsupported blockchain');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const BlockchainExplorer = () => {
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
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

    switch (selectedBlockchain) {
      case 'ethereum':
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
                <TableCell>{parseInt(data.result.number, 16)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>{new Date(parseInt(data.result.timestamp, 16) * 1000).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transactions</TableCell>
                <TableCell>{data.result.transactions.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case 'solana':
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
                <TableCell>{data.result.blocknumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>{new Date(data.result.blocktime * 1000).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transactions</TableCell>
                <TableCell>{data.result.txs.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case 'bitcoin':
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
                <TableCell>Block Hash</TableCell>
                <TableCell>{data.hash}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>{new Date(data.time * 1000).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transactions</TableCell>
                <TableCell>{data.tx.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case 'tron':
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
                <TableCell>{data.block_header.raw_data.number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>{new Date(data.block_header.raw_data.timestamp).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transactions</TableCell>
                <TableCell>{data.transactions ? data.transactions.length : 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      case 'ton':
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
                <TableCell>Workchain</TableCell>
                <TableCell>{data.result.workchain}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shard</TableCell>
                <TableCell>{data.result.shard}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Seqno</TableCell>
                <TableCell>{data.result.seqno}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      default:
        return <p>Unsupported blockchain</p>;
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
          />
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder={`Enter ${selectedBlockchain === 'ethereum' ? 'block number or tx hash' : 'block number'}`}
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