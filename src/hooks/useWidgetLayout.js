import { useState, useEffect } from 'react';

export const useWidgetLayout = () => {
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [
      'Portfolio',
      'ChartWidget',
      'MarketOverview',
      'GreedFearIndex',
      'TopPerformers',
      'TrendingCoins',
      'CryptoNews',
    ];
  });

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (widgetName) => {
    if (!widgets.includes(widgetName)) {
      setWidgets([...widgets, widgetName]);
    }
  };

  const removeWidget = (index) => {
    const newWidgets = widgets.filter((_, i) => i !== index);
    setWidgets(newWidgets);
  };

  return { widgets, setWidgets, addWidget, removeWidget };
};