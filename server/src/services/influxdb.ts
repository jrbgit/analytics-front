import { InfluxDB, flux } from '@influxdata/influxdb-client';
import { CoinData, MarketOverview, CoinHistoryPoint } from '../types/coin.js';

export class InfluxDBService {
  private influxDB: InfluxDB;
  private queryApi: any;
  private bucket: string;
  private org: string;

  constructor() {
    const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
    const token = process.env.INFLUXDB_TOKEN || '';
    this.org = process.env.INFLUXDB_ORG || 'cryptocurrency';
    this.bucket = process.env.INFLUXDB_BUCKET || 'crypto_data';

    this.influxDB = new InfluxDB({ url, token });
    console.log(`🔧 InfluxDB Service initialized with token ending: ***${token.slice(-10)}`);
    console.log(`🔧 URL: ${url}, ORG: ${this.org}, BUCKET: ${this.bucket}`);
    this.queryApi = this.influxDB.getQueryApi(this.org);
  }

  async getTopCoins(limit: number = 100): Promise<CoinData[]> {
    const fluxQuery = `
      from(bucket: "${this.bucket}")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "cryptocurrency_data")
        |> filter(fn: (r) => r._field == "rate" or r._field == "volume" or r._field == "market_cap" or r._field == "rank" or r._field == "delta_1h" or r._field == "delta_24h" or r._field == "delta_7d" or r._field == "delta_30d" or r._field == "liquidity" or r._field == "circulating_supply")
        |> last()
        |> pivot(rowKey: ["code"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["rank"])
        |> limit(n: ${limit})
    `;

    const coins: CoinData[] = [];
    const coinsMap = new Map<string, any>();

    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(fluxQuery, {
        next: (row: any, tableMeta: any) => {
          const record = tableMeta.toObject(row);
          const code = record.code;
          
          if (!coinsMap.has(code)) {
            coinsMap.set(code, {
              code: record.code,
              name: record.name || record.code,
              rate: record.rate || 0,
              volume: record.volume || 0,
              market_cap: record.market_cap || 0,
              rank: record.rank || 0,
              delta_1h: record.delta_1h,
              delta_24h: record.delta_24h,
              delta_7d: record.delta_7d,
              delta_30d: record.delta_30d,
              liquidity: record.liquidity,
              circulating_supply: record.circulating_supply,
              timestamp: record._time
            });
          }
        },
        error: (error: Error) => {
          console.error('Query error:', error);
          reject(error);
        },
        complete: () => {
          const result = Array.from(coinsMap.values());
          resolve(result);
        }
      });
    });
  }

  async getCoinByCode(code: string): Promise<CoinData | null> {
    const fluxQuery = `
      from(bucket: "${this.bucket}")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "cryptocurrency_data")
        |> filter(fn: (r) => r.code == "${code}")
        |> filter(fn: (r) => r._field == "rate" or r._field == "volume" or r._field == "market_cap" or r._field == "rank" or r._field == "delta_1h" or r._field == "delta_24h" or r._field == "delta_7d" or r._field == "delta_30d" or r._field == "liquidity" or r._field == "circulating_supply")
        |> last()
        |> pivot(rowKey: ["code"], columnKey: ["_field"], valueColumn: "_value")
    `;

    return new Promise((resolve, reject) => {
      let coin: CoinData | null = null;

      this.queryApi.queryRows(fluxQuery, {
        next: (row: any, tableMeta: any) => {
          const record = tableMeta.toObject(row);
          coin = {
            code: record.code,
            name: record.name || record.code,
            rate: record.rate || 0,
            volume: record.volume || 0,
            market_cap: record.market_cap || 0,
            rank: record.rank || 0,
            delta_1h: record.delta_1h,
            delta_24h: record.delta_24h,
            delta_7d: record.delta_7d,
            delta_30d: record.delta_30d,
            liquidity: record.liquidity,
            circulating_supply: record.circulating_supply,
            timestamp: record._time
          };
        },
        error: (error: Error) => {
          console.error('Query error:', error);
          reject(error);
        },
        complete: () => {
          resolve(coin);
        }
      });
    });
  }

  async getCoinHistory(code: string, hours: number = 24): Promise<CoinHistoryPoint[]> {
    const fluxQuery = `
      from(bucket: "${this.bucket}")
        |> range(start: -${hours}h)
        |> filter(fn: (r) => r._measurement == "cryptocurrency_data")
        |> filter(fn: (r) => r.code == "${code}")
        |> filter(fn: (r) => r._field == "rate" or r._field == "volume" or r._field == "market_cap")
        |> aggregateWindow(every: ${Math.max(1, Math.floor(hours / 48))}h, fn: mean, createEmpty: false)
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;

    const history: CoinHistoryPoint[] = [];

    return new Promise((resolve, reject) => {
      this.queryApi.queryRows(fluxQuery, {
        next: (row: any, tableMeta: any) => {
          const record = tableMeta.toObject(row);
          history.push({
            timestamp: record._time,
            rate: record.rate || 0,
            volume: record.volume || 0,
            market_cap: record.market_cap || 0
          });
        },
        error: (error: Error) => {
          console.error('Query error:', error);
          reject(error);
        },
        complete: () => {
          resolve(history);
        }
      });
    });
  }

  async getMarketOverview(): Promise<MarketOverview | null> {
    const fluxQuery = `
      from(bucket: "${this.bucket}")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "market_overview")
        |> filter(fn: (r) => r._field == "total_market_cap" or r._field == "total_volume" or r._field == "total_liquidity" or r._field == "btc_dominance")
        |> last()
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;

    return new Promise((resolve, reject) => {
      let overview: MarketOverview | null = null;

      this.queryApi.queryRows(fluxQuery, {
        next: (row: any, tableMeta: any) => {
          const record = tableMeta.toObject(row);
          overview = {
            total_market_cap: record.total_market_cap,
            total_volume: record.total_volume,
            total_liquidity: record.total_liquidity,
            btc_dominance: record.btc_dominance,
            timestamp: record._time
          };
        },
        error: (error: Error) => {
          console.error('Query error:', error);
          reject(error);
        },
        complete: () => {
          resolve(overview);
        }
      });
    });
  }
}
