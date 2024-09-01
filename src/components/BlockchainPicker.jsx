import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BlockchainPicker = ({ selectedBlockchain, onBlockchainChange, blockchains }) => {
  return (
    <Select value={selectedBlockchain} onValueChange={onBlockchainChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select blockchain">
          {({ value }) => {
            const selected = blockchains.find(b => b.id === value);
            return (
              <div className="flex items-center">
                {selected ? selected.name : "Select blockchain"}
              </div>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {blockchains.map((blockchain) => (
          <SelectItem key={blockchain.id} value={blockchain.id}>
            <div className="flex items-center">
              {blockchain.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BlockchainPicker;
