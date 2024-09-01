import React, { useState, useEffect, useRef, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Maximize2, Minimize2 } from 'lucide-react';

let tvScriptLoadingPromise;

const TradingViewChart = () => {
  const [layout, setLayout] = useState('1');
  const [symbols, setSymbols] = useState(['BINANCE:BTCUSDT']);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartSize, setChartSize] = useState(60);
  const containerRef = useRef(null);

  const createWidget = (containerId, symbol, theme) => {
    if (document.getElementById(containerId) && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: theme === 'dark' ? "#1a2035" : "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        height: "100%",
        width: "100%",
        overrides: {
          "paneProperties.background": theme === 'dark' ? "#0f172a" : "#ffffff",
          "paneProperties.vertGridProperties.color": theme === 'dark' ? "#1e293b" : "#e2e8f0",
          "paneProperties.horzGridProperties.color": theme === 'dark' ? "#1e293b" : "#e2e8f0",
          "scalesProperties.textColor": theme === 'dark' ? "#94a3b8" : "#64748b",
        },
      });
    }
  };

  const { theme } = useTheme();

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
        createWidget(`tradingview_chart_${index}`, symbol, theme);
      });
    });
  }, [layout, symbols, theme]);

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
      height: isFullscreen ? '100vh' : `calc(${chartSize}vh - 120px)`,
      width: '100%',
    };
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="flex items-center space-x-4 p-4">
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
        <div className="flex items-center space-x-2 flex-grow">
          <span className="text-sm">Chart Size:</span>
          <Slider
            value={[chartSize]}
            onValueChange={([value]) => setChartSize(value)}
            max={100}
            min={20}
            step={1}
            className="w-[200px]"
          />
          <span className="text-sm">{chartSize}%</span>
        </div>
        <Button onClick={toggleFullscreen} variant="outline" size="icon">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      <div ref={containerRef} style={getGridStyle()} className="p-4">
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
