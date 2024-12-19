export function splitArray<T>(arr: readonly T[], subLength: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += subLength) {
    result.push([...arr.slice(i, i + subLength)])
  }
  return result
}
