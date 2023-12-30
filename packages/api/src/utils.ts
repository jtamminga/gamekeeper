export function toCleanQuery(obj: Record<string, string | number | Date | undefined> | undefined): Record<string, string> | undefined {
  if (obj === undefined) {
    return undefined
  }

  const query: Record<string, string> = {}
  Object.keys(obj)
    .filter(key => obj[key] !== undefined)
    .forEach(key => {
      const value = obj[key]!

      if (value instanceof Date) {
        query[key] = value.toISOString()
      }
      else {
        query[key] = value.toString()
      }
    })

  return query
}