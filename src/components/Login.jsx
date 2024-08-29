import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = ({ onLogin, onSignUp }) => {
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
    <div className="bg-black border-2 border-neon-blue p-6 rounded-lg shadow-[0_0_10px_#00FFFF]">
      <h2 className="text-2xl font-bold mb-4 text-neon-blue">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-black text-white border-neon-blue"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-black text-white border-neon-blue"
        />
        <Button type="submit" className="w-full bg-neon-blue text-black hover:bg-blue-400">
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <Button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 bg-transparent text-neon-blue border border-neon-blue hover:bg-neon-blue hover:text-black"
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </Button>
    </div>
  );
};

export default Login;