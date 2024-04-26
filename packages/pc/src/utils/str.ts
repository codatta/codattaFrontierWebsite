export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function splitTitle(str: string): string {
  return str.split(/(?=[A-Z])/).join(' ')
}

export function formatNumber(num: number = 0): string {
  // 将数字转换为字符串
  let numStr: string = num.toString()

  // 使用正则表达式在数字字符串中每隔三位插入逗号
  numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return numStr
}
