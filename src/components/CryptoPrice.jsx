import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CryptoPrice = ({ id, name, symbol }) => {
  const [price, setPrice] = useState(null);
  const [change24h, setChange24h] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.c));
      setChange24h(parseFloat(data.p));
    };

    return () => ws.close();
  }, [symbol]);

  if (price === null) return (
    <Card className="h-full flex items-center justify-center">
      <div className="text-xs">Loading...</div>
    </Card>
  );

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{name} ({symbol})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div className={`flex items-center ${change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span>{Math.abs(change24h).toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoPrice;