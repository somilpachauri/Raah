import Constants from 'expo-constants';
import type {
  RiskMapResponse,
  Town,
  RouteRisk,
  Alert,
  HistoryEvent,
  FieldReport,
  FieldReportSubmission,
} from './types';
import {
  towns as mockTowns,
  getSegments,
  getRouteRisk as mockGetRouteRisk,
  alerts as mockAlerts,
  historyEvents as mockHistory,
  submitFieldReport as mockSubmit,
  type Scenario,
} from './mocks';

const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:3000';

const USE_MOCKS =
  (Constants.expoConfig?.extra?.EXPO_PUBLIC_USE_MOCKS ??
    process.env.EXPO_PUBLIC_USE_MOCKS ??
    'true') === 'true';

/** Current demo scenario. Switch via the kitchen-sink dev panel. */
let currentScenario: Scenario = 'dry';

export function setScenario(s: Scenario): void {
  currentScenario = s;
}

export function getScenario(): Scenario {
  return currentScenario;
}

/** Simulates network delay for mocks */
function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchRiskMap(): Promise<RiskMapResponse> {
  if (USE_MOCKS) {
    await delay();
    return {
      updated_at: new Date().toISOString(),
      segments: getSegments(currentScenario),
    };
  }
  const res = await fetch(`${API_URL}/risk-map`);
  if (!res.ok) throw new Error(`Risk map fetch failed: ${res.status}`);
  return res.json() as Promise<RiskMapResponse>;
}

export async function fetchTowns(): Promise<Town[]> {
  if (USE_MOCKS) {
    await delay();
    return mockTowns;
  }
  const res = await fetch(`${API_URL}/towns`);
  if (!res.ok) throw new Error(`Towns fetch failed: ${res.status}`);
  return res.json() as Promise<Town[]>;
}

export async function fetchRouteRisk(
  from: string,
  to: string,
  date: string,
): Promise<RouteRisk> {
  if (USE_MOCKS) {
    await delay();
    return mockGetRouteRisk(from, to, date, currentScenario);
  }
  const params = new URLSearchParams({ from, to, date });
  const res = await fetch(`${API_URL}/route-risk?${params}`);
  if (!res.ok) throw new Error(`Route risk fetch failed: ${res.status}`);
  return res.json() as Promise<RouteRisk>;
}

export async function fetchAlerts(): Promise<Alert[]> {
  if (USE_MOCKS) {
    await delay();
    return mockAlerts;
  }
  const res = await fetch(`${API_URL}/alerts`);
  if (!res.ok) throw new Error(`Alerts fetch failed: ${res.status}`);
  return res.json() as Promise<Alert[]>;
}

export async function fetchHistory(): Promise<HistoryEvent[]> {
  if (USE_MOCKS) {
    await delay();
    return mockHistory;
  }
  const res = await fetch(`${API_URL}/history`);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  return res.json() as Promise<HistoryEvent[]>;
}

export async function postFieldReport(
  submission: FieldReportSubmission,
): Promise<FieldReport> {
  if (USE_MOCKS) {
    await delay();
    return mockSubmit(submission);
  }
  const res = await fetch(`${API_URL}/field-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  if (!res.ok) throw new Error(`Report submit failed: ${res.status}`);
  return res.json() as Promise<FieldReport>;
}
