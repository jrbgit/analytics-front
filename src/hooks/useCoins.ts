import { useQuery } from '@tanstack/react-query';
import { coinsAPI, marketAPI } from '../services/api';

export const useTopCoins = (limit: number = 100) => {
  return useQuery({
    queryKey: ['coins', 'top', limit],
    queryFn: () => coinsAPI.getTopCoins(limit),
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

export const useCoin = (code: string) => {
  return useQuery({
    queryKey: ['coin', code],
    queryFn: () => coinsAPI.getCoin(code),
    enabled: !!code,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

export const useCoinHistory = (code: string, hours: number = 24) => {
  return useQuery({
    queryKey: ['coin', code, 'history', hours],
    queryFn: () => coinsAPI.getCoinHistory(code, hours),
    enabled: !!code,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000,
  });
};

export const useMarketOverview = () => {
  return useQuery({
    queryKey: ['market', 'overview'],
    queryFn: () => marketAPI.getOverview(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
