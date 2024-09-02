import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRouter } from '../lib/apiRouter';

const fetchPortfolioData = async () => {
  // In a real application, this would fetch data from your backend
  // For now, we'll use the CoinGecko API to get some real crypto data
  const response = await apiRouter('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
  return response.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    amount: Math.random() * 10, // Simulating random holdings
    currentPrice: coin.current_price,
    value: 0, // Will be calculated
    priceChangePercentage24h: coin.price_change_percentage_24h,
  }));
};

const Portfolio = () => {
  const [showDetails, setShowDetails] = useState(false);

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolioData,
  });

  if (isLoading) return (
    <Card className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </Card>
  );

  if (error) return (
    <Card className="h-full flex items-center justify-center">
      <div className="text-red-500">Error loading portfolio: {error.message}</div>
    </Card>
  );

  const calculateTotalValue = () => {
    return portfolio.reduce((total, asset) => total + asset.amount * asset.currentPrice, 0);
  };

  const pieChartData = portfolio.map(asset => ({
    name: asset.symbol,
    value: asset.amount * asset.currentPrice,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64 md:h-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center items-center p-4">
            <div className="text-2xl font-bold text-primary mb-4">
              Total Value: ${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <Button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>
        {showDetails && (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price (USD)</TableHead>
                  <TableHead>Value (USD)</TableHead>
                  <TableHead>24h Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.map((asset) => {
                  const value = asset.amount * asset.currentPrice;
                  return (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name} ({asset.symbol})</TableCell>
                      <TableCell>{asset.amount.toFixed(4)}</TableCell>
                      <TableCell>${asset.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className={asset.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {asset.priceChangePercentage24h.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Portfolio;