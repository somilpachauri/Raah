import type { Alert, HistoryEvent, FieldReport } from '../types';

// --- Alerts (3 items) ---

export const alerts: Alert[] = [
  {
    id: 'al-91',
    segment_id: 'seg-007',
    level: 2,
    code: 'heavy_rain',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'al-92',
    segment_id: 'seg-008',
    level: 3,
    code: 'road_blocked',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'al-93',
    segment_id: 'seg-011',
    level: 1,
    code: 'rain_expected',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
  },
];

// --- History events (about 15) ---

export const historyEvents: HistoryEvent[] = [
  { id: 'ev-01', lat: 30.1360, lng: 78.3940, date: '2025-08-14', type: 'landslide', segment_id: 'seg-001' },
  { id: 'ev-02', lat: 30.1550, lng: 78.5200, date: '2025-07-22', type: 'landslide', segment_id: 'seg-002' },
  { id: 'ev-03', lat: 30.1480, lng: 78.5700, date: '2025-09-03', type: 'rockfall', segment_id: 'seg-003' },
  { id: 'ev-04', lat: 30.1700, lng: 78.6500, date: '2024-08-10', type: 'landslide', segment_id: 'seg-004' },
  { id: 'ev-05', lat: 30.2200, lng: 78.7650, date: '2024-09-15', type: 'debris_flow', segment_id: 'seg-005' },
  { id: 'ev-06', lat: 30.2400, lng: 78.8600, date: '2025-07-01', type: 'landslide', segment_id: 'seg-006' },
  { id: 'ev-07', lat: 30.2700, lng: 78.9400, date: '2025-08-20', type: 'landslide', segment_id: 'seg-007' },
  { id: 'ev-08', lat: 30.2650, lng: 78.9300, date: '2024-07-18', type: 'rockfall', segment_id: 'seg-007' },
  { id: 'ev-09', lat: 30.2780, lng: 79.0400, date: '2024-09-05', type: 'landslide', segment_id: 'seg-008' },
  { id: 'ev-10', lat: 30.2600, lng: 79.1900, date: '2025-06-30', type: 'debris_flow', segment_id: 'seg-009' },
  { id: 'ev-11', lat: 30.3050, lng: 79.2600, date: '2025-08-01', type: 'landslide', segment_id: 'seg-010' },
  { id: 'ev-12', lat: 30.3850, lng: 79.3150, date: '2024-08-14', type: 'landslide', segment_id: 'seg-011' },
  { id: 'ev-13', lat: 30.4630, lng: 79.4000, date: '2025-07-15', type: 'rockfall', segment_id: 'seg-012' },
  { id: 'ev-14', lat: 30.5300, lng: 79.5300, date: '2025-09-10', type: 'landslide', segment_id: 'seg-013' },
  { id: 'ev-15', lat: 30.6500, lng: 79.5200, date: '2024-07-25', type: 'landslide', segment_id: 'seg-014' },
];

// --- Field report mock (accepts a submission and returns an id) ---

let reportCounter = 100;

export function submitFieldReport(
  _submission: { lat: number; lng: number; type: string; note?: string; client_id: string; language: string },
): FieldReport {
  reportCounter += 1;
  return {
    id: `fr-${reportCounter}`,
    lat: _submission.lat,
    lng: _submission.lng,
    type: _submission.type as FieldReport['type'],
    note: _submission.note,
    client_id: _submission.client_id,
    language: _submission.language,
    created_at: new Date().toISOString(),
    status: 'pending',
  };
}
