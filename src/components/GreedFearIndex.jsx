import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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

  const getColor = (value) => {
    if (value <= 20) return '#FF4136'; // Extreme Fear
    if (value <= 40) return '#FF851B'; // Fear
    if (value <= 60) return '#FFDC00'; // Neutral
    if (value <= 80) return '#2ECC40'; // Greed
    return '#0074D9'; // Extreme Greed
  };

  const COLORS = [getColor(indexValue), '#E0E0E0'];

  return (
    <div className="space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Fear & Greed Index</h2>
        <div className="text-5xl font-bold" style={{ color: getColor(indexValue) }}>{indexValue}</div>
      </div>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-3xl font-semibold mt-4" style={{ color: getColor(indexValue) }}>{indexClassification}</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-red-600">Extreme Fear</span>
          <span className="text-blue-600">Extreme Greed</span>
        </div>
        <Progress value={indexValue} className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default GreedFearIndex;
