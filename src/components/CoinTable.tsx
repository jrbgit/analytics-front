import { useState } from 'react';
import { useTopCoins } from '../hooks/useCoins';
import { formatCurrency, formatPercent, getPercentColor } from '../utils/formatters';
import { CoinData } from '../types/coin';

interface CoinTableProps {
  onCoinSelect?: (coin: CoinData) => void;
  selectedCoin?: CoinData | null;
}

export const CoinTable = ({ onCoinSelect, selectedCoin }: CoinTableProps) => {
  const limit = 100;
  const [searchTerm, setSearchTerm] = useState('');
  const { data: coins, isLoading, error } = useTopCoins(limit);

  const filteredCoins = coins?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCoinClick = (coin: CoinData) => {
    onCoinSelect?.(coin);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">Error loading coins data</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Top Cryptocurrencies</h2>
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {onCoinSelect && (
          <div className="mt-2 text-sm text-blue-600">
            Click on any coin row to view its price chart
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                1h %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                7d %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume (24h)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCoins?.map((coin) => (
              <tr 
                key={coin.code} 
                onClick={() => handleCoinClick(coin)}
                className={`transition-colors cursor-pointer ${
                  selectedCoin?.code === coin.code 
                    ? 'bg-blue-50 hover:bg-blue-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coin.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                      <div className="text-sm text-gray-500">{coin.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(coin.rate)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getPercentColor(coin.delta_1h)}`}>
                  {formatPercent(coin.delta_1h)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getPercentColor(coin.delta_24h)}`}>
                  {formatPercent(coin.delta_24h)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getPercentColor(coin.delta_7d)}`}>
                  {formatPercent(coin.delta_7d)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(coin.market_cap)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(coin.volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCoins && filteredCoins.length === 0 && (
        <div className="p-6 text-center text-gray-500">No coins found</div>
      )}
    </div>
  );
};
