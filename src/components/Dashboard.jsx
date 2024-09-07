import React from 'react';
import MarketOverview from './MarketOverview';
import GreedFearIndex from './GreedFearIndex';
import CryptoPrice from './CryptoPrice';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketOverview />
        </CardContent>
      </Card>
      <CryptoPrice id="bitcoin" name="Bitcoin" symbol="BTC" />
      <CryptoPrice id="ethereum" name="Ethereum" symbol="ETH" />
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Fear & Greed Index</CardTitle>
        </CardHeader>
        <CardContent>
          <GreedFearIndex />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;