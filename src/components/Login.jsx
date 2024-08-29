import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

const Login = ({ onLogin, onSignUp, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onSignUp(username, password);
    }
  };

  return (
    <div className="bg-white border-2 border-primary p-6 rounded-lg shadow-lg relative" style={{ filter: 'none', pointerEvents: 'auto' }}>
      <Button
        onClick={onClose}
        className="absolute top-2 right-2 text-neon-blue hover:text-white"
        variant="ghost"
      >
        <X size={24} />
      </Button>
      <h2 className="text-2xl font-bold mb-4 text-primary">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white text-black border-primary"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-black text-white border-neon-blue"
        />
        <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <Button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white"
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </Button>
    </div>
  );
};

export default Login;
