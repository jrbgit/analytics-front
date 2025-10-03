import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketStats } from './components/MarketStats';
import { CoinTable } from './components/CoinTable';
import { PriceChart } from './components/PriceChart';
import { DebugChart } from './components/DebugChart';
import { MinimalRechartsTest } from './components/MinimalRechartsTest';
import { CoinData } from './types/coin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);

  const handleCoinSelect = (coin: CoinData) => {
    console.log('Coin selected:', coin);
    setSelectedCoin(coin);
  };

  console.log('App rendering, selected coin:', selectedCoin);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Crypto Analytics Dashboard - Debug Mode
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time cryptocurrency prices and market data
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Debug Information */}
          <DebugChart />
          
          {/* Minimal Recharts Test */}
          <div className="mb-6">
            <MinimalRechartsTest />
          </div>

          <MarketStats />

          {/* Price Chart Section */}
          {selectedCoin ? (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Price Chart for {selectedCoin.name}
                </h2>
                <button
                  onClick={() => {
                    console.log('Clearing selection');
                    setSelectedCoin(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
              <PriceChart 
                coinCode={selectedCoin.code} 
                coinName={selectedCoin.name} 
              />
            </div>
          ) : (
            <div className="mb-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Price Charts</h2>
              <p className="text-gray-600">
                Select any cryptocurrency from the table below to view its price chart with historical data.
              </p>
            </div>
          )}

          <CoinTable 
            onCoinSelect={handleCoinSelect}
            selectedCoin={selectedCoin}
          />
        </main>

        <footer className="bg-white mt-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-600 text-sm">
              Data sourced from LiveCoinWatch API via InfluxDB
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
