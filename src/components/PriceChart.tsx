import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChartData, TimeRange, TIME_RANGES } from '../hooks/useChartData';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface PriceChartProps {
  coinCode: string;
  coinName: string;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

// Test data to verify chart rendering
const testChartData = [
  { timestamp: '2024-01-01T00:00:00Z', price: 45000, volume: 1000000, marketCap: 800000000000 },
  { timestamp: '2024-01-01T01:00:00Z', price: 45500, volume: 1100000, marketCap: 810000000000 },
  { timestamp: '2024-01-01T02:00:00Z', price: 44800, volume: 950000, marketCap: 795000000000 },
  { timestamp: '2024-01-01T03:00:00Z', price: 46200, volume: 1200000, marketCap: 820000000000 },
  { timestamp: '2024-01-01T04:00:00Z', price: 47100, volume: 1300000, marketCap: 835000000000 },
];

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-1">
          {new Date(data.timestamp).toLocaleString()}
        </p>
        <p className="text-lg font-semibold text-gray-900">
          {formatCurrency(data.price)}
        </p>
        <p className="text-sm text-gray-600">
          Volume: {formatNumber(data.volume)}
        </p>
        <p className="text-sm text-gray-600">
          Market Cap: {formatCurrency(data.marketCap)}
        </p>
      </div>
    );
  }
  return null;
};

export const PriceChart = ({ coinCode, coinName, className = '' }: PriceChartProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [useTestData, setUseTestData] = useState(false); // Changed to false - default to live data
  
  const { data: apiData, isLoading, error, isError } = useChartData(
    coinCode, 
    TIME_RANGES[selectedRange].hours
  );

  console.log('PriceChart render:', {
    coinCode,
    coinName,
    selectedRange,
    useTestData,
    isLoading,
    isError,
    error,
    apiDataLength: apiData?.length,
    apiDataSample: apiData?.[0]
  });

  // Use test data only if explicitly enabled
  const data = useTestData ? testChartData : apiData;

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {coinName} Price Chart
          </h3>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading {coinCode} data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !useTestData) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {coinName} Price Chart - API Error
          </h3>
          <button
            onClick={() => setUseTestData(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Use Test Data
          </button>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart data for {coinCode}</p>
            <p className="text-sm text-gray-500 mb-2">
              Error: {error?.message || 'Unknown API error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if ((!data || data.length === 0) && !useTestData) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {coinName} Price Chart - No Data
          </h3>
          <button
            onClick={() => setUseTestData(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Use Test Data
          </button>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No chart data available for {coinCode}</p>
            <p className="text-sm text-gray-500">API returned empty data set</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data || testChartData;
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const isPositive = lastPrice >= firstPrice;
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {coinName} Price Chart 
          {useTestData && <span className="text-orange-600"> (Test Data)</span>}
          {!useTestData && apiData && <span className="text-green-600"> (Live Data)</span>}
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Debug Info */}
          <div className="text-xs text-gray-500">
            {!useTestData && apiData && `${apiData.length} points`}
          </div>

          {/* Test Data Toggle */}
          <button
            onClick={() => setUseTestData(!useTestData)}
            className={`px-3 py-1 text-sm rounded ${
              useTestData 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {useTestData ? 'Live Data' : 'Test Data'}
          </button>

          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {Object.entries(TIME_RANGES).map(([key, range]) => (
              <button
                key={key}
                onClick={() => setSelectedRange(key as TimeRange)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedRange === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="mb-4 flex items-center space-x-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(lastPrice)}
          </p>
          <p className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '↗' : '↘'} {formatCurrency(Math.abs(lastPrice - firstPrice))} 
            ({((lastPrice - firstPrice) / firstPrice * 100).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                if (selectedRange === '1h' || selectedRange === '24h') {
                  return date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  });
                }
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
              stroke="#666"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value, true)}
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: lineColor, strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
