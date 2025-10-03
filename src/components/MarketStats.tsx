import { useMarketOverview } from '../hooks/useCoins';
import { formatCurrency } from '../utils/formatters';

export const MarketStats = () => {
  const { data: overview, isLoading, error } = useMarketOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !overview) {
    return null;
  }

  const stats = [
    {
      label: 'Total Market Cap',
      value: overview.total_market_cap ? formatCurrency(overview.total_market_cap) : '-',
    },
    {
      label: 'Total Volume (24h)',
      value: overview.total_volume ? formatCurrency(overview.total_volume) : '-',
    },
    {
      label: 'Total Liquidity',
      value: overview.total_liquidity ? formatCurrency(overview.total_liquidity) : '-',
    },
    {
      label: 'BTC Dominance',
      value: overview.btc_dominance ? `${overview.btc_dominance.toFixed(2)}%` : '-',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
