import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Search,
  Plus,
  Trash2,
  Settings,
  TrendingUp,
  TrendingDown,
  Bell,
  Download,
  Info,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  X,
  Check,
  Edit3,
  DollarSign,
  PieChart,
  Newspaper,
  SlidersHorizontal,
  ExternalLink,
  Volume2
} from 'lucide-react';
import {
  STOCKS_DIRECTORY,
  getStockMeta,
  generateHistoricalData,
  getLiveTick,
  generateSectorPerformance,
  generateMarketNews,
  calculateSentiment,
  fetchLiveAPIQuote,
  fetchLiveAPINews,
  fetchLiveAPISearch,
  fetchAlphaVantageHistory
} from './marketService';

// Standard public caching object for API mode
const apiCache = {
  quotes: {},
  history: {},
  news: {}
};

// Custom Candlestick Renderer for Recharts
const CustomCandlestick = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload || payload.open === undefined || payload.close === undefined) return null;
  const { open, close, high, low } = payload;
  const isGrow = close >= open;
  const color = isGrow ? '#10b981' : '#ef4444';
  
  const bodyWidth = Math.max(4, width - 6);
  const bodyX = x + (width - bodyWidth) / 2;
  
  const diff = Math.abs(open - close);
  const scale = diff === 0 ? 1 : height / diff;
  
  const highY = y - (high - Math.max(open, close)) * scale;
  const lowY = y + height + (Math.min(open, close) - low) * scale;
  const wickX = x + width / 2;
  
  return (
    <g>
      <line
        x1={wickX}
        y1={highY}
        x2={wickX}
        y2={lowY}
        stroke={color}
        strokeWidth={1.5}
      />
      <rect
        x={bodyX}
        y={y}
        width={bodyWidth}
        height={Math.max(2, height)}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

// ────────────────────────────────────────────────────────────────────
// TradingView Advanced Chart Widget (free embed, no API key needed)
// ────────────────────────────────────────────────────────────────────
const TradingViewChart = ({ symbol, activeMarket, timeframe }) => {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  // Map our timeframe labels to TradingView interval strings
  const tvInterval = {
    '1D': 'D',  '1W': 'W',  '1M': 'M',
    '3M': '3M', '1Y': '12M', '5Y': '60M'
  }[timeframe] || 'D';

  // Build the TradingView symbol with correct exchange prefix
  const tvSymbol = (() => {
    if (activeMarket === 'indian') return `BSE:${symbol}`;
    if (activeMarket === 'crypto')  return `BINANCE:${symbol}USDT`;
    return `NASDAQ:${symbol}`;
  })();

  useEffect(() => {
    if (!containerRef.current) return;
    // Remove any previous widget
    if (widgetRef.current) {
      containerRef.current.innerHTML = '';
      widgetRef.current = null;
    }
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: tvInterval,
      timezone: activeMarket === 'indian' ? 'Asia/Kolkata' : 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: 'rgba(10,15,28,0)',
      gridColor: 'rgba(30,41,59,0.4)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      withdateranges: true,
      studies: ['STD;MACD', 'STD;RSI']
    });
    containerRef.current.appendChild(script);
    widgetRef.current = script;
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [tvSymbol, tvInterval]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
      <div className="tradingview-widget-copyright" style={{ fontSize: '11px', color: '#475569', textAlign: 'center', paddingTop: '4px' }}>
        <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Powered by TradingView
        </a>
      </div>
    </div>
  );
};

export default function App() {

  // ─── MARKET SWITCHER ──────────────────────────────────────────────────────
  const MARKET_DEFAULTS = {
    indian: {
      watchlist: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'TATAMOTORS', 'SBIN'],
      portfolio: [
        { symbol: 'RELIANCE', qty: 10, buyPrice: 2850.00 },
        { symbol: 'HDFCBANK', qty: 25, buyPrice: 1610.00 },
        { symbol: 'TCS',      qty: 8,  buyPrice: 3500.00 }
      ],
      activeStock: 'RELIANCE',
      indices: [
        { sym: 'NIFTY',      name: 'NIFTY 50'   },
        { sym: 'RELIANCE',   name: 'RELIANCE'   },
        { sym: 'TCS',        name: 'TCS'        },
        { sym: 'HDFCBANK',   name: 'HDFC BANK'  },
        { sym: 'INFY',       name: 'INFOSYS'    },
        { sym: 'TATAMOTORS', name: 'TATA MOTORS'}
      ]
    },
    international: {
      watchlist: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'SPY', 'QQQ'],
      portfolio: [
        { symbol: 'AAPL', qty: 15, buyPrice: 178.20 },
        { symbol: 'MSFT', qty: 10, buyPrice: 405.50 },
        { symbol: 'NVDA', qty: 25, buyPrice: 850.00 }
      ],
      activeStock: 'AAPL',
      indices: [
        { sym: 'SPY',  name: 'S&P 500'   },
        { sym: 'QQQ',  name: 'NASDAQ'    },
        { sym: 'TSLA', name: 'TESLA'     },
        { sym: 'AAPL', name: 'APPLE'     },
        { sym: 'NVDA', name: 'NVIDIA'    },
        { sym: 'MSFT', name: 'MICROSOFT' }
      ]
    },
    crypto: {
      watchlist: ['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'XRP'],
      portfolio: [
        { symbol: 'BTC', qty: 0.25, buyPrice: 62500.00 },
        { symbol: 'ETH', qty: 2.5,  buyPrice: 3100.00  },
        { symbol: 'SOL', qty: 12.0, buyPrice: 145.00   }
      ],
      activeStock: 'BTC',
      indices: [
        { sym: 'BTC', name: 'BITCOIN'  },
        { sym: 'ETH', name: 'ETHEREUM' },
        { sym: 'SOL', name: 'SOLANA'   },
        { sym: 'BNB', name: 'BNB'      },
        { sym: 'ADA', name: 'CARDANO'  },
        { sym: 'XRP', name: 'RIPPLE'   }
      ]
    }
  };

  const [activeMarket, setActiveMarket] = useState(() =>
    localStorage.getItem('q_market') || 'indian'
  );

  const currencySymbol = activeMarket === 'indian' ? '₹' : '$';

  const handleMarketChange = (mkt) => {
    // persist current market data
    localStorage.setItem('q_watchlist_' + activeMarket, JSON.stringify(watchlist));
    localStorage.setItem('q_portfolio_' + activeMarket, JSON.stringify(portfolio));
    // load new market data
    const savedWL = localStorage.getItem('q_watchlist_' + mkt);
    const savedPF = localStorage.getItem('q_portfolio_' + mkt);
    setWatchlist(savedWL ? JSON.parse(savedWL) : MARKET_DEFAULTS[mkt].watchlist);
    setPortfolio(savedPF ? JSON.parse(savedPF) : MARKET_DEFAULTS[mkt].portfolio);
    setActiveStock(MARKET_DEFAULTS[mkt].activeStock);
    setActiveMarket(mkt);
    localStorage.setItem('q_market', mkt);
  };
  // ─────────────────────────────────────────────────────────────────────────

  // --- CORE STATE ---
  const [activeStock, setActiveStock] = useState(() => {
    const mkt = localStorage.getItem('q_market') || 'indian';
    return MARKET_DEFAULTS[mkt].activeStock;
  });
  const [watchlist, setWatchlist] = useState(() => {
    const mkt = localStorage.getItem('q_market') || 'indian';
    const saved = localStorage.getItem('q_watchlist_' + mkt);
    return saved ? JSON.parse(saved) : MARKET_DEFAULTS[mkt].watchlist;
  });
  const [portfolio, setPortfolio] = useState(() => {
    const mkt = localStorage.getItem('q_market') || 'indian';
    const saved = localStorage.getItem('q_portfolio_' + mkt);
    return saved ? JSON.parse(saved) : MARKET_DEFAULTS[mkt].portfolio;
  });
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('candlestick');
  const [useTVChart, setUseTVChart] = useState(true); // TradingView ON by default
  const [indicators, setIndicators] = useState({
    ma20: true,
    ma50: false,
    rsi: false,
    macd: false
  });
  const [comparisonStock, setComparisonStock] = useState(null);
  
  // Data State
  const [historicalData, setHistoricalData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [marketNews, setMarketNews] = useState([]);
  const [sectorPerformance, setSectorPerformance] = useState([]);
  const [sentiment, setSentiment] = useState({ score: 65, label: 'Greed', color: 'text-emerald-400' });
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('quantum_alerts');
    return saved ? JSON.parse(saved) : [
      { id: '1', symbol: 'RELIANCE', target: 3000.00, condition: 'above', active: true },
      { id: '2', symbol: 'TCS',      target: 3200.00, condition: 'below', active: true }
    ];
  });
  
  // App Settings — Live mode ON by default with user's API keys
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('quantum_settings');
    if (saved) return JSON.parse(saved);
    return {
      mode: 'live',
      finnhubKey: 'd9an4jpr01qp4bhrm5q0d9an4jpr01qp4bhrm5qg',
      alphaVantageKey: 'XGW8PKD24HNKAE1Y',
      tradingViewKey: ''
    };
  });

  // UI Control State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [compQuery, setCompQuery] = useState('');
  const [compResults, setCompResults] = useState([]);
  const [activeSettingsModal, setActiveSettingsModal] = useState(false);
  const [activePositionModal, setActivePositionModal] = useState(false);
  const [activeAlertModal, setActiveAlertModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [inputPosition, setInputPosition] = useState({ symbol: '', qty: '', buyPrice: '' });
  const [isEditingPosition, setIsEditingPosition] = useState(false);
  const [inputAlert, setInputAlert] = useState({ symbol: 'AAPL', target: '', condition: 'above' });
  
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  // --- LOCAL PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('quantum_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('quantum_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('quantum_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('quantum_settings', JSON.stringify(settings));
    // Clear cache when credentials or modes change
    apiCache.quotes = {};
    apiCache.history = {};
    apiCache.news = {};
  }, [settings]);

  // Show dynamic toast helper
  const showToast = (text, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToast({ text, type, id });
    setTimeout(() => {
      setToast(prev => prev && prev.id === id ? null : prev);
    }, 5000);
  };

  // --- RE-INITIALIZE PRICES AND STATIC SECTORS ON LOAD ---
  useEffect(() => {
    const initialPrices = {};
    watchlist.forEach(sym => {
      const meta = getStockMeta(sym);
      initialPrices[sym] = {
        price: meta.price,
        change: 0,
        changePercent: 0,
        bid: meta.price - 0.05,
        ask: meta.price + 0.05,
        high: meta.price * 1.02,
        low: meta.price * 0.98,
        volume: meta.volume,
        timestamp: new Date().toLocaleTimeString()
      };
    });
    // Add active ticker if missing
    if (!initialPrices[activeStock]) {
      const meta = getStockMeta(activeStock);
      initialPrices[activeStock] = {
        price: meta.price,
        change: 0,
        changePercent: 0,
        bid: meta.price - 0.05,
        ask: meta.price + 0.05,
        high: meta.price * 1.02,
        low: meta.price * 0.98,
        volume: meta.volume,
        timestamp: new Date().toLocaleTimeString()
      };
    }
    setLivePrices(initialPrices);
    setSectorPerformance(generateSectorPerformance());
    setMarketNews(generateMarketNews(activeStock));
    setSentiment(calculateSentiment(activeStock));
  }, []);

  // --- DATA LOADING & FETCHING CLIENT ---
  const loadMarketData = async () => {
    setLoading(true);
    try {
      if (settings.mode === 'live' && settings.alphaVantageKey) {
        // Fetch real-time daily history via Alpha Vantage
        const cacheKey = `${activeStock}-${timeframe}`;
        let history;
        if (apiCache.history[cacheKey]) {
          history = apiCache.history[cacheKey];
        } else {
          history = await fetchAlphaVantageHistory(activeStock, settings.alphaVantageKey);
          apiCache.history[cacheKey] = history;
        }
        setHistoricalData(history);

        // Fetch Comparison history if set
        if (comparisonStock) {
          const compCacheKey = `${comparisonStock}-${timeframe}`;
          let compHistory;
          if (apiCache.history[compCacheKey]) {
            compHistory = apiCache.history[compCacheKey];
          } else {
            compHistory = await fetchAlphaVantageHistory(comparisonStock, settings.alphaVantageKey);
            apiCache.history[compCacheKey] = compHistory;
          }
          setComparisonData(compHistory);
        }
      } else {
        // Fetch simulated data
        const history = generateHistoricalData(activeStock, timeframe, livePrices[activeStock]?.price);
        setHistoricalData(history);
        
        if (comparisonStock) {
          const compHistory = generateHistoricalData(comparisonStock, timeframe, livePrices[comparisonStock]?.price);
          setComparisonData(compHistory);
        }
      }
      
      // Load News
      if (settings.mode === 'live' && settings.finnhubKey) {
        let news;
        if (apiCache.news[activeStock]) {
          news = apiCache.news[activeStock];
        } else {
          news = await fetchLiveAPINews(activeStock, settings.finnhubKey);
          apiCache.news[activeStock] = news;
        }
        setMarketNews(news);
      } else {
        setMarketNews(generateMarketNews(activeStock));
      }
      
      // Calculate Sentiment & Stats
      setSentiment(calculateSentiment(activeStock));
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message}. Reverting to Demo Simulator.`, 'error');
      // Fallback
      const history = generateHistoricalData(activeStock, timeframe);
      setHistoricalData(history);
      setMarketNews(generateMarketNews(activeStock));
    } finally {
      setLoading(false);
    }
  };

  // Trigger data reload on ticker, timeframe, or settings update
  useEffect(() => {
    loadMarketData();
  }, [activeStock, timeframe, comparisonStock, settings.mode]);

  // --- LIVE TICKS TICKER SYSTEM (Runs every 3s) ---
  useEffect(() => {
    const interval = setInterval(async () => {
      const updatedPrices = { ...livePrices };
      const symbolsToUpdate = Array.from(new Set([
        ...watchlist,
        ...portfolio.map(p => p.symbol),
        activeStock,
        comparisonStock
      ].filter(Boolean)));

      let triggerAlerts = [];

      for (const sym of symbolsToUpdate) {
        try {
          if (settings.mode === 'live' && settings.finnhubKey) {
            // Live HTTP quote fetch
            const cacheKey = sym;
            let quote;
            // Fetch quote every 15 seconds to avoid over-limit, otherwise reuse
            const now = Date.now();
            if (apiCache.quotes[cacheKey] && (now - apiCache.quotes[cacheKey].fetchedAt < 15000)) {
              quote = apiCache.quotes[cacheKey].data;
            } else {
              quote = await fetchLiveAPIQuote(sym, settings.finnhubKey);
              apiCache.quotes[cacheKey] = { data: quote, fetchedAt: now };
            }
            updatedPrices[sym] = quote;
          } else {
            // Simulation random walk
            const current = livePrices[sym] || { price: getStockMeta(sym).price, volume: getStockMeta(sym).volume };
            const tick = getLiveTick(sym, current.price, current.volume);
            updatedPrices[sym] = tick;
          }

          // --- CHECK PRICE ALERTS ---
          const currentPrice = updatedPrices[sym].price;
          alerts.forEach(alert => {
            if (alert.active && alert.symbol === sym) {
              if (alert.condition === 'above' && currentPrice >= alert.target) {
                triggerAlerts.push({ ...alert, current: currentPrice });
              } else if (alert.condition === 'below' && currentPrice <= alert.target) {
                triggerAlerts.push({ ...alert, current: currentPrice });
              }
            }
          });

        } catch (e) {
          // Silent fallback for individual ticks
        }
      }

      setLivePrices(updatedPrices);
      setSectorPerformance(generateSectorPerformance());
      setLastUpdate(new Date().toLocaleTimeString());

      // Trigger Alerts Toast
      if (triggerAlerts.length > 0) {
        triggerAlerts.forEach(trig => {
          showToast(`🚨 ALERT TRIGGERED: ${trig.symbol} crossed ${trig.condition} ${trig.target} (Current: $${trig.current})`, 'alert');
          // Set alert to inactive
          setAlerts(prev => prev.map(a => a.id === trig.id ? { ...a, active: false } : a));
        });
      }

      // Update 1D historical data's last candle in real time
      if (timeframe === '1D' && updatedPrices[activeStock]) {
        setHistoricalData(prev => {
          if (!prev || prev.length === 0) return prev;
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const tick = updatedPrices[activeStock];
          updated[lastIndex] = {
            ...updated[lastIndex],
            close: tick.price,
            high: Math.max(updated[lastIndex].high, tick.price),
            low: Math.min(updated[lastIndex].low, tick.price),
            volume: tick.volume
          };
          return updated;
        });
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [livePrices, watchlist, portfolio, activeStock, comparisonStock, alerts, settings, timeframe]);

  // --- AUTOCOMPLETE LOGIC ---
  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val) {
      setSearchResults([]);
      return;
    }

    if (settings.mode === 'live' && settings.finnhubKey) {
      try {
        const results = await fetchLiveAPISearch(val, settings.finnhubKey);
        setSearchResults(results);
      } catch (err) {
        // Fallback search local
        filterLocalSearch(val, setSearchResults);
      }
    } else {
      filterLocalSearch(val, setSearchResults);
    }
  };

  const handleCompSearchChange = async (e) => {
    const val = e.target.value;
    setCompQuery(val);
    if (!val) {
      setCompResults([]);
      return;
    }

    if (settings.mode === 'live' && settings.finnhubKey) {
      try {
        const results = await fetchLiveAPISearch(val, settings.finnhubKey);
        setCompResults(results);
      } catch (err) {
        filterLocalSearch(val, setCompResults);
      }
    } else {
      filterLocalSearch(val, setCompResults);
    }
  };

  const filterLocalSearch = (query, setter) => {
    const filtered = STOCKS_DIRECTORY.filter(s => 
      s.symbol.toLowerCase().includes(query.toLowerCase()) || 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    setter(filtered.slice(0, 6));
  };

  const selectStock = (sym) => {
    const cleanSym = sym.toUpperCase().trim();
    setActiveStock(cleanSym);
    setSearchQuery('');
    setSearchResults([]);
    setComparisonStock(null); // Reset comparison
    
    // Add to watchlist if not present
    if (!watchlist.includes(cleanSym)) {
      setWatchlist(prev => [...prev, cleanSym]);
    }
  };

  const selectComparison = (sym) => {
    const cleanSym = sym.toUpperCase().trim();
    if (cleanSym === activeStock) {
      showToast("Cannot compare a stock to itself", "warning");
      return;
    }
    setComparisonStock(cleanSym);
    setCompQuery('');
    setCompResults([]);
    showToast(`Comparing ${activeStock} with ${cleanSym}`, 'info');
  };

  // --- CRUD PORTFOLIO OPERATIONS ---
  const handleOpenAddPosition = () => {
    setInputPosition({ symbol: activeStock, qty: '', buyPrice: livePrices[activeStock]?.price || '' });
    setIsEditingPosition(false);
    setActivePositionModal(true);
  };

  const handleOpenEditPosition = (pos) => {
    setInputPosition({ symbol: pos.symbol, qty: pos.qty, buyPrice: pos.buyPrice });
    setIsEditingPosition(true);
    setActivePositionModal(true);
  };

  const handleSubmitPosition = (e) => {
    e.preventDefault();
    const { symbol, qty, buyPrice } = inputPosition;
    const cleanSymbol = symbol.toUpperCase().trim();
    const quantity = parseFloat(qty);
    const price = parseFloat(buyPrice);

    if (!cleanSymbol || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      showToast("Please enter valid symbol, positive quantity and price", "error");
      return;
    }

    if (isEditingPosition) {
      setPortfolio(prev => prev.map(item => 
        item.symbol === cleanSymbol ? { ...item, qty: quantity, buyPrice: price } : item
      ));
      showToast(`Updated position for ${cleanSymbol}`, 'success');
    } else {
      // Check if position already exists
      const existing = portfolio.find(p => p.symbol === cleanSymbol);
      if (existing) {
        // Average up position
        const newQty = existing.qty + quantity;
        const newBuyPrice = ((existing.qty * existing.buyPrice) + (quantity * price)) / newQty;
        setPortfolio(prev => prev.map(item => 
          item.symbol === cleanSymbol ? { ...item, qty: newQty, buyPrice: parseFloat(newBuyPrice.toFixed(2)) } : item
        ));
      } else {
        setPortfolio(prev => [...prev, { symbol: cleanSymbol, qty: quantity, buyPrice: price }]);
      }
      showToast(`Added ${quantity} shares of ${cleanSymbol}`, 'success');
      
      // Ensure added to watchlist
      if (!watchlist.includes(cleanSymbol)) {
        setWatchlist(prev => [...prev, cleanSymbol]);
      }
    }

    setActivePositionModal(false);
  };

  const handleDeletePosition = (symbol) => {
    setPortfolio(prev => prev.filter(p => p.symbol !== symbol));
    showToast(`Removed position for ${symbol}`, 'success');
  };

  // --- WATCHLIST OPERATIONS ---
  const toggleWatchlist = (symbol) => {
    if (watchlist.includes(symbol)) {
      if (symbol === activeStock) {
        showToast("Cannot remove active stock from watchlist", "warning");
        return;
      }
      setWatchlist(prev => prev.filter(s => s !== symbol));
      showToast(`Removed ${symbol} from watchlist`, 'info');
    } else {
      setWatchlist(prev => [...prev, symbol]);
      showToast(`Added ${symbol} to watchlist`, 'success');
    }
  };

  // --- CSV EXPORTER ---
  const handleCSVExport = () => {
    if (portfolio.length === 0) {
      showToast("Portfolio is empty", "warning");
      return;
    }

    const headers = "Symbol,Shares,Avg Buy Price,Current Price,Market Value,Daily Change %,Gain/Loss ($),Return (%)\n";
    const rows = portfolio.map(pos => {
      const live = livePrices[pos.symbol] || { price: pos.buyPrice, changePercent: 0 };
      const value = pos.qty * live.price;
      const pl = value - (pos.qty * pos.buyPrice);
      const returnPercent = ((live.price - pos.buyPrice) / pos.buyPrice) * 100;
      return `${pos.symbol},${pos.qty},${pos.buyPrice},${live.price},${value.toFixed(2)},${live.changePercent}%,${pl.toFixed(2)},${returnPercent.toFixed(2)}%`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quantum_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Portfolio exported as CSV", "success");
  };

  // --- ALERTS CRUD ---
  const handleAddAlert = (e) => {
    e.preventDefault();
    const targetVal = parseFloat(inputAlert.target);
    if (isNaN(targetVal) || targetVal <= 0) {
      showToast("Please enter a valid target price", "error");
      return;
    }

    const newAlert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: inputAlert.symbol,
      target: targetVal,
      condition: inputAlert.condition,
      active: true
    };

    setAlerts(prev => [newAlert, ...prev]);
    setActiveAlertModal(false);
    showToast(`Alert set for ${inputAlert.symbol} at $${targetVal}`, 'success');
  };

  const toggleAlertStatus = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleDeleteAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast("Alert deleted", "info");
  };

  // --- PORTFOLIO CALCULATION METRICS ---
  const portfolioStats = portfolio.reduce((acc, pos) => {
    const live = livePrices[pos.symbol] || { price: pos.buyPrice, change: 0, changePercent: 0 };
    const cost = pos.qty * pos.buyPrice;
    const value = pos.qty * live.price;
    const todayChange = pos.qty * live.change;
    
    acc.totalCost += cost;
    acc.totalValue += value;
    acc.totalTodayChange += todayChange;
    return acc;
  }, { totalCost: 0, totalValue: 0, totalTodayChange: 0 });

  const totalGainLoss = portfolioStats.totalValue - portfolioStats.totalCost;
  const totalReturnPercent = portfolioStats.totalCost > 0 ? (totalGainLoss / portfolioStats.totalCost) * 100 : 0;
  const todayReturnPercent = portfolioStats.totalCost > 0 ? (portfolioStats.totalTodayChange / portfolioStats.totalValue) * 100 : 0;

  // --- CHART NORMALIZATION FOR COMPARISONS ---
  const getNormalizedChartData = () => {
    if (historicalData.length === 0) return [];
    
    // If not comparing, return data directly
    if (!comparisonStock || comparisonData.length === 0) {
      return historicalData;
    }

    const baseClose = historicalData[0].close || 1;
    const baseCompClose = comparisonData[0]?.close || 1;

    // Overlay percentage increases starting from 0%
    return historicalData.map((d, index) => {
      const compPoint = comparisonData[index];
      const closePercent = ((d.close - baseClose) / baseClose) * 100;
      const compPercent = compPoint ? ((compPoint.close - baseCompClose) / baseCompClose) * 100 : 0;
      
      return {
        ...d,
        [`${activeStock} (%)`]: parseFloat(closePercent.toFixed(2)),
        [`${comparisonStock} (%)`]: parseFloat(compPercent.toFixed(2)),
        // Store raw details for tooltip
        closeRaw: d.close,
        compCloseRaw: compPoint?.close || 0
      };
    });
  };

  const chartData = getNormalizedChartData();

  // Active Stock statistics
  const currentLiveMeta = livePrices[activeStock] || { price: 0, change: 0, changePercent: 0, bid: 0, ask: 0, high: 0, low: 0, volume: 0 };
  const activeStockMeta = getStockMeta(activeStock);

  return (
    <div className="flex flex-col min-h-screen bg-navy-950 text-slate-100 font-sans antialiased select-none">
      
      {/* --- TOAST NOTIFICATIONS --- */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-md transition-all duration-300 transform translate-y-0
          ${toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : ''}
          ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : ''}
          ${toast.type === 'alert' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200 animate-bounce' : ''}
          ${toast.type === 'info' ? 'bg-blue-950/90 border-blue-500/50 text-blue-200' : ''}
          ${toast.type === 'warning' ? 'bg-slate-900 border-slate-700 text-yellow-300' : ''}
        `}>
          <div className="flex-1 font-medium text-sm">{toast.text}</div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* --- TOP INDEX TICKER TAPE --- */}
      <div className="w-full border-b text-xs text-amber-700/80 flex items-center overflow-x-auto whitespace-nowrap py-1.5 px-4 gap-6 select-none scrollbar-none" style={{background:'rgba(10,8,0,0.95)', borderColor:'rgba(245,158,11,0.15)'}}>
        <div className="flex items-center gap-1.5 font-semibold text-amber-500 mr-2 border-r border-amber-900/40 pr-4 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 glow-green animate-pulse-soft"></span>
          LIVE
        </div>
        {MARKET_DEFAULTS[activeMarket].indices.map(indexItem => {
          const live = livePrices[indexItem.sym] || { price: 0, changePercent: 0 };
          const isUp = live.changePercent >= 0;
          return (
            <div
              key={indexItem.sym}
              onClick={() => selectStock(indexItem.sym)}
              className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors"
            >
              <span className="font-medium text-slate-300">{indexItem.name}</span>
              <span className="font-mono">{currencySymbol}{live.price.toFixed(2)}</span>
              <span className={`font-mono flex items-center font-semibold ${isUp ? 'text-gain' : 'text-loss'}`}>
                {isUp ? '+' : ''}{live.changePercent}%
                {isUp ? <ChevronUp size={12} className="ml-0.5" /> : <ChevronDown size={12} className="ml-0.5" />}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 ml-auto pl-4 border-l border-navy-700 font-mono text-[10px] text-slate-500">
          Last Live Refresh: {lastUpdate}
        </div>
      </div>

      {/* --- HEADER BAR --- */}
      <header className="glass-panel w-full sticky top-0 z-40 border-b border-gold-500/20 px-4 py-3 flex items-center justify-between gap-3" style={{background:'rgba(17,14,0,0.92)', backdropFilter:'blur(16px)'}}>
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="Quantum Logo"
            className="h-10 w-10 rounded-xl object-cover shadow-lg"
            style={{boxShadow:'0 0 16px rgba(245,158,11,0.35)'}}
          />
          <div>
            <h1 className="font-extrabold text-xl tracking-tight font-display text-gold-gradient">QUANTUM</h1>
            <p className="text-[9px] tracking-widest text-amber-600/70 font-semibold uppercase">Financial Analysis Engine</p>
          </div>
        </div>

        {/* ── MARKET SWITCHER TABS ── */}
        <div className="flex items-center p-1 rounded-xl gap-1 shrink-0" style={{background:'rgba(28,23,0,0.8)', border:'1px solid rgba(245,158,11,0.2)'}}>
          {[
            { id: 'international', label: 'Intl', icon: '🌐' },
            { id: 'indian',        label: 'India 🇮🇳', icon: '' },
            { id: 'crypto',        label: 'Crypto', icon: '🪙' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => handleMarketChange(m.id)}
              style={activeMarket === m.id
                ? { background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#000', boxShadow: '0 2px 12px rgba(245,158,11,0.5)', fontWeight: 800 }
                : {}}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap
                ${activeMarket === m.id ? '' : 'text-amber-600/70 hover:text-amber-400 hover:bg-amber-950/40'}`}
            >
              {m.icon && <span>{m.icon}</span>}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* ── GROWW + TRADINGVIEW QUICK LINKS ── */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://groww.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
            style={{border:'1px solid rgba(34,197,94,0.35)', background:'rgba(34,197,94,0.08)', color:'#4ade80'}}
            title="Open Groww"
          >
            <span>📈</span>
            <span className="hidden lg:inline">Groww</span>
          </a>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${activeMarket === 'indian' ? 'BSE:' : activeMarket === 'crypto' ? 'BINANCE:' : 'NASDAQ:'}${activeStock}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap"
            style={{border:'1px solid rgba(245,158,11,0.35)', background:'rgba(245,158,11,0.08)', color:'#fbbf24'}}
            title="Open in TradingView"
          >
            <span>📊</span>
            <span className="hidden lg:inline">TradingView</span>
          </a>
        </div>

        {/* Global Stock Search */}
        <div className="relative w-80 grow max-w-xs">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search ticker or company name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-navy-900 border border-navy-700 hover:border-slate-500 focus:border-blue-500 focus:outline-none rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 transition-colors placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-3 text-slate-400 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="glass-panel-heavy absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border border-navy-600 overflow-hidden z-50">
              {searchResults.map(stock => (
                <div
                  key={stock.symbol}
                  onClick={() => selectStock(stock.symbol)}
                  className="px-4 py-3 hover:bg-slate-800/80 cursor-pointer flex justify-between items-center transition-colors border-b border-navy-700 last:border-b-0"
                >
                  <div>
                    <span className="font-bold text-blue-400 font-mono text-sm">{stock.symbol}</span>
                    <span className="text-slate-400 text-xs ml-3">{stock.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-navy-900 px-2 py-0.5 rounded uppercase font-semibold">
                    {stock.sector}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings, Sync & Alerts Buttons */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 bg-navy-900 border border-navy-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${settings.mode === 'live' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
            {settings.mode === 'live' ? 'Live API Feed' : 'Real-time Simulator'}
          </div>
          <button 
            onClick={() => loadMarketData()}
            className="p-2 bg-navy-900 border border-navy-700 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => { setInputAlert({ symbol: activeStock, target: '', condition: 'above' }); setActiveAlertModal(true); }}
            className="p-2 bg-navy-900 border border-navy-700 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            title="Set Price Alert"
          >
            <Bell size={16} className="text-amber-400" />
            <span className="hidden md:inline font-semibold">Alerts</span>
          </button>
          <button 
            onClick={() => setActiveSettingsModal(true)}
            className="p-2 bg-navy-900 border border-navy-700 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Configuration Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* --- DASHBOARD GRID --- */}
      <main className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 overflow-hidden">
        
        {/* === LEFT COLUMN: WATCHLIST & PORTFOLIO === */}
        <section className="xl:col-span-1 flex flex-col gap-6 h-full">
          
          {/* Portfolio Performance Summary Card */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <PieChart size={14} className="text-blue-400" /> Investment Portfolio
              </span>
              <button 
                onClick={handleCSVExport}
                className="text-[10px] text-slate-400 hover:text-blue-400 border border-navy-700 hover:border-blue-500/40 rounded px-2 py-0.5 flex items-center gap-1 transition-all"
                title="Download portfolio as CSV"
              >
                <Download size={10} /> CSV
              </button>
            </div>
            
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Equity Value</p>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  ${portfolioStats.totalValue.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-navy-700/60 pt-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Returns</p>
                <p className={`font-mono text-sm font-semibold flex items-center mt-0.5 ${totalGainLoss >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-[11px] font-normal ml-1">({totalGainLoss >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%)</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Today's Profit & Loss</p>
                <p className={`font-mono text-sm font-semibold flex items-center mt-0.5 ${portfolioStats.totalTodayChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {portfolioStats.totalTodayChange >= 0 ? '+' : ''}${portfolioStats.totalTodayChange.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-[11px] font-normal ml-1">({portfolioStats.totalTodayChange >= 0 ? '+' : ''}{todayReturnPercent.toFixed(2)}%)</span>
                </p>
              </div>
            </div>

            <button 
              onClick={handleOpenAddPosition}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md mt-1"
            >
              <Plus size={14} /> Add/Modify Position
            </button>
          </article>

          {/* Watchlist Section */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 flex flex-col flex-1 min-h-[250px] overflow-hidden">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Watchlist</h3>
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-navy-700 text-[10px] uppercase font-bold text-slate-500 pb-2">
                    <th className="py-1">Symbol</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Change</th>
                    <th className="py-1 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map(sym => {
                    const live = livePrices[sym] || { price: 0, changePercent: 0 };
                    const isUp = live.changePercent >= 0;
                    return (
                      <tr 
                        key={sym} 
                        onClick={() => selectStock(sym)}
                        className={`border-b border-navy-700/40 hover:bg-slate-800/40 cursor-pointer transition-colors ${sym === activeStock ? 'bg-slate-800/50' : ''}`}
                      >
                        <td className="py-2.5">
                          <span className="font-bold text-slate-200 font-mono text-sm block">{sym}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[80px]">{getStockMeta(sym).name}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-sm font-semibold text-slate-100">
                          ${live.price.toFixed(2)}
                        </td>
                        <td className={`py-2.5 text-right font-mono text-xs font-semibold ${isUp ? 'text-gain' : 'text-loss'}`}>
                          {isUp ? '+' : ''}{live.changePercent}%
                        </td>
                        <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => toggleWatchlist(sym)}
                            className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Remove from watchlist"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>

          {/* Active Positions Table */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 flex flex-col flex-1 min-h-[250px] overflow-hidden">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Portfolio Positions</h3>
            <div className="flex-1 overflow-y-auto pr-1">
              {portfolio.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-10 gap-2">
                  <Info size={24} />
                  <span>No active positions</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-navy-700 text-[10px] uppercase font-bold text-slate-500 pb-2">
                      <th className="py-1">Symbol</th>
                      <th className="py-1 text-right">Holding</th>
                      <th className="py-1 text-right">Return</th>
                      <th className="py-1 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map(pos => {
                      const live = livePrices[pos.symbol] || { price: pos.buyPrice, changePercent: 0 };
                      const val = pos.qty * live.price;
                      const returnVal = val - (pos.qty * pos.buyPrice);
                      const returnPercent = ((live.price - pos.buyPrice) / pos.buyPrice) * 100;
                      return (
                        <tr 
                          key={pos.symbol}
                          onClick={() => selectStock(pos.symbol)}
                          className="border-b border-navy-700/40 hover:bg-slate-800/40 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5">
                            <span className="font-bold text-slate-200 font-mono text-sm">{pos.symbol}</span>
                            <div className="text-[10px] text-slate-500">Avg: ${pos.buyPrice}</div>
                          </td>
                          <td className="py-2.5 text-right font-mono text-xs">
                            <span className="font-semibold block text-slate-200">{pos.qty} shares</span>
                            <span className="text-slate-500 block">${val.toLocaleString([], { maximumFractionDigits: 2 })}</span>
                          </td>
                          <td className={`py-2.5 text-right font-mono text-xs font-semibold ${returnVal >= 0 ? 'text-gain' : 'text-loss'}`}>
                            <span className="block">{returnVal >= 0 ? '+' : ''}${returnVal.toFixed(2)}</span>
                            <span className="block font-normal text-[10px]">{returnVal >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%</span>
                          </td>
                          <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1">
                              <button 
                                onClick={() => handleOpenEditPosition(pos)}
                                className="text-slate-500 hover:text-blue-400 p-0.5 rounded transition-colors"
                                title="Edit Position"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button 
                                onClick={() => handleDeletePosition(pos.symbol)}
                                className="text-slate-500 hover:text-rose-500 p-0.5 rounded transition-colors"
                                title="Remove Position"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </article>

        </section>

        {/* === CENTER COLUMN: DETAILED ANALYSIS & CHARTS === */}
        <section className="xl:col-span-2 flex flex-col gap-6 h-full">
          
          {/* Main Active Stock Stats Banner */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleWatchlist(activeStock)}
                className={`p-1.5 rounded transition-colors border ${watchlist.includes(activeStock) ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 'text-slate-500 border-navy-700 hover:text-slate-300'}`}
                title={watchlist.includes(activeStock) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                ★
              </button>
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-extrabold text-white font-mono tracking-tight">{activeStock}</h2>
                  <span className="text-sm text-slate-400 truncate max-w-[200px]">{activeStockMeta.name}</span>
                  <span className="text-[10px] text-slate-500 bg-navy-900 border border-navy-700 px-2 py-0.5 rounded uppercase font-semibold">
                    {activeStockMeta.sector}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Data feed sourced via {settings.mode === 'live' ? 'Finnhub Live Quote' : 'Simulated Random Walk'}</p>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-right">LAST TRADED PRICE</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">${currentLiveMeta.price.toFixed(2)}</span>
                  <span className={`font-mono text-sm font-bold flex items-center ${currentLiveMeta.changePercent >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {currentLiveMeta.changePercent >= 0 ? '+' : ''}{currentLiveMeta.changePercent}%
                    {currentLiveMeta.changePercent >= 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-8 border-l border-navy-700 pl-6 pr-2">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Bid / Ask Spread</span>
                <span className="font-mono text-xs font-semibold text-slate-200 mt-1 block">
                  ${currentLiveMeta.bid?.toFixed(2)} / ${currentLiveMeta.ask?.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Daily High / Low</span>
                <span className="font-mono text-xs font-semibold text-slate-200 mt-1 block">
                  ${currentLiveMeta.high?.toFixed(2)} / ${currentLiveMeta.low?.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Total Volume</span>
                <span className="font-mono text-xs font-semibold text-slate-200 mt-1 block">
                  {currentLiveMeta.volume?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </article>

          {/* Interactive Multi-indicator Chart Panel */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 flex flex-col flex-1 min-h-[500px]">
            
            {/* Chart controls toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-navy-700/60">
              
              {/* Timeframes */}
              <div className="flex bg-navy-900 border border-navy-700 p-0.5 rounded-lg">
                {['1D', '1W', '1M', '3M', '1Y', '5Y'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => { setTimeframe(tf); setComparisonStock(null); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${timeframe === tf ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Styles */}
              <div className="flex bg-navy-900 border border-navy-700 p-0.5 rounded-lg">
                <button
                  onClick={() => { setChartType('line'); setUseTVChart(false); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${!useTVChart && chartType === 'line' ? 'bg-navy-800 text-slate-100 border border-navy-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                  disabled={comparisonStock !== null}
                  title={comparisonStock ? 'Line forced for comparison mode' : 'Line Area Chart'}
                >
                  Line
                </button>
                <button
                  onClick={() => { setChartType('candlestick'); setUseTVChart(false); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${!useTVChart && chartType === 'candlestick' ? 'bg-navy-800 text-slate-100 border border-navy-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                  disabled={comparisonStock !== null}
                  title={comparisonStock ? 'Line forced for comparison mode' : 'Candlestick Chart'}
                >
                  Candle
                </button>
                <button
                  onClick={() => { setUseTVChart(true); setComparisonStock(null); }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${useTVChart ? 'bg-blue-600 text-white border border-blue-500/50 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Embed full TradingView Advanced Chart"
                >
                  <span>📊</span>
                  <span>TradingView</span>
                </button>
              </div>

              {/* Technical Indicator Toggles */}
              <div className="flex bg-navy-900 border border-navy-700 p-0.5 rounded-lg items-center px-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 border-r border-navy-700">Indicators</span>
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, ma20: !prev.ma20 }))}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${indicators.ma20 ? 'text-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  MA-20
                </button>
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, ma50: !prev.ma50 }))}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${indicators.ma50 ? 'text-orange-400 bg-orange-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  MA-50
                </button>
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, rsi: !prev.rsi }))}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${indicators.rsi ? 'text-purple-400 bg-purple-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  RSI
                </button>
                <button
                  onClick={() => setIndicators(prev => ({ ...prev, macd: !prev.macd }))}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${indicators.macd ? 'text-amber-400 bg-amber-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  MACD
                </button>
              </div>

              {/* Compare Overlay Search */}
              <div className="relative">
                <div className="flex items-center bg-navy-900 border border-navy-700 rounded-lg px-2 py-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pr-1">VS</span>
                  <input
                    type="text"
                    placeholder="Compare symbol..."
                    value={compQuery}
                    onChange={handleCompSearchChange}
                    className="bg-transparent border-none text-xs text-slate-200 outline-none w-28 placeholder:text-slate-600 focus:ring-0 py-0"
                  />
                  {comparisonStock ? (
                    <button 
                      onClick={() => setComparisonStock(null)}
                      className="text-rose-400 hover:text-rose-300 p-0.5 rounded ml-1"
                    >
                      <X size={10} />
                    </button>
                  ) : null}
                </div>
                {compResults.length > 0 && (
                  <div className="glass-panel-heavy absolute top-full right-0 mt-1.5 w-48 rounded-lg shadow-xl border border-navy-600 overflow-hidden z-50">
                    {compResults.map(stock => (
                      <div
                        key={stock.symbol}
                        onClick={() => selectComparison(stock.symbol)}
                        className="px-3 py-2 hover:bg-slate-800 cursor-pointer flex justify-between items-center text-xs border-b border-navy-700/50 last:border-b-0"
                      >
                        <span className="font-bold text-blue-400 font-mono">{stock.symbol}</span>
                        <span className="text-slate-500 text-[10px] truncate max-w-[80px]">{stock.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main price/comparison visualization */}
            <div className="flex-1 min-h-[300px] w-full relative">
              {loading && (
                <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-xs flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="animate-spin text-blue-500" size={32} />
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading historical feed...</span>
                  </div>
                </div>
              )}

              {/* TradingView Embedded Chart */}
              {useTVChart ? (
                <div className="h-full w-full rounded-lg overflow-hidden" style={{ minHeight: '420px' }}>
                  <TradingViewChart
                    symbol={activeStock}
                    activeMarket={activeMarket}
                    timeframe={timeframe}
                  />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No historical data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    
                    {comparisonStock ? (
                      // Normalized % Change Y-Axis (Comparison Mode)
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        domain={['auto', 'auto']}
                        tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                        tickLine={false}
                        axisLine={false}
                        orientation="right"
                      />
                    ) : (
                      // Dollar Value Y-Axis (Single Stock Mode)
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        domain={['auto', 'auto']}
                        tickFormatter={(v) => `$${v}`}
                        tickLine={false}
                        axisLine={false}
                        orientation="right"
                      />
                    )}
                    
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ fontSize: '12px' }}
                      formatter={(value, name, props) => {
                        if (name === `${activeStock} (%)` || name === `${comparisonStock} (%)`) {
                          const rawVal = name === `${activeStock} (%)` ? props.payload.closeRaw : props.payload.compCloseRaw;
                          return [`${value > 0 ? '+' : ''}${value}% ($${rawVal.toFixed(2)})`, name];
                        }
                        return [`$${value.toFixed(2)}`, name];
                      }}
                    />
                    
                    {comparisonStock ? (
                      // Render comparison percentage lines
                      <>
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        <Line
                          type="monotone"
                          dataKey={`${activeStock} (%)`}
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={`${comparisonStock} (%)`}
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                      </>
                    ) : (
                      // Render single stock (Line Area or Candlestick)
                      <>
                        {chartType === 'line' ? (
                          <>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartData[chartData.length - 1]?.close >= chartData[0]?.close ? '#10b981' : '#ef4444'} stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="close"
                              stroke={chartData[chartData.length - 1]?.close >= chartData[0]?.close ? '#10b981' : '#ef4444'}
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorPrice)"
                              name="Close Price"
                            />
                          </>
                        ) : (
                          // Candlestick bar mapping
                          <Bar 
                            dataKey="close" 
                            shape={<CustomCandlestick />}
                            name="Price Candle"
                          />
                        )}
                        
                        {/* Moving Average Indicators */}
                        {indicators.ma20 && (
                          <Line
                            type="monotone"
                            dataKey="ma20"
                            stroke="#3b82f6"
                            strokeWidth={1.5}
                            dot={false}
                            name="MA (20)"
                            strokeOpacity={0.8}
                          />
                        )}
                        {indicators.ma50 && (
                          <Line
                            type="monotone"
                            dataKey="ma50"
                            stroke="#f59e0b"
                            strokeWidth={1.5}
                            dot={false}
                            name="MA (50)"
                            strokeOpacity={0.8}
                          />
                        )}
                      </>
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Volume sub-chart panel */}
            <div className="h-16 border-t border-navy-700/50 pt-2 mt-2 w-full">
              {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 0, right: 5, left: -10, bottom: 0 }}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Bar 
                      dataKey="volume" 
                      fill="#334155" 
                      opacity={0.4}
                      name="Volume"
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;
                        const color = (payload.close >= payload.open) ? '#10b981' : '#ef4444';
                        return <rect x={x} y={y} width={width} height={height} fill={color} opacity={0.3} />;
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Secondary Panel: RSI (Collapse/Expand) */}
            {indicators.rsi && chartData.length > 0 && (
              <div className="h-28 border-t border-navy-700/50 pt-3 mt-3 w-full">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">RSI (14) Indicator</span>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="#475569" fontSize={9} ticks={[30, 50, 70]} orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Overbought', fill: '#ef4444', fontSize: 8, position: 'insideTopRight' }} />
                    <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Oversold', fill: '#10b981', fontSize: 8, position: 'insideBottomRight' }} />
                    <Line type="monotone" dataKey="rsi" stroke="#a855f7" strokeWidth={1.5} dot={false} name="RSI" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Secondary Panel: MACD (Collapse/Expand) */}
            {indicators.macd && chartData.length > 0 && (
              <div className="h-28 border-t border-navy-700/50 pt-3 mt-3 w-full">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">MACD (12, 26, 9)</span>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="time" hide />
                    <YAxis tickLine={false} axisLine={false} stroke="#475569" fontSize={9} orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <ReferenceLine y={0} stroke="#475569" />
                    <Bar dataKey="macdHist" fill="#38bdf8" shape={(props) => {
                      const { x, y, width, height, value } = props;
                      const fill = value >= 0 ? '#10b981' : '#ef4444';
                      return <rect x={x} y={y} width={width} height={height} fill={fill} opacity={0.5} />;
                    }} name="Histogram" />
                    <Line type="monotone" dataKey="macd" stroke="#f59e0b" strokeWidth={1} dot={false} name="MACD" />
                    <Line type="monotone" dataKey="macdSignal" stroke="#ef4444" strokeWidth={1} dot={false} name="Signal" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

          </article>

        </section>

        {/* === RIGHT COLUMN: SENTIMENT, ALERTS, SECTORS & NEWS === */}
        <section className="xl:col-span-1 flex flex-col gap-6 h-full">
          
          {/* Sentiment Gauge Card */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Market Sentiment ({activeStock})</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={`text-xl font-bold tracking-tight ${sentiment.color}`}>
                  {sentiment.label}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Greed & Fear Score</span>
              </div>
              <div className="relative flex items-center justify-center h-14 w-14 bg-navy-900 border border-navy-700 rounded-full">
                <span className="text-lg font-black text-white font-mono">{sentiment.score}</span>
                <div className="absolute inset-0 rounded-full border border-blue-500/10 border-t-blue-500 animate-spin-slow"></div>
              </div>
            </div>
            
            {/* Speedometer line representation */}
            <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden mt-4 flex">
              <div className="h-full bg-rose-500" style={{ width: '25%' }}></div>
              <div className="h-full bg-yellow-500" style={{ width: '25%' }}></div>
              <div className="h-full bg-emerald-400" style={{ width: '25%' }}></div>
              <div className="h-full bg-emerald-600" style={{ width: '25%' }}></div>
            </div>
            <div className="relative w-full mt-1.5">
              <div 
                className="absolute w-1 h-3 bg-white border border-slate-900 rounded-full transform -translate-x-1/2 -top-3.5 transition-all duration-500"
                style={{ left: `${sentiment.score}%` }}
              ></div>
            </div>
          </article>

          {/* Sector Map Card */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 flex flex-col max-h-[220px]">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Sector Performance</h3>
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
              {sectorPerformance.map(sec => {
                const isUp = sec.change >= 0;
                return (
                  <div key={sec.name} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">{sec.name}</span>
                    <span className={`font-mono font-bold ${isUp ? 'text-gain' : 'text-loss'}`}>
                      {isUp ? '+' : ''}{sec.change}%
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Context-aware Market News Card */}
          <article className="glass-panel rounded-xl p-5 shadow-lg border border-navy-700 flex flex-col flex-1 min-h-[300px] overflow-hidden">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
              <Newspaper size={14} className="text-blue-400" /> Sentiment & News Feed ({activeStock})
            </h3>
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
              {marketNews.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs py-10">
                  No news available
                </div>
              ) : (
                marketNews.map(item => (
                  <a 
                    href="#news" 
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      showToast(`📰 ${item.title}: ${item.summary}`, 'info');
                    }}
                    className="border-b border-navy-700/40 last:border-b-0 pb-3 block group hover:bg-slate-800/20 p-2 rounded transition-all"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mb-1">
                      <span>{item.source}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.sentiment === 'bullish' ? 'bg-emerald-500 glow-green' : item.sentiment === 'bearish' ? 'bg-rose-500 glow-red' : 'bg-yellow-500'}`}></span>
                        <span className="capitalize">{item.sentiment}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <h4 className="text-xs text-slate-200 font-medium leading-normal group-hover:text-blue-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </a>
                ))
              )}
            </div>
          </article>

        </section>

      </main>

      {/* --- SETTINGS MODAL --- */}
      {activeSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel-heavy rounded-xl p-6 w-full max-w-md border border-navy-600 shadow-2xl relative">
            <button 
              onClick={() => setActiveSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-extrabold text-white mb-4">Quantum Settings</h2>
            
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">DATA CONNECTOR MODE</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, mode: 'simulator' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${settings.mode === 'simulator' ? 'bg-blue-600 text-white border-blue-500' : 'bg-navy-900 text-slate-400 border-navy-700 hover:text-slate-200'}`}
                  >
                    Demo Simulator
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, mode: 'live' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${settings.mode === 'live' ? 'bg-blue-600 text-white border-blue-500' : 'bg-navy-900 text-slate-400 border-navy-700 hover:text-slate-200'}`}
                  >
                    Live APIs
                  </button>
                </div>
              </div>

              {settings.mode === 'live' && (
                <div className="flex flex-col gap-4 mt-2 p-3 bg-navy-900 rounded-lg border border-navy-700/60">
                  <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider block">Real-time Keys Required</span>
                  
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Finnhub API Key (Quotes & News)</label>
                    <input
                      type="password"
                      placeholder="Insert Finnhub key..."
                      value={settings.finnhubKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, finnhubKey: e.target.value }))}
                      className="w-full bg-navy-950 border border-navy-700 rounded-md py-1.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <a href="https://finnhub.io/register" target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:underline mt-1 inline-flex items-center gap-0.5">
                      Get free key <ExternalLink size={8} />
                    </a>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Alpha Vantage API Key (Charts)</label>
                    <input
                      type="password"
                      placeholder="Insert Alpha Vantage key..."
                      value={settings.alphaVantageKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, alphaVantageKey: e.target.value }))}
                      className="w-full bg-navy-950 border border-navy-700 rounded-md py-1.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:underline mt-1 inline-flex items-center gap-0.5">
                      Get free key <ExternalLink size={8} />
                    </a>
                  </div>

                  {/* TradingView Key */}
                  <div className="border-t border-navy-700/60 pt-3">
                    <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                      <span>📊</span> TradingView Charting Library Key
                      <span className="text-[9px] text-slate-600 ml-1">(optional)</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter TradingView library key..."
                      value={settings.tradingViewKey || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, tradingViewKey: e.target.value }))}
                      className="w-full bg-navy-950 border border-navy-700 rounded-md py-1.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <a href="https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/" target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:underline inline-flex items-center gap-0.5">
                        Apply for Charting Library <ExternalLink size={8} />
                      </a>
                      <span className="text-[9px] text-slate-500">Free widget works without key</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1.5 leading-relaxed">
                      The embedded TradingView chart (📊 TradingView button in chart panel) works for free using the public widget. A Charting Library key unlocks advanced server-side features.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-500 border-t border-navy-700 pt-3 leading-relaxed">
                The **Demo Simulator** updates quotes, High/Low spreads, bid/ask margins and index trackers every 3 seconds client-side. Live mode queries Finnhub and Alpha Vantage rest endpoints directly.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT PORTFOLIO MODAL --- */}
      {activePositionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel-heavy rounded-xl p-6 w-full max-w-md border border-navy-600 shadow-2xl relative">
            <button 
              onClick={() => setActivePositionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-extrabold text-white mb-4">
              {isEditingPosition ? 'Modify Asset Position' : 'Add New Asset Position'}
            </h2>
            
            <form onSubmit={handleSubmitPosition} className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-xs text-slate-400 block mb-1">TICKER SYMBOL</label>
                <input
                  type="text"
                  placeholder="e.g. AAPL"
                  value={inputPosition.symbol}
                  disabled={isEditingPosition}
                  onChange={(e) => setInputPosition(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">QUANTITY (SHARES)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 10"
                    value={inputPosition.qty}
                    onChange={(e) => setInputPosition(prev => ({ ...prev, qty: e.target.value }))}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">AVG PURCHASE PRICE ($)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 175.50"
                    value={inputPosition.buyPrice}
                    onChange={(e) => setInputPosition(prev => ({ ...prev, buyPrice: e.target.value }))}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow-md mt-2 transition-colors"
              >
                {isEditingPosition ? 'Update Position' : 'Submit Purchase'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- PRICE ALERT MODAL --- */}
      {activeAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel-heavy rounded-xl p-6 w-full max-w-lg border border-navy-600 shadow-2xl relative">
            <button 
              onClick={() => setActiveAlertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-extrabold text-white mb-4">Set Threshold Price Alert</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Alert Setup Form */}
              <form onSubmit={handleAddAlert} className="flex flex-col gap-4 text-sm">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">STOCK TICKER</label>
                  <input
                    type="text"
                    value={inputAlert.symbol}
                    onChange={(e) => setInputAlert(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 uppercase font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">CONDITION</label>
                    <select
                      value={inputAlert.condition}
                      onChange={(e) => setInputAlert(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="above">Price Above</option>
                      <option value="below">Price Below</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">TARGET PRICE ($)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 195"
                      value={inputAlert.target}
                      onChange={(e) => setInputAlert(prev => ({ ...prev, target: e.target.value }))}
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold py-2.5 rounded-lg shadow-md mt-2 transition-colors"
                >
                  Create Alert
                </button>
              </form>

              {/* Active Alerts List */}
              <div className="border-t md:border-t-0 md:border-l border-navy-700/60 pt-4 md:pt-0 md:pl-6 flex flex-col overflow-hidden max-h-[300px]">
                <h3 className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Active Alerts</h3>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                  {alerts.length === 0 ? (
                    <div className="text-[11px] text-slate-500 py-6 text-center">No alerts configured</div>
                  ) : (
                    alerts.map(a => (
                      <div key={a.id} className="flex justify-between items-center bg-navy-900/60 border border-navy-700/50 rounded-lg p-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${a.active ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></span>
                          <div>
                            <span className="font-bold text-slate-200 font-mono">{a.symbol}</span>
                            <span className="text-slate-400 font-mono ml-1.5">{a.condition === 'above' ? '≥' : '≤'} ${a.target}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAlertStatus(a.id)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${a.active ? 'bg-blue-950 text-blue-300' : 'bg-slate-800 text-slate-500'}`}
                          >
                            {a.active ? 'Active' : 'Muted'}
                          </button>
                          <button
                            onClick={() => handleDeleteAlert(a.id)}
                            className="text-slate-500 hover:text-rose-500 p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
