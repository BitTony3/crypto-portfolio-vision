import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const initialPortfolios = [
  {
    name: 'Bitcoin Portfolio',
    initialAmount: 5,
    currentPrice: 50000,
    assets: [
      { id: 'bitcoin', amount: 1.2, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.8, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.5, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'bitcoin', amount: 0.7, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.26, location: 'Bitcoin Network', type: 'Blockchain' },
    ]
  },
  {
    name: 'Ethereum Portfolio',
    initialAmount: 30,
    currentPrice: 3000,
    assets: [
      { id: 'ethereum', amount: 7.2, location: 'MetaMask', type: 'Software Wallet' },
      { id: 'ethereum', amount: 5.8, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 8.3, location: 'Ethereum Mainnet', type: 'Blockchain' },
      { id: 'ethereum', amount: 5.2, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 7.6, location: 'OKX', type: 'Exchange' },
    ]
  },
  {
    name: 'USDT Portfolio',
    initialAmount: 600000,
    currentPrice: 1,
    assets: [
      { id: 'tether', amount: 150000, location: 'Tron Network', type: 'Blockchain' },
      { id: 'tether', amount: 100000, location: 'Ethereum Network', type: 'Blockchain' },
      { id: 'tether', amount: 80000, location: 'Binance Smart Chain', type: 'Blockchain' },
      { id: 'tether', amount: 75680, location: 'Binance', type: 'Exchange' },
      { id: 'tether', amount: 60000, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.5, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.34, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 4, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 3, location: 'KuCoin', type: 'Exchange' },
    ]
  }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#C7F464', '#FF8C94', '#91A6FF'];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState(initialPortfolios[0].name);

  const portfolioValues = useMemo(() => {
    return initialPortfolios.reduce((acc, portfolio) => {
      acc[portfolio.name] = portfolio.assets.reduce((total, item) => {
        return total + (item.amount * portfolio.currentPrice);
      }, 0);
      return acc;
    }, {});
  }, []);

  const totalValue = useMemo(() => 
    Object.values(portfolioValues).reduce((sum, value) => sum + value, 0),
  [portfolioValues]);

  const pieChartData = useMemo(() => 
    Object.entries(portfolioValues).map(([name, value]) => ({ name, value })),
  [portfolioValues]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow flex flex-col md:flex-row mb-4">
          <div className="md:w-1/2 h-64 md:h-auto mb-4 md:mb-0">
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
            <div className="text-3xl font-bold text-primary mb-4">
              Total Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {initialPortfolios.map((portfolio) => (
              <TabsTrigger key={portfolio.name} value={portfolio.name} className="text-sm">
                {portfolio.name}
                <span className="ml-2 text-xs font-semibold">
                  ${portfolioValues[portfolio.name]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {initialPortfolios.map((portfolio) => (
            <TabsContent key={portfolio.name} value={portfolio.name}>
              <PortfolioTable portfolio={portfolio} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PortfolioTable = ({ portfolio }) => {
  const totalAmount = portfolio.assets.reduce((sum, asset) => sum + (asset.id === portfolio.assets[0].id ? asset.amount : 0), 0);
  const totalValue = portfolio.assets.reduce((sum, asset) => sum + asset.amount * portfolio.currentPrice, 0);
  const profit = totalAmount - portfolio.initialAmount;
  const profitPercentage = ((totalAmount / portfolio.initialAmount) - 1) * 100;

  const getCurrencySymbol = (id) => {
    switch (id) {
      case 'bitcoin': return 'BTC';
      case 'ethereum': return 'ETH';
      case 'tether': return 'USDT';
      default: return '';
    }
  };

  const currencySymbol = getCurrencySymbol(portfolio.assets[0].id);

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border">
      <div className="p-4">
        <div className="mb-4">
          <p className="text-lg font-bold">
            Overall Balance: {totalAmount.toFixed(4)} {currencySymbol}
          </p>
          <p className={cn(
            "text-lg",
            profit >= 0 ? "text-green-500" : "text-red-500"
          )}>
            Profit: {profit.toFixed(4)} {currencySymbol} ({profitPercentage.toFixed(2)}%)
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="font-bold text-primary">Amount</TableHead>
              <TableHead>Value ({currencySymbol})</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.assets.map((item, assetIndex) => {
              const value = item.amount;
              return (
                <TableRow key={assetIndex}>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className={cn(
                    "font-mono text-sm",
                    item.id === 'bitcoin' && "text-orange-500 font-bold",
                    item.id === 'ethereum' && "text-blue-500 font-bold",
                    item.id === 'tether' && "text-green-500 font-bold"
                  )}>
                    {item.amount.toFixed(4)} {getCurrencySymbol(item.id)}
                  </TableCell>
                  <TableCell>{value.toFixed(4)} {currencySymbol}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default Portfolio;