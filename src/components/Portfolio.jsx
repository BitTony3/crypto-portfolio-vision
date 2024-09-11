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
      { id: 'bitcoin', amount: 1.25481, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.83654, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.56852, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'bitcoin', amount: 0.73198, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.31755, location: 'Bitcoin Network', type: 'Blockchain' },
    ]
  },
  {
    name: 'Ethereum Portfolio',
    initialAmount: 30,
    currentPrice: 3000,
    assets: [
      { id: 'ethereum', amount: 7.52888, location: 'MetaMask', type: 'Software Wallet' },
      { id: 'ethereum', amount: 6.06494, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 8.67913, location: 'Base Mainnet', type: 'Blockchain' },
      { id: 'ethereum', amount: 5.43753, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 7.94716, location: 'OKX', type: 'Exchange' },
    ]
  },
  {
    name: 'USDT Portfolio',
    initialAmount: 600000,
    currentPrice: 1,
    assets: [
      { id: 'tether', amount: 101918.2518, location: 'Tron Network', type: 'Blockchain' },
      { id: 'tether', amount: 70640.8026, location: 'Ethereum Network', type: 'Blockchain' },
      { id: 'tether', amount: 618.1350, location: 'Binance Smart Chain', type: 'Blockchain' },
      { id: 'tether', amount: 79136.9394, location: 'Binance', type: 'Exchange' },
      { id: 'tether', amount: 62740.7025, location: 'KuCoin', type: 'Exchange' },
      { id: 'tether', amount: 43918.4918, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.56852, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.40121, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.69015, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.52284, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'ethereum', amount: 11.18271, location: 'Binance', type: 'Exchange' }, // Updated: Added 7 ETH
      { id: 'ethereum', amount: 3.13704, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 7.31975, location: 'MetaMask', type: 'Software Wallet' },
      { id: 'ethereum', amount: 6.27407, location: 'Base Mainnet', type: 'Blockchain' },
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
        <div className="text-xl font-semibold">Total Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
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
              <TableHead>Amount</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.assets.map((item, assetIndex) => (
              <TableRow key={assetIndex}>
                <TableCell>{getCurrencySymbol(item.id)}</TableCell>
                <TableCell className={cn(
                  "font-mono text-sm",
                  item.id === 'bitcoin' && "text-orange-500 font-bold",
                  item.id === 'ethereum' && "text-blue-500 font-bold",
                  item.id === 'tether' && "text-green-500 font-bold"
                )}>
                  {item.amount.toFixed(4)} {getCurrencySymbol(item.id)}
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.type}</TableCell>
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

const calculateProfit = (totalValue, portfolio) => totalValue - portfolio.initialAmount * portfolio.currentPrice;

const getCurrencySymbol = (id) => ({ bitcoin: 'BTC', ethereum: 'ETH', tether: 'USDT' }[id] || '');

const getAssetValue = (asset, portfolio) => {
  const prices = { bitcoin: 50000, ethereum: 3000, tether: 1 };
  return asset.amount * prices[asset.id];
};

const formatValue = (value, portfolioName) => {
  const formatters = {
    'Bitcoin Portfolio': (v) => `${(v / 50000).toFixed(4)} BTC`,
    'Ethereum Portfolio': (v) => `${(v / 3000).toFixed(4)} ETH`,
    'USDT Portfolio': (v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
  };
  return formatters[portfolioName](value);
};

const formatBalance = formatValue;

const formatProfit = (profit, portfolioName) => {
  const formatters = {
    'Bitcoin Portfolio': (p) => `${(p / 50000).toFixed(4)} BTC`,
    'Ethereum Portfolio': (p) => `${(p / 3000).toFixed(4)} ETH`,
    'USDT Portfolio': (p) => `$${p.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
  };
  return formatters[portfolioName](profit);
};

const formatAssetValue = (asset, portfolioName) => {
  const value = getAssetValue(asset, { currentPrice: portfolioName === 'Bitcoin Portfolio' ? 50000 : 3000 });
  return formatValue(value, portfolioName);
};

export default Portfolio;