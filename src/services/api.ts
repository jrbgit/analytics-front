import axios from 'axios';
import { CoinData, MarketOverview, CoinHistoryPoint, APIResponse } from '../types/coin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

export const coinsAPI = {
  getTopCoins: async (limit: number = 100): Promise<CoinData[]> => {
    const response = await api.get<APIResponse<CoinData[]>>(`/coins/top?limit=${limit}`);
    return response.data.data || [];
  },

  getCoin: async (code: string): Promise<CoinData | null> => {
    const response = await api.get<APIResponse<CoinData>>(`/coins/${code}`);
    return response.data.data || null;
  },

  getCoinHistory: async (code: string, hours: number = 24): Promise<CoinHistoryPoint[]> => {
    const response = await api.get<APIResponse<CoinHistoryPoint[]>>(
      `/coins/${code}/history?hours=${hours}`
    );
    return response.data.data || [];
  },
};

export const marketAPI = {
  getOverview: async (): Promise<MarketOverview | null> => {
    const response = await api.get<APIResponse<MarketOverview>>('/market/overview');
    return response.data.data || null;
  },
};

export default api;
