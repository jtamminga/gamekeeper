export function formatNumber(value: number): string {
  return (Math.round(value * 10) / 10).toString()
}