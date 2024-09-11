import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#C7F464', '#FF8C94', '#91A6FF'];

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
      { id: 'ethereum', amount: 8.3, location: 'Base Mainnet', type: 'Blockchain' },
      { id: 'ethereum', amount: 5.2, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 7.6, location: 'OKX', type: 'Exchange' },
    ]
  },
  {
    name: 'USDT Portfolio',
    initialAmount: 620000,
    currentPrice: 1,
    assets: [
      { id: 'tether', amount: 97466, location: 'Tron Network', type: 'Blockchain' },
      { id: 'tether', amount: 67555, location: 'Ethereum Network', type: 'Blockchain' },
      { id: 'tether', amount: 80000, location: 'Binance Smart Chain', type: 'Blockchain' },
      { id: 'tether', amount: 75680, location: 'Binance', type: 'Exchange' },
      { id: 'tether', amount: 60000, location: 'KuCoin', type: 'Exchange' },
      { id: 'tether', amount: 42000, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.5, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.34, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.66, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.5, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'ethereum', amount: 4, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 3, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 7, location: 'MetaMask', type: 'Software Wallet' },
      { id: 'ethereum', amount: 6, location: 'Base Mainnet', type: 'Blockchain' },
    ]
  }
];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState(initialPortfolios[0].name);
  const portfolioValues = useMemo(() => calculatePortfolioValues(initialPortfolios), []);
  const totalValue = useMemo(() => Object.values(portfolioValues).reduce((sum, value) => sum + value, 0), [portfolioValues]);
  const pieChartData = useMemo(() => Object.entries(portfolioValues).map(([name, value]) => ({ name, value })), [portfolioValues]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <PortfolioChart pieChartData={pieChartData} totalValue={totalValue} />
        <PortfolioTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          portfolios={initialPortfolios}
          portfolioValues={portfolioValues}
        />
      </CardContent>
    </Card>
  );
};

const PortfolioChart = ({ pieChartData, totalValue }) => (
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
);

const PortfolioTabs = ({ activeTab, setActiveTab, portfolios, portfolioValues }) => (
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <TabsList className="grid w-full grid-cols-3">
      {portfolios.map((portfolio) => (
        <TabsTrigger 
          key={portfolio.name} 
          value={portfolio.name} 
          className="text-xs sm:text-sm md:text-base truncate"
        >
          <span className="truncate">
            {portfolio.name.split(' ')[0]}
          </span>
          <span className="hidden sm:inline ml-1 text-xs font-semibold truncate">
            {formatValue(portfolioValues[portfolio.name], portfolio.name)}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
    {portfolios.map((portfolio) => (
      <TabsContent key={portfolio.name} value={portfolio.name}>
        <PortfolioTable portfolio={portfolio} />
      </TabsContent>
    ))}
  </Tabs>
);

const PortfolioTable = ({ portfolio }) => {
  const assetTotals = calculateAssetTotals(portfolio.assets);
  const totalValue = calculateTotalValue(assetTotals, portfolio);
  const totalProfit = calculateProfit(totalValue, portfolio);

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border">
      <div className="p-4">
        <div className="mb-4">
          <p className="text-lg font-bold">
            Overall Balance: {formatBalance(totalValue, portfolio.name)}
          </p>
          <p className="text-md">
            Total Profit: {formatProfit(totalProfit, portfolio.name)}
          </p>
          {portfolio.name === 'USDT Portfolio' && (
            <>
              <p>USDT Balance: {assetTotals.tether.toFixed(2)} USDT</p>
              <p>BTC Balance: {assetTotals.bitcoin.toFixed(4)} BTC</p>
              <p>ETH Balance: {assetTotals.ethereum.toFixed(4)} ETH</p>
            </>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.assets.map((item, assetIndex) => (
              <TableRow key={assetIndex}>
                <TableCell>{getCurrencySymbol(item.id)}</TableCell>
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
                <TableCell>{formatAssetValue(item, portfolio.name)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

const calculatePortfolioValues = (portfolios) => {
  return portfolios.reduce((acc, portfolio) => {
    acc[portfolio.name] = portfolio.assets.reduce((total, item) => total + getAssetValue(item, portfolio), 0);
    return acc;
  }, {});
};

const calculateAssetTotals = (assets) => {
  return assets.reduce((totals, asset) => {
    totals[asset.id] = (totals[asset.id] || 0) + asset.amount;
    return totals;
  }, {});
};

const calculateTotalValue = (assetTotals, portfolio) => {
  if (portfolio.name === 'USDT Portfolio') {
    return assetTotals.tether + (assetTotals.bitcoin * 50000) + (assetTotals.ethereum * 3000);
  }
  return Object.entries(assetTotals).reduce((total, [id, amount]) => {
    return total + getAssetValue({ id, amount }, portfolio);
  }, 0);
};

const calculateProfit = (totalValue, portfolio) => {
  switch (portfolio.name) {
    case 'Bitcoin Portfolio':
      return totalValue - 5;
    case 'Ethereum Portfolio':
      return totalValue - 30;
    case 'USDT Portfolio':
      return totalValue - 620000;
    default:
      return 0;
  }
};

const getCurrencySymbol = (id) => {
  switch (id) {
    case 'bitcoin': return 'BTC';
    case 'ethereum': return 'ETH';
    case 'tether': return 'USDT';
    default: return '';
  }
};

const getAssetValue = (asset, portfolio) => {
  switch (asset.id) {
    case 'bitcoin': return asset.amount * portfolio.currentPrice;
    case 'ethereum': return asset.amount * portfolio.currentPrice;
    case 'tether': return asset.amount;
    default: return 0;
  }
};

const formatValue = (value, portfolioName) => {
  switch (portfolioName) {
    case 'Bitcoin Portfolio':
      return `${(value / 50000).toFixed(4)} BTC`;
    case 'Ethereum Portfolio':
      return `${(value / 3000).toFixed(4)} ETH`;
    default:
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
};

const formatBalance = (value, portfolioName) => {
  switch (portfolioName) {
    case 'Bitcoin Portfolio':
      return `${(value / 50000).toFixed(4)} BTC`;
    case 'Ethereum Portfolio':
      return `${(value / 3000).toFixed(4)} ETH`;
    default:
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
};

const formatProfit = (profit, portfolioName) => {
  switch (portfolioName) {
    case 'Bitcoin Portfolio':
      return `${(profit / 50000).toFixed(4)} BTC`;
    case 'Ethereum Portfolio':
      return `${(profit / 3000).toFixed(4)} ETH`;
    default:
      return `$${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
};

const formatAssetValue = (asset, portfolioName) => {
  const value = getAssetValue(asset, { currentPrice: portfolioName === 'Bitcoin Portfolio' ? 50000 : 3000 });
  switch (portfolioName) {
    case 'Bitcoin Portfolio':
      return `${value.toFixed(4)} BTC`;
    case 'Ethereum Portfolio':
      return `${value.toFixed(4)} ETH`;
    default:
      return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
};

export default Portfolio;