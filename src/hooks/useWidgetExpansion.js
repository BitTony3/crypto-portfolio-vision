import { useState } from 'react';

export const useWidgetExpansion = () => {
  const [expandedWidgets, setExpandedWidgets] = useState({ Portfolio: true });

  const toggleWidgetExpansion = (widgetName) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  };

  return { expandedWidgets, toggleWidgetExpansion };
};