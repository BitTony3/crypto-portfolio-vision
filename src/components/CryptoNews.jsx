import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchCryptoNews = async () => {
  // Implement API call to fetch crypto news
  // For now, we'll return mock data
  return [
    { id: 1, title: 'Bitcoin Surges Past $50,000', source: 'CoinDesk' },
    { id: 2, title: 'Ethereum 2.0 Upgrade Set for Next Month', source: 'CryptoNews' },
    { id: 3, title: 'New DeFi Protocol Gains $1B TVL in 24 Hours', source: 'DeFi Pulse' },
  ];
};

const CryptoNews = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['cryptoNews'],
    queryFn: fetchCryptoNews,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      {news.map((item) => (
        <div key={item.id} className="p-2 bg-background/50 rounded">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.source}</p>
        </div>
      ))}
    </div>
  );
};

export default CryptoNews;