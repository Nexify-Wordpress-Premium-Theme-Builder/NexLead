export { formatDate, formatPercent } from "@shared/utils/formatters";

export function formatScore(value: number): string {
  return value.toFixed(0);
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}
