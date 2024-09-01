import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchNFTData = async () => {
  // Implement API call to fetch NFT marketplace data
  // For now, we'll return mock data
  return [
    { id: 1, name: 'Bored Ape #1234', price: 100, currency: 'ETH' },
    { id: 2, name: 'CryptoPunk #5678', price: 80, currency: 'ETH' },
    { id: 3, name: 'Azuki #9101', price: 20, currency: 'ETH' },
  ];
};

const NFTMarketplace = () => {
  const { data: nftData, isLoading, error } = useQuery({
    queryKey: ['nftData'],
    queryFn: fetchNFTData,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      {nftData.map((nft) => (
        <div key={nft.id} className="flex justify-between items-center">
          <span>{nft.name}</span>
          <span className="font-semibold">{nft.price} {nft.currency}</span>
        </div>
      ))}
    </div>
  );
};

export default NFTMarketplace;