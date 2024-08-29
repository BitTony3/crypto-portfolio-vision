import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopCryptoAssets from '../components/TopCryptoAssets';
import Portfolio from '../components/Portfolio';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-yellow-200 p-8 font-mono">
        <h1 className="text-6xl font-bold mb-8 text-black border-4 border-black p-4 inline-block">Crypto Asset Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <TopCryptoAssets />
          </div>
          <div className="md:order-1">
            <Portfolio />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Index;
