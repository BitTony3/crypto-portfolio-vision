import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopCryptoAssets from '../components/TopCryptoAssets';
import Portfolio from '../components/Portfolio';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black p-8 font-mono text-off-white">
        <h1 className="text-6xl font-bold mb-8 text-neon-blue border-4 border-neon-blue p-4 inline-block shadow-[0_0_10px_#00FFFF]">Crypto Asset Tracker</h1>
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
