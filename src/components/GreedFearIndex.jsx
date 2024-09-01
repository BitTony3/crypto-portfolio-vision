import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const fetchGreedFearIndex = async () => {
  const response = await fetch('https://api.alternative.me/fng/');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const GreedFearIndex = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['greedFearIndex'],
    queryFn: fetchGreedFearIndex,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-2xl font-bold text-red-600">Error: {error.message}</div>;

  const indexValue = data?.data[0]?.value || 0;
  const indexClassification = data?.data[0]?.value_classification || 'Unknown';

  const gaugeData = [
    { name: 'Index', value: indexValue },
    { name: 'Remaining', value: 100 - indexValue },
  ];

  const COLORS = ['#0088FE', '#FFFFFF'];

  return (
    <div className="bg-secondary border-4 border-primary p-4 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-primary">Crypto Fear & Greed Index</h2>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-4xl font-bold mt-4">{indexValue}</div>
        <div className="text-2xl mt-2">{indexClassification}</div>
      </div>
    </div>
  );
};

export default GreedFearIndex;