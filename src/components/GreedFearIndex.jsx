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
    if (value <= 25) return '#FF4136'; // Extreme Fear
    if (value <= 45) return '#FF851B'; // Fear
    if (value <= 55) return '#FFDC00'; // Neutral
    if (value <= 75) return '#2ECC40'; // Greed
    return '#0074D9'; // Extreme Greed
  };

  const COLORS = [getColor(indexValue), '#FFFFFF'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Fear & Greed Index</h2>
        <div className="text-4xl font-bold" style={{ color: getColor(indexValue) }}>{indexValue}</div>
      </div>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={120}>
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
        <div className="text-2xl font-semibold mt-2" style={{ color: getColor(indexValue) }}>{indexClassification}</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Extreme Fear</span>
          <span>Extreme Greed</span>
        </div>
        <Progress value={indexValue} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
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
