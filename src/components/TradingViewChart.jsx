import React, { useState, useEffect, useRef, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

let tvScriptLoadingPromise;

const TradingViewChart = () => {
  const [layout, setLayout] = useState('1');
  const [symbols, setSymbols] = useState(['BINANCE:BTCUSDT']);
  const containerRef = useRef(null);

  const createWidget = (containerId, symbol) => {
    if (document.getElementById(containerId) && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        height: "100%",
        width: "100%",
      });
    }
  };

  useEffect(() => {
    const loadTradingViewScript = () => {
      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      return tvScriptLoadingPromise;
    };

    loadTradingViewScript().then(() => {
      symbols.forEach((symbol, index) => {
        createWidget(`tradingview_chart_${index}`, symbol);
      });
    });
  }, [layout, symbols]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    const newSymbolsCount = parseInt(newLayout);
    setSymbols(prevSymbols => {
      const newSymbols = [...prevSymbols];
      while (newSymbols.length < newSymbolsCount) {
        newSymbols.push('BINANCE:BTCUSDT');
      }
      return newSymbols.slice(0, newSymbolsCount);
    });
  };

  const handleSymbolChange = (index, newSymbol) => {
    setSymbols(prevSymbols => {
      const newSymbols = [...prevSymbols];
      newSymbols[index] = newSymbol;
      return newSymbols;
    });
  };

  const getGridStyle = () => {
    const count = parseInt(layout);
    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '10px',
      height: 'calc(60vh - 120px)',
      width: '100%',
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select value={layout} onValueChange={handleLayoutChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 6, 8, 9, 12].map(num => (
              <SelectItem key={num} value={num.toString()}>{num} Chart{num > 1 ? 's' : ''}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => handleLayoutChange(layout)}>Apply Layout</Button>
      </div>
      <div ref={containerRef} style={getGridStyle()}>
        {symbols.map((symbol, index) => (
          <div key={index} className="relative">
            <Select value={symbol} onValueChange={(newSymbol) => handleSymbolChange(index, newSymbol)}>
              <SelectTrigger className="w-full absolute top-0 left-0 z-10">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BINANCE:BTCUSDT">BTCUSDT</SelectItem>
                <SelectItem value="BINANCE:ETHUSDT">ETHUSDT</SelectItem>
                <SelectItem value="BINANCE:BNBUSDT">BNBUSDT</SelectItem>
                <SelectItem value="BINANCE:ADAUSDT">ADAUSDT</SelectItem>
              </SelectContent>
            </Select>
            <div id={`tradingview_chart_${index}`} style={{ height: '100%', width: '100%', paddingTop: '30px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TradingViewChart);
