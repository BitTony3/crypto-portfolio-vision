import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Login = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async (walletType) => {
    // Simulating wallet connection
    console.log(`Connecting to ${walletType}...`);
    // Here you would typically interact with the wallet API
    setIsConnected(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-yellow-200 flex items-center justify-center font-mono">
      <div className="bg-white border-4 border-black p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">Crypto Asset Tracker</h1>
        <div className="space-y-4">
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => connectWallet('Web3')}
          >
            Connect with Web3 Wallet
          </Button>
          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
            onClick={() => connectWallet('TON')}
          >
            Connect with TON Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;