/**
 * API types from section 8 of 00_DESIGN_SYSTEM.md.
 * These types define the shape of data the UI expects from the backend.
 */

export type Level = 0 | 1 | 2 | 3;

export interface Factor {
  code: string;
  weight: number;
}

export interface Rain {
  last_24h_mm: number;
  next_24h_mm: number;
}

export interface Geometry {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

export interface Segment {
  id: string;
  name: string;
  km_start: number;
  km_end: number;
  level: Level;
  score: number;
  top_reason: string;
  factors: Factor[];
  rain: Rain;
  geometry: Geometry;
}

export interface RiskMapResponse {
  updated_at: string;
  segments: Segment[];
}

export interface Town {
  id: string;
  name_en: string;
  name_hi: string;
  km: number;
  lat: number;
  lng: number;
}

export interface RouteRiskSegment {
  id: string;
  level: Level;
}

export interface RouteRisk {
  from: string;
  to: string;
  date: string;
  level: Level;
  segments: RouteRiskSegment[];
}

export interface Alert {
  id: string;
  segment_id: string;
  level: Level;
  code: string;
  created_at: string;
  expires_at: string;
}

export interface HistoryEvent {
  id: string;
  lat: number;
  lng: number;
  date: string;
  type: string;
  segment_id: string;
}

export interface FieldReport {
  id: string;
  photo_url?: string;
  lat: number;
  lng: number;
  type: 'slide' | 'rockfall' | 'crack' | 'water' | 'blocked';
  note?: string;
  client_id: string;
  language: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  segment_id?: string;
}

export interface FieldReportSubmission {
  lat: number;
  lng: number;
  type: FieldReport['type'];
  note?: string;
  client_id: string;
  language: string;
}
