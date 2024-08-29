import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchAssetPrices = async (ids) => {
  const response = await fetch(`https://api.coincap.io/v2/assets?ids=${ids.join(',')}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState({
    btc: 5.44,
    eth: 34.2,
    usdt: 400000,
  });

  const [tradedAmount, setTradedAmount] = useState(280000);

  const { data, isLoading, error } = useQuery({
    queryKey: ['assetPrices', Object.keys(portfolio)],
    queryFn: () => fetchAssetPrices(Object.keys(portfolio)),
  });

  useEffect(() => {
    if (data && data.data) {
      const btcAsset = data.data.find(asset => asset.symbol === 'BTC');
      const ethAsset = data.data.find(asset => asset.symbol === 'ETH');
      
      if (btcAsset && ethAsset) {
        const btcPrice = parseFloat(btcAsset.priceUsd);
        const ethPrice = parseFloat(ethAsset.priceUsd);
        const totalTradableUsd = tradedAmount;
        const btcAllocation = Math.random();
        const ethAllocation = 1 - btcAllocation;

        const tradedBtc = (totalTradableUsd * btcAllocation) / btcPrice;
        const tradedEth = (totalTradableUsd * ethAllocation) / ethPrice;

        setPortfolio(prev => ({
          ...prev,
          btc: prev.btc + tradedBtc,
          eth: prev.eth + tradedEth,
          usdt: prev.usdt - tradedAmount,
        }));
      }
    }
  }, [data, tradedAmount]);

  if (isLoading) return <div className="text-2xl font-bold">Loading portfolio...</div>;
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  const calculateTotalValue = () => {
    if (!data || !data.data) return 0;
    return data.data.reduce((total, asset) => {
      const amount = portfolio[asset.symbol.toLowerCase()] || 0;
      return total + amount * parseFloat(asset.priceUsd);
    }, 0);
  };

  return (
    <div className="bg-white border-4 border-black p-4">
      <h2 className="text-4xl font-bold mb-4">Your Portfolio</h2>
      <table className="w-full border-collapse border-4 border-black mb-4">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 border-2 border-white">Asset</th>
            <th className="p-2 border-2 border-white">Amount</th>
            <th className="p-2 border-2 border-white">Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {data && data.data && data.data.map((asset) => {
            const amount = portfolio[asset.symbol.toLowerCase()] || 0;
            const value = amount * parseFloat(asset.priceUsd);
            return (
              <tr key={asset.id} className="hover:bg-yellow-100">
                <td className="p-2 border-2 border-black">{asset.name}</td>
                <td className="p-2 border-2 border-black">{amount.toFixed(4)}</td>
                <td className="p-2 border-2 border-black">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-2xl font-bold">
        Total Portfolio Value: ${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default Portfolio;
