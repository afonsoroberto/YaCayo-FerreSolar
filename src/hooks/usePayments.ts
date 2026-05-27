import { useState, useEffect, useCallback } from 'react'
import { fetchPagos } from '../lib/pagosDb'
import type { Payment } from '../types'

export function usePayments() {
  const [data, setData] = useState<Payment[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchPagos(50)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
