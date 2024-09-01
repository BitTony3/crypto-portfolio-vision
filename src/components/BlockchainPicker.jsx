import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const blockchains = [
  { value: 'ethereum', label: 'Ethereum', logo: '/ethereum-logo.svg' },
  { value: 'solana', label: 'Solana', logo: '/solana-logo.svg' },
  { value: 'bitcoin', label: 'Bitcoin', logo: '/bitcoin-logo.svg' },
  { value: 'tron', label: 'Tron', logo: '/tron-logo.svg' },
  { value: 'ton', label: 'TON', logo: '/ton-logo.svg' },
];

const BlockchainPicker = ({ selectedBlockchain, onBlockchainChange }) => {
  return (
    <Select value={selectedBlockchain} onValueChange={onBlockchainChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select blockchain" />
      </SelectTrigger>
      <SelectContent>
        {blockchains.map((blockchain) => (
          <SelectItem key={blockchain.value} value={blockchain.value}>
            <div className="flex items-center">
              <img src={blockchain.logo} alt={`${blockchain.label} logo`} className="w-5 h-5 mr-2" />
              {blockchain.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BlockchainPicker;