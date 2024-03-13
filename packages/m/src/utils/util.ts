export function mapToRange(
  value: number,
  toMin: number,
  toMax: number
): number {
  // 确保输入值在0-1区间内
  const clampedValue = Math.max(0, Math.min(1, value))

  // 将0-1区间的值映射到目标区间
  const mappedValue = ((clampedValue - 0) * (toMax - toMin)) / (1 - 0) + toMin

  // 确保映射后的值在目标区间内
  return Math.max(toMin, Math.min(toMax, mappedValue))
}
