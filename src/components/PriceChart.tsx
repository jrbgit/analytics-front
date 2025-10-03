import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
  const { data, isLoading, error } = useChartData(coinCode, TIME_RANGES[selectedRange].hours);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {coinName} Price Chart
          </h3>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {coinName} Price Chart
          </h3>
        </div>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Error loading chart data</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {coinName} Price Chart
          </h3>
        </div>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">No chart data available</p>
        </div>
      </div>
    );
  }

  // Calculate price change for trend line color
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const isPositive = lastPrice >= firstPrice;
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {coinName} Price Chart
        </h3>
        
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
            data={data}
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
            {/* Reference line for starting price */}
            <ReferenceLine y={firstPrice} stroke="#ccc" strokeDasharray="2 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
