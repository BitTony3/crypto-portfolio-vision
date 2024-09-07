import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchAssetPrices = async (ids) => {
  const mockPrices = {
    bitcoin: 50000,
    ethereum: 3000,
    tether: 1,
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: ids.map(id => ({ id, priceUsd: mockPrices[id] })) }), 1000);
  });
};

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([
    { id: 'bitcoin', amount: 1.2, location: 'Binance', type: 'Exchange', purchasePrice: 30000, currentPrice: 0 },
    { id: 'bitcoin', amount: 0.8, location: 'OKX', type: 'Exchange', purchasePrice: 35000, currentPrice: 0 },
    { id: 'bitcoin', amount: 1.5, location: 'Trezor', type: 'Hardware Wallet', purchasePrice: 40000, currentPrice: 0 },
    { id: 'bitcoin', amount: 0.7, location: 'KuCoin', type: 'Exchange', purchasePrice: 45000, currentPrice: 0 },
    { id: 'bitcoin', amount: 1.22, location: 'Bitcoin Network', type: 'Blockchain', purchasePrice: 50000, currentPrice: 0 },
    { id: 'bitcoin', amount: 3.5, location: 'Binance', type: 'Exchange', purchasePrice: 55000, currentPrice: 0 },
    { id: 'ethereum', amount: 8.0, location: 'MetaMask', type: 'Software Wallet', purchasePrice: 2000, currentPrice: 0 },
    { id: 'ethereum', amount: 6.5, location: 'KuCoin', type: 'Exchange', purchasePrice: 2500, currentPrice: 0 },
    { id: 'ethereum', amount: 9.2, location: 'Ethereum Mainnet', type: 'Blockchain', purchasePrice: 3000, currentPrice: 0 },
    { id: 'ethereum', amount: 5.8, location: 'Binance', type: 'Exchange', purchasePrice: 3500, currentPrice: 0 },
    { id: 'ethereum', amount: 5.0, location: 'OKX', type: 'Exchange', purchasePrice: 4000, currentPrice: 0 },
    { id: 'ethereum', amount: 30.0, location: 'Binance', type: 'Exchange', purchasePrice: 4500, currentPrice: 0 },
    { id: 'tether', amount: 20000, location: 'Tron Network', type: 'Blockchain', purchasePrice: 1, currentPrice: 0 },
    { id: 'tether', amount: 40000, location: 'Gate.io', type: 'Exchange', purchasePrice: 1, currentPrice: 0 },
    { id: 'tether', amount: 57000, location: 'Binance', type: 'Exchange', purchasePrice: 1, currentPrice: 0 },
    { id: 'tether', amount: 40000, location: 'Trezor', type: 'Hardware Wallet', purchasePrice: 1, currentPrice: 0 },
    { id: 'tether', amount: 400000, location: 'Binance', type: 'Exchange', purchasePrice: 1, currentPrice: 0 },
  ]);

  const [showDetails, setShowDetails] = useState(false);

  const assetIds = [...new Set(portfolio.map(item => item.id))];

  const { data, isLoading, error } = useQuery({
    queryKey: ['assetPrices', assetIds],
    queryFn: () => fetchAssetPrices(assetIds),
  });

  const pieChartData = useMemo(() => {
    if (!data || !data.data) return [];
    const assetTotals = portfolio.reduce((totals, item) => {
      const asset = data.data.find(a => a.id === item.id);
      if (asset) {
        const value = item.amount * parseFloat(asset.priceUsd);
        totals[item.id] = (totals[item.id] || 0) + value;
      }
      return totals;
    }, {});
    return Object.entries(assetTotals).map(([id, value]) => ({
      name: id,
      value,
    }));
  }, [data, portfolio]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-sm font-bold text-red-600">Error: {error.message}</div>;

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

  const groupedPortfolio = portfolio.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = [];
    }
    acc[item.id].push(item);
    return acc;
  }, {});

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Portfolio</CardTitle>
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
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value (USD)</TableHead>
                  <TableHead>Cost Basis</TableHead>
                  <TableHead>Profit/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedPortfolio).map(([assetId, assets]) => (
                  <React.Fragment key={assetId}>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={7} className="font-bold">{assetId.toUpperCase()}</TableCell>
                    </TableRow>
                    {assets.map((item, index) => {
                      const asset = data.data.find(a => a.id === item.id);
                      const currentPrice = asset ? parseFloat(asset.priceUsd) : 0;
                      const value = item.amount * currentPrice;
                      const costBasis = item.amount * item.purchasePrice;
                      const profitLoss = value - costBasis;
                      const profitLossPercentage = ((value / costBasis) - 1) * 100;
                      return (
                        <TableRow key={`${assetId}-${index}`}>
                          <TableCell></TableCell>
                          <TableCell>{item.amount.toFixed(4)}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                          <TableCell>${costBasis.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                            ${profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            ({profitLossPercentage.toFixed(2)}%)
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Portfolio;