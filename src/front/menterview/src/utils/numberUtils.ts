export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round(sum / numbers.length);
};

export const calculateAverageFromProperty = <T, K extends keyof T>(
  items: T[],
  property: K
): number => {
  if (items.length === 0) return 0;
  const values: number[] = [];
  for (const item of items) {
    const val = item[property];
    if (typeof val === 'number') {
      values.push(val);
    }
  }
  return calculateAverage(values);
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};
