import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const fetchMarketSentiment = async () => {
  // This is a mock API call. In a real scenario, you'd call an actual sentiment analysis API.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        overall: 'Bullish',
        bitcoin: 'Very Bullish',
        ethereum: 'Neutral',
        altcoins: 'Slightly Bearish',
      });
    }, 1000);
  });
};

const MarketSentiment = () => {
  const { data: sentiment, isLoading, error } = useQuery({
    queryKey: ['marketSentiment'],
    queryFn: fetchMarketSentiment,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(sentiment).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key}:</span>
              <span className={`font-bold ${
                value.includes('Bullish') ? 'text-green-500' :
                value.includes('Bearish') ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSentiment;