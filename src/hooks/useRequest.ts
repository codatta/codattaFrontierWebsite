import { useState } from 'react'

export default function useRequest<T, R extends unknown[], D = T>(
  request: (...args: R) => Promise<T | null>,
  formatter: (data: T, oldData: D) => D = (data) => data as unknown as D
) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<D>()

  const loadData = async (...args: R) => {
    setLoading(true)
    try {
      const data = await request(...args)
      setData((oldData) => formatter(data, oldData))
      return data
    } finally {
      setLoading(false)
    }
  }

  return [data, loading, loadData, setData] as const
}
