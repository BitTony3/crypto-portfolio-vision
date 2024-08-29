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
    { id: 'bitcoin', amount: 1.5, location: 'Binance', type: 'Exchange' },
    { id: 'bitcoin', amount: 1.2, location: 'Coinbase', type: 'Exchange' },
    { id: 'bitcoin', amount: 0.8, location: 'Ledger Nano', type: 'Hardware Wallet' },
    { id: 'bitcoin', amount: 1.0, location: 'Kraken', type: 'Exchange' },
    { id: 'bitcoin', amount: 0.92, location: 'Bitcoin Network', type: 'Blockchain' },
    { id: 'ethereum', amount: 10.0, location: 'MetaMask', type: 'Software Wallet' },
    { id: 'ethereum', amount: 8.5, location: 'Kraken', type: 'Exchange' },
    { id: 'ethereum', amount: 7.2, location: 'Ethereum Mainnet', type: 'Blockchain' },
    { id: 'ethereum', amount: 5.0, location: 'Binance', type: 'Exchange' },
    { id: 'ethereum', amount: 3.5, location: 'Coinbase', type: 'Exchange' },
    { id: 'tether', amount: 150000, location: 'Bitfinex', type: 'Exchange' },
    { id: 'tether', amount: 100000, location: 'Tron Network', type: 'Blockchain' },
    { id: 'tether', amount: 80000, location: 'Huobi', type: 'Exchange' },
    { id: 'tether', amount: 70000, location: 'Binance', type: 'Exchange' },
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
    <div className="bg-dark-blue border-4 border-neon-blue p-4 overflow-x-auto shadow-[0_0_10px_#00FFFF]">
      <h2 className="text-4xl font-bold mb-4 text-neon-blue">Your Portfolio</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-4 border-neon-blue mb-4 min-w-[300px]">
          <thead>
            <tr className="bg-black text-neon-blue">
              <th className="p-2 border-2 border-neon-blue">Asset</th>
              <th className="p-2 border-2 border-neon-blue">Amount</th>
              <th className="p-2 border-2 border-neon-blue">Location</th>
              <th className="p-2 border-2 border-neon-blue">Type</th>
              <th className="p-2 border-2 border-neon-blue">Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data && data.data && portfolio.map((item, index) => {
              const asset = data.data.find(a => a.id === item.id);
              const value = asset ? item.amount * parseFloat(asset.priceUsd) : 0;
              return (
                <tr key={index} className="hover:bg-black text-off-white">
                  <td className="p-2 border-2 border-neon-blue">{asset ? asset.name : item.id}</td>
                  <td className="p-2 border-2 border-neon-blue">{item.amount.toFixed(4)}</td>
                  <td className="p-2 border-2 border-neon-blue">{item.location}</td>
                  <td className="p-2 border-2 border-neon-blue">{item.type}</td>
                  <td className="p-2 border-2 border-neon-blue">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-2xl font-bold break-words text-neon-blue">
        Total Portfolio Value: ${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Portfolio;
