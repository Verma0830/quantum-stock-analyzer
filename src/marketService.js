// Supported Stock Tickers with basic metadata
export const STOCKS_DIRECTORY = [
  // Indian stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2950.00, vol: 0.012, trend: 0.0004, sector: 'Energy', volume: 5000000, tvSymbol: 'BSE:RELIANCE', growwUrl: 'https://groww.in/stocks/reliance-industries-ltd', market: 'indian' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3850.00, vol: 0.011, trend: 0.0003, sector: 'Technology', volume: 2000000, tvSymbol: 'BSE:TCS', growwUrl: 'https://groww.in/stocks/tata-consultancy-services-ltd', market: 'indian' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', price: 1680.00, vol: 0.013, trend: 0.0003, sector: 'Financials', volume: 8000000, tvSymbol: 'BSE:HDFCBANK', growwUrl: 'https://groww.in/stocks/hdfc-bank-ltd', market: 'indian' },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1540.00, vol: 0.014, trend: 0.0002, sector: 'Technology', volume: 4000000, tvSymbol: 'BSE:INFY', growwUrl: 'https://groww.in/stocks/infosys-ltd', market: 'indian' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', price: 960.00, vol: 0.022, trend: 0.0006, sector: 'Consumer Cyclical', volume: 7000000, tvSymbol: 'BSE:TATAMOTORS', growwUrl: 'https://groww.in/stocks/tata-motors-ltd', market: 'indian' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', price: 1150.00, vol: 0.014, trend: 0.0004, sector: 'Financials', volume: 6000000, tvSymbol: 'BSE:ICICIBANK', growwUrl: 'https://groww.in/stocks/icici-bank-ltd', market: 'indian' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 840.00, vol: 0.016, trend: 0.0003, sector: 'Financials', volume: 10000000, tvSymbol: 'BSE:SBIN', growwUrl: 'https://groww.in/stocks/state-bank-of-india', market: 'indian' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', price: 1420.00, vol: 0.015, trend: 0.0005, sector: 'Telecommunications', volume: 3000000, tvSymbol: 'BSE:BHARTIARTL', growwUrl: 'https://groww.in/stocks/bharti-airtel-ltd', market: 'indian' },
  { symbol: 'ITC', name: 'ITC Limited', price: 430.00, vol: 0.010, trend: 0.0002, sector: 'Consumer Defensive', volume: 12000000, tvSymbol: 'BSE:ITC', growwUrl: 'https://groww.in/stocks/itc-ltd', market: 'indian' },
  { symbol: 'LT', name: 'Larsen & Toubro Limited', price: 3550.00, vol: 0.013, trend: 0.0004, sector: 'Industrials', volume: 1500000, tvSymbol: 'BSE:LT', growwUrl: 'https://groww.in/stocks/larsen-toubro-ltd', market: 'indian' },
  { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES', price: 260.00, vol: 0.008, trend: 0.0002, sector: 'Index', volume: 5000000, tvSymbol: 'BSE:NIFTYBEES', growwUrl: 'https://groww.in/stocks/nippon-india-etf-nifty-bees', market: 'indian' },
  { symbol: 'NIFTY', name: 'NIFTY 50 Index', price: 23750.00, vol: 0.006, trend: 0.0002, sector: 'Index', volume: 20000000, tvSymbol: 'BSE:NIFTYBEES', growwUrl: 'https://groww.in/indices/nifty-50', market: 'indian' },

  // International (US) stocks
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.50, vol: 0.015, trend: 0.0002, sector: 'Technology', volume: 52000000, tvSymbol: 'NASDAQ:AAPL', growwUrl: 'https://groww.in/us-stocks/apple-inc', market: 'international' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 420.30, vol: 0.013, trend: 0.0003, sector: 'Technology', volume: 22000000, tvSymbol: 'NASDAQ:MSFT', growwUrl: 'https://groww.in/us-stocks/microsoft-corp', market: 'international' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 895.00, vol: 0.032, trend: 0.0012, sector: 'Technology', volume: 45000000, tvSymbol: 'NASDAQ:NVDA', growwUrl: 'https://groww.in/us-stocks/nvidia-corp', market: 'international' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 172.40, vol: 0.016, trend: 0.0002, sector: 'Technology', volume: 28000000, tvSymbol: 'NASDAQ:GOOGL', growwUrl: 'https://groww.in/us-stocks/alphabet-inc', market: 'international' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 180.10, vol: 0.018, trend: 0.0003, sector: 'Consumer Discretionary', volume: 35000000, tvSymbol: 'NASDAQ:AMZN', growwUrl: 'https://groww.in/us-stocks/amazon-com-inc', market: 'international' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 475.20, vol: 0.022, trend: 0.0005, sector: 'Technology', volume: 18000000, tvSymbol: 'NASDAQ:META', growwUrl: 'https://groww.in/us-stocks/meta-platforms-inc', market: 'international' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.60, vol: 0.032, trend: -0.0002, sector: 'Consumer Discretionary', volume: 82000000, tvSymbol: 'NASDAQ:TSLA', growwUrl: 'https://groww.in/us-stocks/tesla-inc', market: 'international' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 158.40, vol: 0.028, trend: 0.0004, sector: 'Technology', volume: 61000000, tvSymbol: 'NASDAQ:AMD', growwUrl: 'https://groww.in/us-stocks/advanced-micro-devices-inc', market: 'international' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 612.80, vol: 0.020, trend: 0.0004, sector: 'Communication Services', volume: 4000000, tvSymbol: 'NASDAQ:NFLX', growwUrl: 'https://groww.in/us-stocks/netflix-inc', market: 'international' },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', price: 224.50, vol: 0.048, trend: 0.0009, sector: 'Financials', volume: 12000000, tvSymbol: 'NASDAQ:COIN', growwUrl: 'https://groww.in/us-stocks/coinbase-global-inc', market: 'international' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 522.40, vol: 0.008, trend: 0.0001, sector: 'Index', volume: 75000000, tvSymbol: 'AMEX:SPY', growwUrl: 'https://groww.in/us-stocks/spdr-s-p-500-etf-trust', market: 'international' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 442.80, vol: 0.012, trend: 0.0002, sector: 'Index', volume: 48000000, tvSymbol: 'NASDAQ:QQQ', growwUrl: 'https://groww.in/us-stocks/invesco-qqq-trust', market: 'international' },

  // Crypto market
  { symbol: 'BTC', name: 'Bitcoin', price: 63450.00, vol: 0.035, trend: 0.0008, sector: 'Cryptocurrency', volume: 28000000000, tvSymbol: 'BINANCE:BTCUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.00, vol: 0.040, trend: 0.0006, sector: 'Cryptocurrency', volume: 15000000000, tvSymbol: 'BINANCE:ETHUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'SOL', name: 'Solana', price: 148.20, vol: 0.065, trend: 0.0015, sector: 'Cryptocurrency', volume: 3000000000, tvSymbol: 'BINANCE:SOLUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'BNB', name: 'BNB', price: 575.40, vol: 0.038, trend: 0.0005, sector: 'Cryptocurrency', volume: 1200000000, tvSymbol: 'BINANCE:BNBUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'ADA', name: 'Cardano', price: 0.48, vol: 0.052, trend: -0.0002, sector: 'Cryptocurrency', volume: 400000000, tvSymbol: 'BINANCE:ADAUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'XRP', name: 'Ripple', price: 0.52, vol: 0.045, trend: 0.0001, sector: 'Cryptocurrency', volume: 800000000, tvSymbol: 'BINANCE:XRPUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.14, vol: 0.085, trend: 0.0010, sector: 'Cryptocurrency', volume: 1500000000, tvSymbol: 'BINANCE:DOGEUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'DOT', name: 'Polkadot', price: 6.20, vol: 0.058, trend: -0.0004, sector: 'Cryptocurrency', volume: 200000000, tvSymbol: 'BINANCE:DOTUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'MATIC', name: 'Polygon', price: 0.65, vol: 0.062, trend: 0.0002, sector: 'Cryptocurrency', volume: 250000000, tvSymbol: 'BINANCE:MATICUSDT', growwUrl: '', market: 'crypto' },
  { symbol: 'LINK', name: 'Chainlink', price: 14.80, vol: 0.058, trend: 0.0006, sector: 'Cryptocurrency', volume: 350000000, tvSymbol: 'BINANCE:LINKUSDT', growwUrl: '', market: 'crypto' }
];

// Helper to find stock metadata
export const getStockMeta = (symbol) => {
  const normSym = symbol.toUpperCase().trim();
  const found = STOCKS_DIRECTORY.find(s => s.symbol === normSym);
  if (found) return found;
  
  // Autoguess crypto vs US vs Indian
  const isCrypto = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'XRP', 'DOGE', 'DOT', 'MATIC', 'LINK', 'LTC', 'AVAX', 'TRX', 'UNI'].includes(normSym) || normSym.endsWith('USDT') || normSym.endsWith('USD');
  const isUS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'AMD', 'NFLX', 'COIN', 'SPY', 'QQQ', 'INTC', 'JPM', 'BAC', 'DIS'].includes(normSym) || (normSym.length <= 4 && !isCrypto);
  
  if (isCrypto) {
    const cleanSym = normSym.replace('USDT', '').replace('USD', '');
    return {
      symbol: normSym,
      name: `${cleanSym} Cryptocurrency`,
      price: 1.00,
      vol: 0.05,
      trend: 0.0005,
      sector: 'Cryptocurrency',
      volume: 100000000,
      tvSymbol: `BINANCE:${cleanSym}USDT`,
      growwUrl: '',
      market: 'crypto'
    };
  } else if (isUS) {
    return {
      symbol: normSym,
      name: `${normSym} Corporation`,
      price: 100.00,
      vol: 0.015,
      trend: 0.0003,
      sector: 'Technology',
      volume: 10000000,
      tvSymbol: `NASDAQ:${normSym}`,
      growwUrl: `https://groww.in/us-stocks/${normSym.toLowerCase()}`,
      market: 'international'
    };
  } else {
    // Default to Indian Stock
    return {
      symbol: normSym,
      name: `${normSym} Limited`,
      price: 500.00,
      vol: 0.02,
      trend: 0.0002,
      sector: 'Technology',
      volume: 5000000,
      tvSymbol: `BSE:${normSym}`,
      growwUrl: `https://groww.in/stocks/${normSym.toLowerCase()}`,
      market: 'indian'
    };
  }
};

// TECHNICAL INDICATORS CALCULATION ENGINES

// Simple Moving Average
const calculateSMA = (data, period) => {
  return data.map((d, index) => {
    if (index < period - 1) return null;
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[index - i].close;
    }
    return parseFloat((sum / period).toFixed(2));
  });
};

// Exponential Moving Average
const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  let ema = [];
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sum += data[i].close;
      ema.push(null);
    } else if (i === period - 1) {
      sum += data[i].close;
      ema.push(sum / period);
    } else {
      const nextVal = (data[i].close - ema[i - 1]) * k + ema[i - 1];
      ema.push(nextVal);
    }
  }
  return ema;
};

// Helper EMA of raw array
const calculateEMAOfArray = (arr, period) => {
  const k = 2 / (period + 1);
  let ema = [];
  let sum = 0;
  let count = 0;
  let startIndex = -1;
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null || arr[i] === undefined) {
      ema.push(null);
      continue;
    }
    if (startIndex === -1) startIndex = i;
    count++;
    if (count < period) {
      sum += arr[i];
      ema.push(null);
    } else if (count === period) {
      sum += arr[i];
      ema.push(sum / period);
    } else {
      const prevVal = ema[i - 1];
      if (prevVal === null) {
        ema.push(arr[i]); // Safeguard
      } else {
        const nextVal = (arr[i] - prevVal) * k + prevVal;
        ema.push(nextVal);
      }
    }
  }
  return ema;
};

// Relative Strength Index (RSI-14)
const calculateRSI = (data, period = 14) => {
  let rsi = Array(data.length).fill(50); // baseline neutral
  if (data.length <= period) return rsi;

  let gains = [];
  let losses = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) {
    rsi[period] = 100;
  } else {
    let rs = avgGain / avgLoss;
    rsi[period] = parseFloat((100 - 100 / (1 + rs)).toFixed(2));
  }

  for (let i = period + 1; i < data.length; i++) {
    const currentGain = gains[i - 1];
    const currentLoss = losses[i - 1];

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi[i] = parseFloat((100 - 100 / (1 + rs)).toFixed(2));
    }
  }
  return rsi;
};

// MACD (12, 26, 9)
const calculateMACD = (data) => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  const macdLine = data.map((_, i) => {
    if (ema12[i] === null || ema26[i] === null) return null;
    return parseFloat((ema12[i] - ema26[i]).toFixed(4));
  });

  const signalLine = calculateEMAOfArray(macdLine, 9);
  
  const macdHist = macdLine.map((val, i) => {
    if (val === null || signalLine[i] === null) return null;
    return parseFloat((val - signalLine[i]).toFixed(4));
  });

  return {
    line: macdLine.map(v => v === null ? 0 : v),
    signal: signalLine.map(v => v === null ? 0 : v),
    hist: macdHist.map(v => v === null ? 0 : v)
  };
};

// HISTORICAL DATA GENERATION ENGINE
export const generateHistoricalData = (symbol, timeframe = '1M', currentLivePrice = null) => {
  const meta = getStockMeta(symbol);
  
  // Choose count of data points
  let points = 30;
  let intervalMs = 24 * 60 * 60 * 1000; // 1 day
  let dateUnit = 'day';

  switch (timeframe) {
    case '1D':
      points = 78; // 6.5 hours of trading at 5 min intervals
      intervalMs = 5 * 60 * 1000;
      dateUnit = 'minute';
      break;
    case '1W':
      points = 35; // 7 hours/day * 5 days at 1 hour intervals
      intervalMs = 60 * 60 * 1000;
      dateUnit = 'hour';
      break;
    case '1M':
      points = 30;
      intervalMs = 24 * 60 * 60 * 1000;
      dateUnit = 'day';
      break;
    case '3M':
      points = 90;
      intervalMs = 24 * 60 * 60 * 1000;
      dateUnit = 'day';
      break;
    case '1Y':
      points = 250; // trading days
      intervalMs = 24 * 60 * 60 * 1000;
      dateUnit = 'day';
      break;
    case '5Y':
      points = 260; // weekly intervals
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      dateUnit = 'week';
      break;
  }

  // Pre-generate historical stock walk
  let data = [];
  const basePrice = currentLivePrice || meta.price;
  
  // Work backward from current date
  let now = new Date();
  let prices = [];
  
  let tempPrice = basePrice;
  // Volatility scaling based on timeframe
  const stepVol = meta.vol * (intervalMs / (24 * 60 * 60 * 1000))**0.5;

  for (let i = 0; i < points; i++) {
    prices.unshift(tempPrice);
    
    // Reverse random walk with trend reversal
    const changePercent = (Math.random() - 0.52 + meta.trend) * stepVol; // slight bias downward going backward (upward going forward)
    tempPrice = tempPrice / (1 + changePercent);
  }

  // Build candle data going forward
  let currentTimestamp = now.getTime() - points * intervalMs;
  for (let i = 0; i < points; i++) {
    const close = prices[i];
    const prevClose = i > 0 ? prices[i - 1] : close * 0.99;
    
    // Make OHL values realistic
    const open = prevClose;
    const maxChange = close * stepVol * 1.5;
    const high = Math.max(open, close) + Math.random() * maxChange;
    const low = Math.min(open, close) - Math.random() * maxChange;
    const volume = Math.round(meta.volume / points * (0.5 + Math.random() * 1.5));
    
    // Format timestamp nicely
    let formattedDate = '';
    const dateObj = new Date(currentTimestamp);
    if (dateUnit === 'minute' || dateUnit === 'hour') {
      formattedDate = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: timeframe === '5Y' || timeframe === '1Y' ? '2-digit' : undefined });
    }

    data.push({
      time: formattedDate,
      timestamp: currentTimestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });

    currentTimestamp += intervalMs;
  }

  // Calculate Indicators
  const ma20 = calculateSMA(data, 20);
  const ma50 = calculateSMA(data, 50);
  const rsi = calculateRSI(data, 14);
  const macd = calculateMACD(data);

  // Merge indicators into dataset
  return data.map((d, index) => ({
    ...d,
    ma20: ma20[index],
    ma50: ma50[index],
    rsi: rsi[index],
    macd: macd.line[index],
    macdSignal: macd.signal[index],
    macdHist: macd.hist[index]
  }));
};

// LIVE UPDATE SIMULATOR
export const getLiveTick = (symbol, lastPrice, lastVol = 0) => {
  const meta = getStockMeta(symbol);
  
  // Volatility walk
  const drift = meta.trend || 0.0001;
  const deviation = meta.vol || 0.02;
  const changePercent = (Math.random() - 0.495 + drift) * (deviation * 0.05); // micro ticks
  const newPrice = lastPrice * (1 + changePercent);
  
  const dailyHigh = Math.max(meta.price * 1.05, newPrice);
  const dailyLow = Math.min(meta.price * 0.95, newPrice);

  const spread = parseFloat((newPrice * 0.0008).toFixed(2)); // 0.08% spread
  const bid = parseFloat((newPrice - spread / 2).toFixed(2));
  const ask = parseFloat((newPrice + spread / 2).toFixed(2));
  
  // Tick volume
  const tickVol = Math.round(500 + Math.random() * 4500);
  const accumVol = (lastVol || meta.volume) + tickVol;

  return {
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat((newPrice - meta.price).toFixed(2)),
    changePercent: parseFloat(((newPrice - meta.price) / meta.price * 100).toFixed(2)),
    bid,
    ask,
    high: parseFloat(dailyHigh.toFixed(2)),
    low: parseFloat(dailyLow.toFixed(2)),
    volume: accumVol,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
};

// MARKET SECTOR HEATMAP DATA
export const generateSectorPerformance = () => {
  const sectors = [
    { name: 'Technology', change: 1.45, status: 'up' },
    { name: 'Financials', change: -0.22, status: 'down' },
    { name: 'Healthcare', change: 0.15, status: 'up' },
    { name: 'Energy', change: -1.10, status: 'down' },
    { name: 'Consumer Cyclical', change: 0.85, status: 'up' },
    { name: 'Industrials', change: 0.34, status: 'up' },
    { name: 'Utilities', change: -0.45, status: 'down' }
  ];

  return sectors.map(sec => {
    // Micro adjustments for live feeling
    const wiggle = (Math.random() - 0.5) * 0.15;
    const newChange = parseFloat((sec.change + wiggle).toFixed(2));
    return {
      ...sec,
      change: newChange,
      status: newChange >= 0 ? 'up' : 'down'
    };
  });
};

// NEWS GENERATOR ENGINE
const NEWS_TEMPLATES = [
  { text: "reports stronger than expected earnings in Q1, shares advance on NSE", sentiment: 'bullish' },
  { text: "announces new multi-million dollar cloud services contract, boosting IT sector sentiment", sentiment: 'bullish' },
  { text: "upgraded by Kotak Institutional Equities to Buy, target price raised", sentiment: 'bullish' },
  { text: "RBI monetary policy stance seen positive for banking shares, leading to gains", sentiment: 'bullish' },
  { text: "expands footprint with key acquisitions in foreign markets", sentiment: 'bullish' },
  { text: "faces margin compression due to rising raw material input costs", sentiment: 'bearish' },
  { text: "SEBI opens enquiry regarding options trading volumes and retail disclosures", sentiment: 'bearish' },
  { text: "downgraded to Sell by ICICI Securities on growth moderation concerns", sentiment: 'bearish' },
  { text: "insider reports show promoters trimming stake, shares drop on high volume", sentiment: 'bearish' },
  { text: "announces restructuring plan, aiming to optimize capital allocation", sentiment: 'neutral' },
  { text: "CEO details upcoming green energy transition strategies at corporate AGMs", sentiment: 'neutral' },
  { text: "maintains market leadership amid rising domestic competition in consumer sectors", sentiment: 'neutral' }
];

export const generateMarketNews = (symbol = null) => {
  let list = [];
  const activeSymbol = symbol ? symbol.toUpperCase().trim() : null;
  const targetTickers = activeSymbol ? [activeSymbol] : STOCKS_DIRECTORY.map(s => s.symbol);

  // Generate 8 articles
  for (let i = 0; i < 8; i++) {
    const ticker = targetTickers[Math.floor(Math.random() * targetTickers.length)];
    const meta = getStockMeta(ticker);
    const template = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
    
    // Timestamp within last 12 hours
    const minutesAgo = Math.floor(i * 90 + Math.random() * 45);
    const date = new Date(Date.now() - minutesAgo * 60 * 1000);

    list.push({
      id: `${ticker}-${i}-${minutesAgo}`,
      ticker: ticker,
      title: `${meta.name} (${ticker}) ${template.text}`,
      source: ["Moneycontrol", "Livemint", "Economic Times", "BloombergQuint", "Reuters India", "CNBC-TV18"][Math.floor(Math.random() * 6)],
      time: minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo/60)}h ago`,
      timestamp: date.getTime(),
      sentiment: template.sentiment,
      summary: `Indian market analysts note that this development for ${meta.name} could influence F&O options volumes and NSE/BSE volatility. Retail traders are tracking key support levels.`
    });
  }

  // Sort by newest
  return list.sort((a, b) => b.timestamp - a.timestamp);
};

// MARKET SENTIMENT SPEEDOMETER
export const calculateSentiment = (symbol) => {
  // Return consistent but wiggling sentiment per stock
  const meta = getStockMeta(symbol);
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Calculate baseline sentiment (40 to 85)
  let base = 50 + (hash % 35);
  if (meta.trend > 0) base += 10;
  if (meta.trend < 0) base -= 15;
  
  // Add live wiggle
  const wiggle = Math.round((Math.random() - 0.5) * 6);
  const score = Math.max(10, Math.min(95, base + wiggle));

  let label = "Neutral";
  let color = "text-yellow-500";
  if (score > 75) {
    label = "Extreme Greed";
    color = "text-emerald-500";
  } else if (score > 55) {
    label = "Greed";
    color = "text-emerald-400";
  } else if (score < 25) {
    label = "Extreme Fear";
    color = "text-rose-500";
  } else if (score < 45) {
    label = "Fear";
    color = "text-rose-400";
  }

  return { score, label, color };
};

// LIVE API GATEWAY WRAPPER (Finnhub & Alpha Vantage)
export const fetchLiveAPIQuote = async (symbol, token) => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${token}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Finnhub Quote API failed: ${response.statusText}`);
  const data = await response.json();
  
  // Map Finnhub fields: c=current, d=change, dp=change percent, h=high, l=low, o=open, pc=prev close
  if (!data.c) throw new Error("No data returned for ticker " + symbol);
  return {
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    prevClose: data.pc,
    volume: 0, // Quote doesn't return vol, we can fetch from basic profile
    bid: parseFloat((data.c * 0.999).toFixed(2)),
    ask: parseFloat((data.c * 1.001).toFixed(2)),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
};

export const fetchLiveAPINews = async (symbol, token) => {
  const today = new Date().toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol.toUpperCase()}&from=${lastWeek}&to=${today}&token=${token}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Finnhub News API failed: ${response.statusText}`);
  const data = await response.json();
  
  return data.slice(0, 10).map(item => {
    // Basic sentiment heuristic
    const titleLower = item.headline.toLowerCase();
    let sentiment = 'neutral';
    if (titleLower.includes('upgrade') || titleLower.includes('beat') || titleLower.includes('growth') || titleLower.includes('higher') || titleLower.includes('gain')) {
      sentiment = 'bullish';
    } else if (titleLower.includes('downgrade') || titleLower.includes('miss') || titleLower.includes('fell') || titleLower.includes('drop') || titleLower.includes('cut')) {
      sentiment = 'bearish';
    }
    
    return {
      id: item.id.toString(),
      ticker: symbol.toUpperCase(),
      title: item.headline,
      source: item.source,
      time: new Date(item.datetime * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      timestamp: item.datetime * 1000,
      sentiment,
      summary: item.summary
    };
  });
};

export const fetchLiveAPISearch = async (query, token) => {
  const url = `https://finnhub.io/api/v1/search?q=${query}&token=${token}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Finnhub Search API failed: ${response.statusText}`);
  const data = await response.json();
  return (data.result || []).slice(0, 8).map(item => ({
    symbol: item.symbol,
    name: item.description,
    sector: 'Technology' // Default sector
  }));
};

export const fetchAlphaVantageHistory = async (symbol, apiKey) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Alpha Vantage API failed: ${response.statusText}`);
  const data = await response.json();
  
  const series = data["Time Series (Daily)"];
  if (!series) {
    if (data["Note"]) throw new Error("Alpha Vantage API rate limit exceeded (5 requests/min standard free tier)");
    throw new Error(data["Error Message"] || "Failed to load historical data from Alpha Vantage");
  }

  // Convert map to array
  let chartData = [];
  const dates = Object.keys(series).sort().slice(-100); // Take last 100 days
  
  dates.forEach(date => {
    const raw = series[date];
    chartData.push({
      time: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      timestamp: new Date(date).getTime(),
      open: parseFloat(raw["1. open"]),
      high: parseFloat(raw["2. high"]),
      low: parseFloat(raw["3. low"]),
      close: parseFloat(raw["4. close"]),
      volume: parseInt(raw["5. volume"])
    });
  });

  // Calculate indicators
  const ma20 = calculateSMA(chartData, 20);
  const ma50 = calculateSMA(chartData, 50);
  const rsi = calculateRSI(chartData, 14);
  const macd = calculateMACD(chartData);

  return chartData.map((d, index) => ({
    ...d,
    ma20: ma20[index],
    ma50: ma50[index],
    rsi: rsi[index],
    macd: macd.line[index],
    macdSignal: macd.signal[index],
    macdHist: macd.hist[index]
  }));
};
