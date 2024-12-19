export function formatPercent(value: number | undefined): string {
  return value?.toLocaleString('en-US', { style: 'percent' }) ?? '—'
}