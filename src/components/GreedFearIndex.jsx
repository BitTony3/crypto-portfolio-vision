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
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-sm font-bold text-red-600">Error: {error.message}</div>;

  const indexValue = data?.data[0]?.value || 0;
  const indexClassification = data?.data[0]?.value_classification || 'Unknown';

  const gaugeData = [
    { name: 'Index', value: indexValue },
    { name: 'Remaining', value: 100 - indexValue },
  ];

  const getColor = (value) => {
    if (value <= 20) return 'hsl(0, 100%, 50%)'; // Extreme Fear
    if (value <= 40) return 'hsl(30, 100%, 50%)'; // Fear
    if (value <= 60) return 'hsl(60, 100%, 50%)'; // Neutral
    if (value <= 80) return 'hsl(120, 100%, 50%)'; // Greed
    return 'hsl(150, 100%, 50%)'; // Extreme Greed
  };

  const COLORS = [getColor(indexValue), 'hsl(210, 20%, 90%)'];

  return (
    <div className="flex flex-col h-full space-y-1 bg-card p-2 rounded-lg shadow-sm text-xs">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold">Fear & Greed Index</h2>
        <div className="text-2xl font-bold" style={{ color: getColor(indexValue) }}>{indexValue}</div>
      </div>
      <div className="flex flex-col items-center flex-grow">
        <ResponsiveContainer width="100%" height={80}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="90%"
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#FFFFFF" strokeWidth={1} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-sm font-semibold mt-1" style={{ color: getColor(indexValue) }}>{indexClassification}</div>
      </div>
      <div className="space-y-1">
        <Progress value={indexValue} className="h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Extreme Fear</span>
          <span>Fear</span>
          <span>Neutral</span>
          <span>Greed</span>
          <span>Extreme Greed</span>
        </div>
      </div>
    </div>
  );
};

export default GreedFearIndex;