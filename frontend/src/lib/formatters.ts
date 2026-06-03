export { formatDate, formatPercent } from "@shared/utils/formatters";

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatScore(value: number): string {
  return value.toFixed(0);
}
