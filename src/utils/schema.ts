export function parseSchema(schema = '') {
  const url = new URL(schema)
  const isSelf = url.host === location.host
  const isApp = url.protocol === 'app:'

  const params = Object.fromEntries([...url.searchParams.entries()])
  const to = isApp
    ? schema.includes('/router/')
      ? schema.replace('app://router', '')
      : schema.replace('app://', '/app/')
    : schema

  return {
    isApp,
    isSelf,
    to,
    params
  }
}
