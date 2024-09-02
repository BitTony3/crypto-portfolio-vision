import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', price: 4000 },
  { name: 'Feb', price: 3000 },
  { name: 'Mar', price: 5000 },
  { name: 'Apr', price: 2780 },
  { name: 'May', price: 1890 },
  { name: 'Jun', price: 2390 },
];

const ChartWidget = () => {
  return (
    <div className="h-full w-full p-2">
      <h3 className="text-sm font-semibold mb-2">Price Chart</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;