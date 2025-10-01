import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketStats } from './components/MarketStats';
import { CoinTable } from './components/CoinTable';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Crypto Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time cryptocurrency prices and market data
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MarketStats />
          <CoinTable />
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
