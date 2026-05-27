import { useState, useEffect } from 'react'
import { fetchStatsToday } from '../lib/pagosDb'
import type { StatsToday } from '../types'

export function useStats() {
  const [data, setData] = useState<StatsToday | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchStatsToday()
      .then(result => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}