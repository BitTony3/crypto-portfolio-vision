import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchTopAssets = async () => {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=50');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TopCryptoAssets = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['topAssets'],
    queryFn: fetchTopAssets,
  });

  if (isLoading) return <div className="text-2xl font-bold">Loading...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  return (
    <div className="bg-white border-4 border-black p-4">
      <h2 className="text-4xl font-bold mb-4">Top 50 Crypto Assets</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-4 border-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 border-2 border-white">Rank</th>
              <th className="p-2 border-2 border-white">Name</th>
              <th className="p-2 border-2 border-white">Price (USD)</th>
              <th className="p-2 border-2 border-white">Market Cap (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((asset) => (
              <tr key={asset.id} className="hover:bg-yellow-100">
                <td className="p-2 border-2 border-black">{asset.rank}</td>
                <td className="p-2 border-2 border-black">{asset.name}</td>
                <td className="p-2 border-2 border-black">${parseFloat(asset.priceUsd).toFixed(2)}</td>
                <td className="p-2 border-2 border-black">${parseFloat(asset.marketCapUsd).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCryptoAssets;