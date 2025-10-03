import { useQuery } from '@tanstack/react-query';
import { coinsAPI } from '../services/api';
import { CoinHistoryPoint } from '../types/coin';

export interface ChartDataPoint {
  timestamp: string;
  date: string;
  price: number;
  volume: number;
  marketCap: number;
}

export const useChartData = (coinCode: string, hours: number = 24) => {
  return useQuery({
    queryKey: ['chartData', coinCode, hours],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      if (!coinCode) return [];
      
      const data = await coinsAPI.getCoinHistory(coinCode, hours);
      
      return data.map((point: CoinHistoryPoint) => ({
        timestamp: point.timestamp,
        date: new Date(point.timestamp).toLocaleDateString(),
        price: point.rate,
        volume: point.volume,
        marketCap: point.market_cap,
      }));
    },
    enabled: !!coinCode,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Data is considered stale after 30 seconds
  });
};

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export const TIME_RANGES: Record<TimeRange, { label: string; hours: number }> = {
  '1h': { label: '1 Hour', hours: 1 },
  '24h': { label: '24 Hours', hours: 24 },
  '7d': { label: '7 Days', hours: 168 },
  '30d': { label: '30 Days', hours: 720 },
};
