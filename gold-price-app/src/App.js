import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // فایل CSS سفارشی

const MarketDataDashboard = () => {
  const [marketData, setMarketData] = useState({
    gold: [],
    currency: [],
    cryptocurrency: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setMarketData(prev => ({...prev, loading: true, error: null}));
        
        const [goldRes, currencyRes, cryptoRes] = await Promise.all([
          fetch('https://goldenprice.liara.run/api/MarketData/gold'),
          fetch('https://goldenprice.liara.run/api/MarketData/currency'),
          fetch('https://goldenprice.liara.run/api/MarketData/cryptocurrency')
        ]);
        
        const goldData = await goldRes.json();
        const currencyData = await currencyRes.json();
        const cryptoData = await cryptoRes.json();
        
        setMarketData({
          gold: goldData,
          currency: currencyData,
          cryptocurrency: cryptoData,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
        setMarketData(prev => ({
          ...prev,
          loading: false,
          error: 'خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.'
        }));
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const renderChangeIndicator = (changePercent) => {
    const isPositive = changePercent >= 0;
    return (
      <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(changePercent)}%
      </span>
    );
  };

  return (
    <div className="market-dashboard">
      {/* Header */}
      <header className="dashboard-header py-3 sticky-top">
  <div className="container">
    <div className="row align-items-center">
      {/* بخش لوگو و توضیحات */}
      <div className="col-md-6">
        <div className="d-flex flex-column">
          <h1 className="brand-name m-0">Golden Price</h1>
          <p className="notice-text mt-1 mb-0">
            دیتا ممکن است با تاخیر آپدیت شوند چون سامانه در حال تست است. کش حداقل ۳۰ دقیقه ای وجود دارد.
          </p>
        </div>
      </div>
      
      {/* بخش منو */}
      <div className="col-md-6">
        <nav className="d-flex justify-content-end">
          <ul className="nav-list d-flex gap-4 list-unstyled m-0">
            {['طلا و سکه', 'ارز دیجیتال', 'تتر', 'تماس'].map((item, index) => (
              <li key={index}>
                <a href={`#${item}`} className="nav-link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </div>
</header>
      {/* Main Content */}
      <main className="container py-4">
        {marketData.error && (
          <div className="alert alert-danger text-center">
            {marketData.error}
          </div>
        )}

        {marketData.loading && (
          <div className="loading-spinner d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="mx-2">در حال دریافت داده‌ها...</span>
          </div>
        )}

        {/* Gold Section */}
        <section id="gold" className="py-4">
          <div className="row">
            {/* Gold Prices */}
            <div className="col-md-6 mb-4">
              <div className="card h-100 gold-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h2 className="card-title m-0">
                    <i className="fas fa-coins me-2"></i>
                    قیمت طلا و سکه
                  </h2>
                  {marketData.lastUpdated && (
                    <span className="update-time">
                      آخرین بروزرسانی: {new Date(marketData.lastUpdated).toLocaleTimeString('fa-IR')}
                    </span>
                  )}
                </div>
                <div className="card-body">
                  {marketData.gold.map((item, index) => (
                    <div key={index} className="price-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span>{item.name}</span>
                      <div className="d-flex align-items-center">
                        <span className={`price ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                          {formatPrice(item.price)} ریال
                        </span>
                        {renderChangeIndicator(item.changePercent)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Gold Chart */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h2 className="card-title m-0">نمودار قیمت طلا</h2>
                </div>
                <div className="card-body chart-placeholder d-flex justify-content-center align-items-center">
                  <p className="m-0">نمودار به زودی</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Crypto Section */}
        <section id="crypto" className="py-4">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title m-0">
                    <i className="fab fa-bitcoin me-2"></i>
                    ارزهای دیجیتال
                  </h2>
                </div>
                <div className="card-body">
                  <div className="row">
                    {marketData.cryptocurrency.map((crypto, index) => (
                      <div key={index} className="col-sm-6 col-md-3 mb-3">
                        <div className="crypto-item d-flex justify-content-between align-items-center p-2 border-bottom">
                          <span>{crypto.name}</span>
                          <div className="d-flex align-items-center">
                            <span className={`price ${crypto.changePercent >= 0 ? 'positive' : 'negative'}`}>
                              ${formatPrice(crypto.price)}
                            </span>
                            {renderChangeIndicator(crypto.changePercent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USDT Section */}
        <section id="usdt" className="py-4">
          <div className="row">
            {/* USDT Price */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h2 className="card-title m-0">
                    <i className="fas fa-dollar-sign me-2"></i>
                    قیمت ارزها
                  </h2>
                </div>
                <div className="card-body">
                  {marketData.currency.map((curr, index) => (
                    <div key={index} className="price-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span>{curr.name}</span>
                      <div className="d-flex align-items-center">
                        <span className={`price ${curr.changePercent >= 0 ? 'positive' : 'negative'}`}>
                          {formatPrice(curr.price)} ریال
                        </span>
                        {renderChangeIndicator(curr.changePercent)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* USDT Chart */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h2 className="card-title m-0">نمودار تتر</h2>
                </div>
                <div className="card-body chart-placeholder d-flex justify-content-center align-items-center">
                  <p className="m-0">نمودار به زودی</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center py-4">
        <p className="m-0">
          تمامی دیتاها از طریق  سامانه <a href="https://brsapi.ir/free-api-gold-currency-webservice/" target='_blank'>https://brsapi.ir/  </a> استخراج شده است.و دامنه مسئولتی در مورد دیتای خروجی ندارد.
        </p>
      </footer>
    </div>
  );
};

export default MarketDataDashboard;