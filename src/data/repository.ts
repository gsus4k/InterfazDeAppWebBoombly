import { useCallback, useEffect, useState } from 'react'
import { SEED_RESTAURANTS } from './seed'
import type { Restaurant } from './types'

// Capa de persistencia aislada: para escalar, reemplaza estas 2 funciones
// por llamadas a una API/base de datos sin tocar la UI.
const KEY = 'boombly:restaurants:v1'

function load(): Restaurant[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Restaurant[]
  } catch {
    /* ignore */
  }
  return SEED_RESTAURANTS
}

function save(list: Restaurant[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(load)

  useEffect(() => {
    save(restaurants)
  }, [restaurants])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setRestaurants(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((data: Omit<Restaurant, 'id' | 'createdAt'>) => {
    setRestaurants(prev => [{ ...data, id: crypto.randomUUID(), createdAt: Date.now() }, ...prev])
  }, [])

  const update = useCallback((id: string, data: Partial<Restaurant>) => {
    setRestaurants(prev => prev.map(r => (r.id === id ? { ...r, ...data } : r)))
  }, [])

  const remove = useCallback((id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id))
  }, [])

  return { restaurants, add, update, remove }
}
