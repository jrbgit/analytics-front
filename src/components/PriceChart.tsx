import { useState } from 'react';
import { 
  Chart, 
  ChartCanvas,
  LineSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  discontinuousTimeScaleProviderBuilder,
} from 'react-financial-charts';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { useChartData, TimeRange, TIME_RANGES } from '../hooks/useChartData';
import { formatCurrency } from '../utils/formatters';

interface PriceChartProps {
  coinCode: string;
  coinName: string;
  className?: string;
}

// Simple SVG chart component using real data (keeping as fallback)
const SimpleSVGChart = ({ data, width = 800, height = 300 }: { data: any[], width?: number, height?: number }) => {
  if (!data || data.length === 0) return null;

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const points = data.map((point, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight;
    return { x, y, price: point.price, timestamp: point.timestamp };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const isPositive = data[data.length - 1]?.price >= data[0]?.price;
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="p-4">
        <h4 className="text-md font-medium text-gray-900 mb-2">
          SVG Chart ({data.length} points)
        </h4>
        <svg width={width} height={height} className="w-full">
          <rect width={width} height={height} fill="#fafafa" />
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <g key={ratio}>
              <line
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={width - padding}
                y2={padding + ratio * chartHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </g>
          ))}
          <path d={pathData} fill="none" stroke={lineColor} strokeWidth="2" />
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="3" fill={lineColor} stroke="white" strokeWidth="1" />
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const price = minPrice + ratio * priceRange;
            const y = padding + (1 - ratio) * chartHeight;
            return (
              <text key={ratio} x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">
                {formatCurrency(price, true)}
              </text>
            );
          })}
          <text x={width / 2} y={20} textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold">
            Price Movement - {formatCurrency(data[0]?.price)} → {formatCurrency(data[data.length - 1]?.price)}
          </text>
        </svg>
      </div>
    </div>
  );
};

// Simplified Financial Chart Component
const FinancialChart = ({ data, isPositive }: { data: any[], isPositive: boolean }) => {
  try {
    if (!data || data.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-600">No data for financial chart</p>
        </div>
      );
    }

    // Set up the scale provider
    const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: any) => d.date);
    const { data: scaledData, xScale, xAccessor, displayXAccessor } = ScaleProvider(data);
    
    if (!scaledData || scaledData.length === 0) {
      throw new Error('No scaled data available');
    }

    const max = xAccessor(scaledData[scaledData.length - 1]);
    const min = xAccessor(scaledData[Math.max(0, scaledData.length - 100)]);
    const xExtents = [min, max];

    const yAccessor = (d: any) => d.close;
    
    return (
      <div className="h-96">
        <div className="text-xs text-gray-500 mb-2">
          Using react-financial-charts ({scaledData.length} points)
        </div>
        <ChartCanvas
          height={380}
          ratio={1}
          width={800}
          margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
          data={scaledData}
          displayXAccessor={displayXAccessor}
          seriesName="Price"
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={xExtents}
        >
          <Chart id={1} yExtents={yAccessor}>
            <XAxis />
            <YAxis tickFormat={format('.4s')} />
            
            <LineSeries 
              yAccessor={yAccessor} 
              strokeStyle={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2} 
            />
            
            <MouseCoordinateX displayFormat={timeFormat('%H:%M')} />
            <MouseCoordinateY rectWidth={70} displayFormat={format('.6s')} />
            
            <CrossHairCursor />
          </Chart>
        </ChartCanvas>
      </div>
    );
  } catch (error: any) {
    console.error('Financial chart error:', error);
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Financial chart error</p>
          <p className="text-sm text-gray-500">{error.message}</p>
          <p className="text-xs text-gray-400 mt-2">This might be a compatibility issue with React 19</p>
        </div>
      </div>
    );
  }
};

export const PriceChart = ({ coinCode, coinName, className = '' }: PriceChartProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const [useTestData, setUseTestData] = useState(false);
  const [showSVGFallback, setShowSVGFallback] = useState(true); // Default to SVG since it works
  const [showFinancialChart, setShowFinancialChart] = useState(false);
  
  const { data: apiData, isLoading, error, isError } = useChartData(
    coinCode, 
    TIME_RANGES[selectedRange].hours
  );

  console.log('PriceChart render:', {
    coinCode,
    coinName,
    selectedRange,
    useTestData,
    showSVGFallback,
    showFinancialChart,
    isLoading,
    isError,
    error,
    apiDataLength: apiData?.length,
    apiDataSample: apiData?.[0]
  });

  // Test data
  const testChartData = [
    { timestamp: '2024-01-01T00:00:00Z', price: 45000, volume: 1000000, marketCap: 800000000000, date: new Date('2024-01-01T00:00:00Z') },
    { timestamp: '2024-01-01T01:00:00Z', price: 45500, volume: 1100000, marketCap: 810000000000, date: new Date('2024-01-01T01:00:00Z') },
    { timestamp: '2024-01-01T02:00:00Z', price: 44800, volume: 950000, marketCap: 795000000000, date: new Date('2024-01-01T02:00:00Z') },
    { timestamp: '2024-01-01T03:00:00Z', price: 46200, volume: 1200000, marketCap: 820000000000, date: new Date('2024-01-01T03:00:00Z') },
    { timestamp: '2024-01-01T04:00:00Z', price: 47100, volume: 1300000, marketCap: 835000000000, date: new Date('2024-01-01T04:00:00Z') },
  ];

  // Transform data for react-financial-charts
  const transformedApiData = apiData?.map(point => ({
    ...point,
    date: new Date(point.timestamp),
    close: point.price,
    high: point.price,
    low: point.price,
    open: point.price,
  }));

  const data = useTestData ? 
    testChartData.map(d => ({ ...d, close: d.price, high: d.price, low: d.price, open: d.price })) : 
    transformedApiData;

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
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart data for {coinCode}</p>
            <p className="text-sm text-gray-500 mb-4">
              Error: {error?.message || 'Unknown API error'}
            </p>
            <button
              onClick={() => setUseTestData(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
            >
              Use Test Data
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
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No chart data available for {coinCode}</p>
            <p className="text-sm text-gray-500 mb-4">API returned empty data set</p>
            <button
              onClick={() => setUseTestData(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Use Test Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data || [];
  const firstPrice = chartData[0]?.price || chartData[0]?.close || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || chartData[chartData.length - 1]?.close || 0;
  const isPositive = lastPrice >= firstPrice;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {coinName} Price Chart 
          {useTestData && <span className="text-orange-600"> (Test Data)</span>}
          {!useTestData && apiData && <span className="text-green-600"> (Live Data)</span>}
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">
            {!useTestData && apiData && `${apiData.length} points`}
          </div>

          <button
            onClick={() => {
              setShowFinancialChart(true);
              setShowSVGFallback(false);
            }}
            className={`px-3 py-1 text-sm rounded ${
              showFinancialChart 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Financial Chart
          </button>

          <button
            onClick={() => {
              setShowSVGFallback(true);
              setShowFinancialChart(false);
            }}
            className={`px-3 py-1 text-sm rounded ${
              showSVGFallback 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            SVG Chart
          </button>

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

      {/* Chart Display */}
      {showSVGFallback ? (
        <SimpleSVGChart data={useTestData ? testChartData : (apiData || [])} />
      ) : showFinancialChart ? (
        <FinancialChart data={chartData} isPositive={isPositive} />
      ) : (
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Select a chart type</p>
            <div className="space-x-2">
              <button
                onClick={() => setShowFinancialChart(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Financial Chart
              </button>
              <button
                onClick={() => setShowSVGFallback(true)}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                SVG Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
