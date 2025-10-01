export interface CoinData {
  code: string;
  name: string;
  rate: number;
  volume: number;
  market_cap: number;
  rank: number;
  delta_1h?: number;
  delta_24h?: number;
  delta_7d?: number;
  delta_30d?: number;
  liquidity?: number;
  circulating_supply?: number;
  timestamp: string;
}

export interface MarketOverview {
  total_market_cap?: number;
  total_volume?: number;
  total_liquidity?: number;
  btc_dominance?: number;
  timestamp: string;
}

export interface CoinHistoryPoint {
  timestamp: string;
  rate: number;
  volume: number;
  market_cap: number;
}
