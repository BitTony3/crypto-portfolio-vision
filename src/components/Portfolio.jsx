import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const portfolios = [
  {
    name: 'Bitcoin Portfolio',
    assets: [
      { id: 'bitcoin', amount: 1.2, location: 'Binance', type: 'Exchange' },
      { id: 'bitcoin', amount: 0.8, location: 'OKX', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.5, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'bitcoin', amount: 0.7, location: 'KuCoin', type: 'Exchange' },
      { id: 'bitcoin', amount: 1.22, location: 'Bitcoin Network', type: 'Blockchain' },
      { id: 'bitcoin', amount: 3.5, location: 'Binance', type: 'Exchange' },
    ]
  },
  {
    name: 'Ethereum Portfolio',
    assets: [
      { id: 'ethereum', amount: 8.0, location: 'MetaMask', type: 'Software Wallet' },
      { id: 'ethereum', amount: 6.5, location: 'KuCoin', type: 'Exchange' },
      { id: 'ethereum', amount: 9.2, location: 'Ethereum Mainnet', type: 'Blockchain' },
      { id: 'ethereum', amount: 5.8, location: 'Binance', type: 'Exchange' },
      { id: 'ethereum', amount: 5.0, location: 'OKX', type: 'Exchange' },
      { id: 'ethereum', amount: 30.0, location: 'Binance', type: 'Exchange' },
    ]
  },
  {
    name: 'USDT Portfolio',
    assets: [
      { id: 'tether', amount: 20000, location: 'Tron Network', type: 'Blockchain' },
      { id: 'tether', amount: 65000, location: 'Gate.io', type: 'Exchange' },
      { id: 'tether', amount: 82000, location: 'Binance', type: 'Exchange' },
      { id: 'tether', amount: 40000, location: 'Trezor', type: 'Hardware Wallet' },
      { id: 'tether', amount: 50000, location: 'OKX', type: 'Exchange' },
      { id: 'tether', amount: 43000, location: 'KuCoin', type: 'Exchange' },
    ]
  }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState(portfolios[0].name);
  const [prices, setPrices] = useState({
    bitcoin: null,
    ethereum: null,
    tether: 1, // Assuming USDT is always $1
  });

  useEffect(() => {
    const wsBTC = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    const wsETH = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@ticker');

    wsBTC.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices(prev => ({ ...prev, bitcoin: parseFloat(data.c) }));
    };

    wsETH.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices(prev => ({ ...prev, ethereum: parseFloat(data.c) }));
    };

    return () => {
      wsBTC.close();
      wsETH.close();
    };
  }, []);

  const portfolioValues = useMemo(() => {
    return portfolios.reduce((acc, portfolio) => {
      acc[portfolio.name] = portfolio.assets.reduce((total, item) => {
        const price = prices[item.id];
        return total + (price ? item.amount * price : 0);
      }, 0);
      return acc;
    }, {});
  }, [prices]);

  const totalValue = useMemo(() => 
    Object.values(portfolioValues).reduce((sum, value) => sum + value, 0),
  [portfolioValues]);

  const pieChartData = useMemo(() => 
    Object.entries(portfolioValues).map(([name, value]) => ({ name, value })),
  [portfolioValues]);

  if (prices.bitcoin === null || prices.ethereum === null) {
    return <div>Loading...</div>;
  }

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
              <PortfolioTable portfolio={portfolio} prices={prices} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PortfolioTable = ({ portfolio, prices }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Location</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Value (USD)</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {portfolio.assets.map((item, assetIndex) => {
        const price = prices[item.id] || 0;
        const value = item.amount * price;
        return (
          <TableRow key={assetIndex}>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.amount.toFixed(4)}</TableCell>
            <TableCell>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

export default Portfolio;