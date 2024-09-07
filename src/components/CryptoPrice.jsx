import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchCryptoPrice = async (id) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`);
  if (!response.ok) {
    throw new Error('Failed to fetch crypto price');
  }
  return response.json();
};

const CryptoPrice = ({ id, name, symbol }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoPrice', id],
    queryFn: () => fetchCryptoPrice(id),
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return (
    <Card className="h-full flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </Card>
  );
  if (error) return (
    <Card className="h-full flex items-center justify-center">
      <div className="text-xs text-red-600">Error: {error.message}</div>
    </Card>
  );

  const price = data[id].usd;
  const change24h = data[id].usd_24h_change;

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