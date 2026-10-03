import { useQuery, useQueries } from '@tanstack/react-query';
import {
  fetchRiskMap,
  fetchTowns,
  fetchRouteRisk,
  fetchAlerts,
  fetchHistory,
} from './client';

export function useRiskMap() {
  return useQuery({
    queryKey: ['risk-map'],
    queryFn: fetchRiskMap,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 24 * 60 * 60 * 1000, // Keep cache 24h for offline
  });
}

export function useTowns() {
  return useQuery({
    queryKey: ['towns'],
    queryFn: fetchTowns,
    staleTime: 60 * 60 * 1000, // 1h – towns rarely change
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useRouteRisk(from: string, to: string, date: string) {
  return useQuery({
    queryKey: ['route-risk', from, to, date],
    queryFn: () => fetchRouteRisk(from, to, date),
    enabled: !!from && !!to && !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Fetches route risk for 7 days starting from today.
 * Returns an array of 7 query results, one per day.
 */
export function useRouteRiskWeek(from: string, to: string) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const queries = useQueries({
    queries: dates.map(date => ({
      queryKey: ['route-risk', from, to, date],
      queryFn: () => fetchRouteRisk(from, to, date),
      enabled: !!from && !!to,
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
    })),
  });

  return { dates, queries };
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 2 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: fetchHistory,
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
