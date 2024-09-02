import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const fetchCryptoPrices = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,cardano,dogecoin&vs_currencies=usd');
  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices');
  }
  return response.json();
};

const CryptoConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('bitcoin');
  const [toCrypto, setToCrypto] = useState('ethereum');

  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000, // Refetch every minute
  });

  const convert = () => {
    if (!prices) return 0;
    const fromPrice = prices[fromCrypto].usd;
    const toPrice = prices[toCrypto].usd;
    return ((parseFloat(amount) * fromPrice) / toPrice).toFixed(8);
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <Select value={fromCrypto} onValueChange={setFromCrypto}>
            <SelectTrigger>
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(prices).map((crypto) => (
                <SelectItem key={crypto} value={crypto}>
                  {crypto.charAt(0).toUpperCase() + crypto.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={toCrypto} onValueChange={setToCrypto}>
            <SelectTrigger>
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(prices).map((crypto) => (
                <SelectItem key={crypto} value={crypto}>
                  {crypto.charAt(0).toUpperCase() + crypto.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-lg font-bold">
            Result: {convert()} {toCrypto}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoConverter;