import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchAssetPrices = async (ids) => {
  const response = await fetch(`https://api.coincap.io/v2/assets?ids=${ids.join(',')}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([
    { id: 'bitcoin', amount: 0.1, location: 'Binance', type: 'Exchange' },
    { id: 'bitcoin', amount: 0.2, location: 'Coinbase', type: 'Exchange' },
    { id: 'bitcoin', amount: 0.2, location: 'Ledger Nano', type: 'Hardware Wallet' },
    { id: 'ethereum', amount: 1.5, location: 'MetaMask', type: 'Software Wallet' },
    { id: 'ethereum', amount: 1.2, location: 'Kraken', type: 'Exchange' },
    { id: 'ethereum', amount: 1.5, location: 'Ethereum Mainnet', type: 'Blockchain' },
    { id: 'tether', amount: 500, location: 'Bitfinex', type: 'Exchange' },
    { id: 'tether', amount: 300, location: 'Tron Network', type: 'Blockchain' },
    { id: 'tether', amount: 200, location: 'Huobi', type: 'Exchange' },
    { id: 'cardano', amount: 1000, location: 'Daedalus Wallet', type: 'Software Wallet' },
  ]);

  const assetIds = [...new Set(portfolio.map(item => item.id))];

  const { data, isLoading, error } = useQuery({
    queryKey: ['assetPrices', assetIds],
    queryFn: () => fetchAssetPrices(assetIds),
  });

  if (isLoading) return <div className="text-2xl font-bold">Loading portfolio...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  const calculateTotalValue = () => {
    if (!data || !data.data) return 0;
    return portfolio.reduce((total, item) => {
      const asset = data.data.find(a => a.id === item.id);
      if (asset) {
        return total + item.amount * parseFloat(asset.priceUsd);
      }
      return total;
    }, 0);
  };

  return (
    <div className="bg-white border-4 border-black p-4 overflow-x-auto">
      <h2 className="text-4xl font-bold mb-4">Your Portfolio</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-4 border-black mb-4 min-w-[300px]">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 border-2 border-white">Asset</th>
              <th className="p-2 border-2 border-white">Amount</th>
              <th className="p-2 border-2 border-white">Location</th>
              <th className="p-2 border-2 border-white">Type</th>
              <th className="p-2 border-2 border-white">Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data && data.data && portfolio.map((item, index) => {
              const asset = data.data.find(a => a.id === item.id);
              const value = asset ? item.amount * parseFloat(asset.priceUsd) : 0;
              return (
                <tr key={index} className="hover:bg-yellow-100">
                  <td className="p-2 border-2 border-black">{asset ? asset.name : item.id}</td>
                  <td className="p-2 border-2 border-black">{item.amount.toFixed(4)}</td>
                  <td className="p-2 border-2 border-black">{item.location}</td>
                  <td className="p-2 border-2 border-black">{item.type}</td>
                  <td className="p-2 border-2 border-black">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-2xl font-bold break-words">
        Total Portfolio Value: ${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Portfolio;
