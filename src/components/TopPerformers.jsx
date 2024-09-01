import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const fetchTopPerformers = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=1h,24h,7d');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const TopPerformers = () => {
  const [showGainers, setShowGainers] = useState(true);
  const [showPriceChange, setShowPriceChange] = useState('24h');
  const [viewMode, setViewMode] = useState('list');

  const { data, isLoading, error } = useQuery({
    queryKey: ['topPerformers'],
    queryFn: fetchTopPerformers,
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const sortedData = data.sort((a, b) => {
    const aChange = a[`price_change_percentage_${showPriceChange}`];
    const bChange = b[`price_change_percentage_${showPriceChange}`];
    return showGainers ? bChange - aChange : aChange - bChange;
  }).slice(0, 10);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const renderList = () => (
    <div className="space-y-2">
      {sortedData.map((asset) => (
        <div key={asset.id} className="flex justify-between items-center">
          <span className="font-medium">{asset.symbol.toUpperCase()}</span>
          <div className="text-right">
            <span className="font-bold">{formatPrice(asset.current_price)}</span>
            <span className={`ml-2 ${asset[`price_change_percentage_${showPriceChange}`] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {asset[`price_change_percentage_${showPriceChange}`].toFixed(2)}%
              {asset[`price_change_percentage_${showPriceChange}`] >= 0 ? <TrendingUp className="inline ml-1" size={16} /> : <TrendingDown className="inline ml-1" size={16} />}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData}>
        <XAxis dataKey="symbol" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={`price_change_percentage_${showPriceChange}`} fill={(entry) => entry[`price_change_percentage_${showPriceChange}`] >= 0 ? '#10B981' : '#EF4444'} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-gainers"
            checked={showGainers}
            onCheckedChange={setShowGainers}
          />
          <Label htmlFor="show-gainers">
            {showGainers ? "Top Gainers" : "Top Losers"}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label>Time Frame:</Label>
          <select
            value={showPriceChange}
            onChange={(e) => setShowPriceChange(e.target.value)}
            className="bg-background border border-input rounded px-2 py-1"
          >
            <option value="1h">1h</option>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="view-mode"
            checked={viewMode === 'chart'}
            onCheckedChange={(checked) => setViewMode(checked ? 'chart' : 'list')}
          />
          <Label htmlFor="view-mode">
            {viewMode === 'list' ? <BarChart3 size={16} /> : <DollarSign size={16} />}
          </Label>
        </div>
      </div>
      {viewMode === 'list' ? renderList() : renderChart()}
    </div>
  );
};

export default TopPerformers;
