export const formatCurrency = (value: number, abbreviated: boolean = false): string => {
  if (abbreviated) {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
  }
  
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  } else if (value < 1 && value > 0) {
    return `$${value.toFixed(6)}`;
  }
  return `$${value.toFixed(2)}`;
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
