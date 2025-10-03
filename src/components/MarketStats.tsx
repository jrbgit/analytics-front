import { useMarketOverview } from '../hooks/useCoins';
import { formatCurrency } from '../utils/formatters';

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

const StatCard = ({ label, value, icon = '📊', trend = 'neutral', isLoading = false }: StatCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '●';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md hover:border-gray-200 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
          {label}
        </span>
        <span className="text-xl opacity-60 group-hover:opacity-80 transition-opacity">
          {icon}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        <div className={`text-xs font-medium flex items-center ${getTrendColor()}`}>
          <span className="mr-1">{getTrendIcon()}</span>
          <span>Live Data</span>
        </div>
      </div>
    </div>
  );
};

export const MarketStats = () => {
  const { data: overview, isLoading, error } = useMarketOverview();

  if (error) {
    return (
      <div className="mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium">Unable to load market data</div>
          <div className="text-red-500 text-sm mt-1">Please check your connection and try again</div>
        </div>
      </div>
    );
  }

  // Enhanced stats with more visual appeal
  const stats: Array<{
    label: string;
    value: string;
    icon: string;
    trend: 'up' | 'down' | 'neutral';
  }> = [
    {
      label: 'Market Cap',
      value: overview?.total_market_cap ? formatCurrency(overview.total_market_cap) : '-',
      icon: '🏛️',
      trend: 'neutral'
    },
    {
      label: '24h Volume', 
      value: overview?.total_volume ? formatCurrency(overview.total_volume) : '-',
      icon: '📊',
      trend: 'up'
    },
    {
      label: 'Liquidity',
      value: overview?.total_liquidity ? formatCurrency(overview.total_liquidity) : '-',
      icon: '💧',
      trend: 'neutral'
    },
    {
      label: 'BTC Dominance',
      value: overview?.btc_dominance ? `${overview.btc_dominance.toFixed(1)}%` : '-',
      icon: '₿',
      trend: overview?.btc_dominance && overview.btc_dominance > 50 ? 'up' : 'down'
    },
  ];

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time cryptocurrency market statistics</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Additional Info Bar */}
      {!isLoading && overview && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            <span>Data sourced from LiveCoinWatch</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            <span>Updated every 60 seconds</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
            <span>Last update: {new Date(overview.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
