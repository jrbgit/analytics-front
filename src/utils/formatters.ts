export const formatCurrency = (value: number, decimals: number = 2): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(decimals)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  } else if (value < 1 && value > 0) {
    return `$${value.toFixed(6)}`;
  }
  return `$${value.toFixed(decimals)}`;
};

export const formatPercent = (value: number | undefined): string => {
  if (value === undefined || value === null) return '-';
  const formatted = value.toFixed(2);
  return value >= 0 ? `+${formatted}%` : `${formatted}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const getPercentColor = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'text-gray-500';
  return value >= 0 ? 'text-green-600' : 'text-red-600';
};
