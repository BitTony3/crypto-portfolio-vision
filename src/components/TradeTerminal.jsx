import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TradeTerminal = () => {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleTrade = (type) => {
    console.log(`${type} order: ${amount} at ${price}`);
    // Here you would typically send the order to your backend or exchange API
  };

  return (
    <div className="p-2 space-y-2">
      <h3 className="text-sm font-semibold">Trade Terminal</h3>
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="text-xs"
      />
      <Input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="text-xs"
      />
      <div className="flex space-x-2">
        <Button onClick={() => handleTrade('Buy')} className="flex-1 text-xs bg-green-500 hover:bg-green-600">Buy</Button>
        <Button onClick={() => handleTrade('Sell')} className="flex-1 text-xs bg-red-500 hover:bg-red-600">Sell</Button>
      </div>
    </div>
  );
};

export default TradeTerminal;