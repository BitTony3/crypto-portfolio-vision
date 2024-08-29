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
    { id: 'bitcoin', amount: 1.2, location: 'OKX', type: 'Exchange' },
    { id: 'bitcoin', amount: 0.8, location: 'Ledger Nano', type: 'Hardware Wallet' },
    { id: 'bitcoin', amount: 1.0, location: 'KuCoin', type: 'Exchange' },
    { id: 'bitcoin', amount: 0.92, location: 'Bitcoin Network', type: 'Blockchain' },
    { id: 'ethereum', amount: 10.0, location: 'MetaMask', type: 'Software Wallet' },
    { id: 'ethereum', amount: 8.5, location: 'KuCoin', type: 'Exchange' },
    { id: 'ethereum', amount: 7.2, location: 'Ethereum Mainnet', type: 'Blockchain' },
    { id: 'ethereum', amount: 5.0, location: 'Binance', type: 'Exchange' },
    { id: 'ethereum', amount: 3.5, location: 'OKX', type: 'Exchange' },
    { id: 'tether', amount: 150000, location: 'Bybit', type: 'Exchange' },
    { id: 'tether', amount: 100000, location: 'Tron Network', type: 'Blockchain' },
    { id: 'tether', amount: 80000, location: 'Gate.io', type: 'Exchange' },
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
    <div className="bg-secondary border-4 border-primary p-4 overflow-x-auto shadow-lg rounded-lg h-full">
      <h2 className="text-4xl font-bold mb-4 text-primary">Your Portfolio</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-4 border-primary mb-4 min-w-[300px]">
          <thead>
            <tr className="bg-primary text-secondary">
              <th className="p-2 border-2 border-secondary">Asset</th>
              <th className="p-2 border-2 border-secondary">Amount</th>
              <th className="p-2 border-2 border-secondary">Location</th>
              <th className="p-2 border-2 border-secondary">Type</th>
              <th className="p-2 border-2 border-secondary">Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {data && data.data && portfolio.map((item, index) => {
              const asset = data.data.find(a => a.id === item.id);
              const value = asset ? item.amount * parseFloat(asset.priceUsd) : 0;
              return (
                <tr key={index} className="hover:bg-background text-text">
                  <td className="p-2 border-2 border-primary">{asset ? asset.name : item.id}</td>
                  <td className="p-2 border-2 border-primary">{item.amount.toFixed(4)}</td>
                  <td className="p-2 border-2 border-primary">{item.location}</td>
                  <td className="p-2 border-2 border-primary">{item.type}</td>
                  <td className="p-2 border-2 border-primary">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-2xl font-bold break-words text-primary">
        Total Portfolio Value: ${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Portfolio;
