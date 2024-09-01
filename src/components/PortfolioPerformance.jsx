import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockPerformanceData = [
  { date: '2023-01-01', value: 10000 },
  { date: '2023-02-01', value: 12000 },
  { date: '2023-03-01', value: 11000 },
  { date: '2023-04-01', value: 13000 },
  { date: '2023-05-01', value: 15000 },
  { date: '2023-06-01', value: 14000 },
];

const PortfolioPerformance = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockPerformanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPerformance;