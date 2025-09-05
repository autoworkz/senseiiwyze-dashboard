'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'

interface FilteredUsersContextType {
  filteredUserIds: string[]
  setFilteredUserIds: (ids: string[]) => void
  hasFilteredUsers: boolean
  avgReadiness: number
  setAvgReadiness: (value: number) => void
  clearPersistedData: () => void
}

const FilteredUsersContext = createContext<FilteredUsersContextType | undefined>(undefined)

export function FilteredUsersProvider({ children }: { children: ReactNode }) {
  const [filteredUserIds, setFilteredUserIds] = useState<string[]>([])
  const [avgReadiness, setAvgReadiness] = useState<number>(0)

  const hasFilteredUsers = filteredUserIds.length > 0

  // Load data from localStorage on mount only
  useEffect(() => {
    try {
      const savedUserIds = localStorage.getItem('filteredUserIds')
      const savedAvgReadiness = localStorage.getItem('avgReadiness')
      
      if (savedUserIds) {
        setFilteredUserIds(JSON.parse(savedUserIds))
      }
      if (savedAvgReadiness) {
        setAvgReadiness(JSON.parse(savedAvgReadiness))
      }
    } catch (error) {
      console.error('Error loading filtered users from localStorage:', error)
    }
  }, [])

  // Save data to localStorage whenever it changes
  const persistFilteredUserIds = useCallback((ids: string[]) => {
    setFilteredUserIds(ids)
    try {
      localStorage.setItem('filteredUserIds', JSON.stringify(ids))
    } catch (error) {
      console.error('Error saving filtered users to localStorage:', error)
    }
  }, [])

  const persistAvgReadiness = useCallback((value: number) => {
    setAvgReadiness(value)
    try {
      localStorage.setItem('avgReadiness', JSON.stringify(value))
    } catch (error) {
      console.error('Error saving avg readiness to localStorage:', error)
    }
  }, [])

  const clearPersistedData = useCallback(() => {
    setFilteredUserIds([])
    setAvgReadiness(0)
    try {
      localStorage.removeItem('filteredUserIds')
      localStorage.removeItem('avgReadiness')
    } catch (error) {
      console.error('Error clearing persisted data:', error)
    }
  }, [])

  return (
    <FilteredUsersContext.Provider value={{ 
      filteredUserIds, 
      setFilteredUserIds: persistFilteredUserIds, 
      hasFilteredUsers,
      avgReadiness,
      setAvgReadiness: persistAvgReadiness,
      clearPersistedData
    }}>
      {children}
    </FilteredUsersContext.Provider>
  )
}

export function useFilteredUsersContext() {
  const context = useContext(FilteredUsersContext)
  if (context === undefined) {
    throw new Error('useFilteredUsersContext must be used within a FilteredUsersProvider')
  }
  return context
}
