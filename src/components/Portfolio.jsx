import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

const portfolios = [
  {
    name: 'Bitcoin Portfolio',
    assets: [
      { id: 'bitcoin', amount: 1.2, location: 'Binance', type: 'Exchange', purchasePrice: 30000 },
      { id: 'bitcoin', amount: 0.8, location: 'OKX', type: 'Exchange', purchasePrice: 35000 },
      { id: 'bitcoin', amount: 1.5, location: 'Trezor', type: 'Hardware Wallet', purchasePrice: 40000 },
      { id: 'bitcoin', amount: 0.7, location: 'KuCoin', type: 'Exchange', purchasePrice: 45000 },
      { id: 'bitcoin', amount: 1.22, location: 'Bitcoin Network', type: 'Blockchain', purchasePrice: 50000 },
      { id: 'bitcoin', amount: 3.5, location: 'Binance', type: 'Exchange', purchasePrice: 55000 },
    ]
  },
  {
    name: 'Ethereum Portfolio',
    assets: [
      { id: 'ethereum', amount: 8.0, location: 'MetaMask', type: 'Software Wallet', purchasePrice: 2000 },
      { id: 'ethereum', amount: 6.5, location: 'KuCoin', type: 'Exchange', purchasePrice: 2500 },
      { id: 'ethereum', amount: 9.2, location: 'Ethereum Mainnet', type: 'Blockchain', purchasePrice: 3000 },
      { id: 'ethereum', amount: 5.8, location: 'Binance', type: 'Exchange', purchasePrice: 3500 },
      { id: 'ethereum', amount: 5.0, location: 'OKX', type: 'Exchange', purchasePrice: 4000 },
      { id: 'ethereum', amount: 30.0, location: 'Binance', type: 'Exchange', purchasePrice: 4500 },
    ]
  },
  {
    name: 'USDT Portfolio',
    assets: [
      { id: 'tether', amount: 20000, location: 'Tron Network', type: 'Blockchain', purchasePrice: 1 },
      { id: 'tether', amount: 65000, location: 'Gate.io', type: 'Exchange', purchasePrice: 1 },
      { id: 'tether', amount: 82000, location: 'Binance', type: 'Exchange', purchasePrice: 1 },
      { id: 'tether', amount: 40000, location: 'Trezor', type: 'Hardware Wallet', purchasePrice: 1 },
      { id: 'tether', amount: 50000, location: 'OKX', type: 'Exchange', purchasePrice: 1 },
      { id: 'tether', amount: 43000, location: 'KuCoin', type: 'Exchange', purchasePrice: 1 },
    ]
  }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState(portfolios[0].name);
  const assetIds = useMemo(() => [...new Set(portfolios.flatMap(p => p.assets.map(a => a.id)))], []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['assetPrices', assetIds],
    queryFn: () => fetchAssetPrices(assetIds),
  });

  const portfolioValues = useMemo(() => {
    if (!data || !data.data) return {};
    return portfolios.reduce((acc, portfolio) => {
      acc[portfolio.name] = portfolio.assets.reduce((total, item) => {
        const asset = data.data.find(a => a.id === item.id);
        return total + (asset ? item.amount * parseFloat(asset.priceUsd) : 0);
      }, 0);
      return acc;
    }, {});
  }, [data]);

  const totalValue = useMemo(() => 
    Object.values(portfolioValues).reduce((sum, value) => sum + value, 0),
  [portfolioValues]);

  const pieChartData = useMemo(() => 
    Object.entries(portfolioValues).map(([name, value]) => ({ name, value })),
  [portfolioValues]);

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
  if (error) return <div className="text-sm font-bold text-red-600">Error: {error.message}</div>;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Portfolio Overview</CardTitle>
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
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center items-center p-4">
            <div className="text-2xl font-bold text-primary mb-4">
              Total Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            {portfolios.map((portfolio) => (
              <TabsTrigger key={portfolio.name} value={portfolio.name} className="text-sm">
                {portfolio.name}
                <span className="ml-2 text-xs font-semibold">
                  ${portfolioValues[portfolio.name].toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {portfolios.map((portfolio) => (
            <TabsContent key={portfolio.name} value={portfolio.name}>
              <PortfolioTable portfolio={portfolio} data={data} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PortfolioTable = ({ portfolio, data }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Location</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Value (USD)</TableHead>
        <TableHead>Cost Basis</TableHead>
        <TableHead>Profit/Loss</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {portfolio.assets.map((item, assetIndex) => {
        const asset = data.data.find(a => a.id === item.id);
        const currentPrice = asset ? parseFloat(asset.priceUsd) : 0;
        const value = item.amount * currentPrice;
        const costBasis = item.amount * item.purchasePrice;
        const profitLoss = value - costBasis;
        const profitLossPercentage = ((value / costBasis) - 1) * 100;
        return (
          <TableRow key={assetIndex}>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.amount.toFixed(4)}</TableCell>
            <TableCell>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
            <TableCell>${costBasis.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
            <TableCell className={cn(
              "font-medium",
              profitLoss >= 0 ? "text-green-600" : "text-red-600"
            )}>
              ${profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              <span className="ml-1 text-xs">
                ({profitLossPercentage.toFixed(2)}%)
              </span>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

export default Portfolio;