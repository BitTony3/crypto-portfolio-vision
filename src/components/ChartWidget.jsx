import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

const ChartWidget = () => {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

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

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => (onLoadScriptRef.current = null);
  }, []);

  function createWidget() {
    if (document.getElementById('tradingview-widget') && 'TradingView' in window) {
      new window.TradingView.widget({
        autosize: true,
        symbol: "NASDAQ:AAPL",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview-widget"
      });
    }
  }

  return (
    <div className='tradingview-widget-container h-full w-full'>
      <div id='tradingview-widget' className='h-full w-full' />
    </div>
  );
};

export default ChartWidget;