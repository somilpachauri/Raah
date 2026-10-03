import type { Segment, Level } from '../types';

/**
 * SAMPLE DATA – approximate geometry following the Alaknanda/Ganga valley.
 * Coordinates are illustrative and not surveyed. Good enough for the demo.
 *
 * 14 segments covering km 0 to 295 (Rishikesh to Badrinath).
 */

// --- Scenario definitions ---

export type Scenario = 'dry' | 'heavy-rain' | 'blocked';

interface ScenarioLevels {
  levels: Level[];
  scores: number[];
  topReasons: string[];
}

const scenarioData: Record<Scenario, ScenarioLevels> = {
  dry: {
    levels:     [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    scores:     [8, 12, 15, 35, 10, 14, 9, 38, 11, 7, 13, 16, 10, 5],
    topReasons: ['slope', 'slope', 'history', 'wet', 'slope', 'slope', 'slope', 'history', 'slope', 'slope', 'slope', 'slope', 'slope', 'slope'],
  },
  'heavy-rain': {
    levels:     [0, 1, 1, 2, 2, 1, 2, 3, 2, 1, 1, 0, 1, 0],
    scores:     [15, 42, 45, 72, 68, 48, 71, 92, 65, 39, 44, 18, 40, 12],
    topReasons: ['slope', 'rain_24h', 'rain_24h', 'rain_24h', 'rain_24h', 'wet', 'rain_24h', 'rain_24h', 'rain_24h', 'wet', 'wet', 'slope', 'wet', 'slope'],
  },
  blocked: {
    levels:     [0, 0, 1, 2, 1, 1, 2, 3, 1, 1, 0, 0, 0, 0],
    scores:     [10, 14, 40, 75, 38, 42, 70, 98, 35, 38, 15, 12, 10, 8],
    topReasons: ['slope', 'slope', 'rain_24h', 'rain_24h', 'wet', 'rain_24h', 'rain_24h', 'rain_24h', 'wet', 'wet', 'slope', 'slope', 'slope', 'slope'],
  },
};

// --- Segment geometry data ---
// Each segment has 8-20 [lng, lat] points roughly following the valley.

interface SegmentTemplate {
  id: string;
  name: string;
  km_start: number;
  km_end: number;
  geometry: [number, number][];
}

const segmentTemplates: SegmentTemplate[] = [
  {
    id: 'seg-001', name: 'Rishikesh to Shivpuri', km_start: 0, km_end: 16,
    geometry: [[78.2676,30.0869],[78.2900,30.0950],[78.3100,30.1020],[78.3300,30.1100],[78.3500,30.1180],[78.3650,30.1250],[78.3800,30.1310],[78.3940,30.1360]],
  },
  {
    id: 'seg-002', name: 'Shivpuri to Byasi', km_start: 16, km_end: 35,
    geometry: [[78.3940,30.1360],[78.4100,30.1400],[78.4300,30.1450],[78.4500,30.1480],[78.4700,30.1500],[78.4900,30.1520],[78.5050,30.1540],[78.5200,30.1550],[78.5350,30.1560]],
  },
  {
    id: 'seg-003', name: 'Byasi to Devprayag', km_start: 35, km_end: 70,
    geometry: [[78.5350,30.1560],[78.5450,30.1570],[78.5550,30.1540],[78.5650,30.1510],[78.5700,30.1480],[78.5780,30.1470],[78.5850,30.1465],[78.5964,30.1466]],
  },
  {
    id: 'seg-004', name: 'Devprayag to Kirtinagar', km_start: 70, km_end: 90,
    geometry: [[78.5964,30.1466],[78.6100,30.1500],[78.6300,30.1600],[78.6500,30.1700],[78.6700,30.1800],[78.6900,30.1900],[78.7100,30.2000],[78.7300,30.2100],[78.7500,30.2150]],
  },
  {
    id: 'seg-005', name: 'Kirtinagar to Srinagar', km_start: 90, km_end: 105,
    geometry: [[78.7500,30.2150],[78.7550,30.2170],[78.7600,30.2190],[78.7650,30.2200],[78.7700,30.2210],[78.7750,30.2200],[78.7800,30.2205],[78.7833,30.2206]],
  },
  {
    id: 'seg-006', name: 'Srinagar to Kaliasaur', km_start: 105, km_end: 112,
    geometry: [[78.7833,30.2206],[78.8000,30.2250],[78.8200,30.2300],[78.8400,30.2350],[78.8600,30.2400],[78.8750,30.2450],[78.8900,30.2500],[78.9000,30.2550]],
  },
  {
    id: 'seg-007', name: 'Kaliasaur to Rudraprayag', km_start: 112, km_end: 140,
    geometry: [[78.9000,30.2550],[78.9100,30.2580],[78.9200,30.2610],[78.9300,30.2650],[78.9400,30.2700],[78.9500,30.2740],[78.9600,30.2780],[78.9700,30.2810],[78.9801,30.2840]],
  },
  {
    id: 'seg-008', name: 'Rudraprayag to Gauchar', km_start: 140, km_end: 160,
    geometry: [[78.9801,30.2840],[79.0000,30.2830],[79.0200,30.2810],[79.0400,30.2780],[79.0600,30.2750],[79.0800,30.2720],[79.1000,30.2680],[79.1200,30.2650],[79.1400,30.2620],[79.1600,30.2600]],
  },
  {
    id: 'seg-009', name: 'Gauchar to Karnaprayag', km_start: 160, km_end: 170,
    geometry: [[79.1600,30.2600],[79.1700,30.2600],[79.1800,30.2600],[79.1900,30.2600],[79.2000,30.2598],[79.2128,30.2597]],
  },
  {
    id: 'seg-010', name: 'Karnaprayag to Nandprayag', km_start: 170, km_end: 195,
    geometry: [[79.2128,30.2597],[79.2200,30.2650],[79.2300,30.2750],[79.2400,30.2850],[79.2500,30.2950],[79.2600,30.3050],[79.2700,30.3150],[79.2800,30.3250],[79.2900,30.3350]],
  },
  {
    id: 'seg-011', name: 'Nandprayag to Chamoli', km_start: 195, km_end: 215,
    geometry: [[79.2900,30.3350],[79.2950,30.3450],[79.3000,30.3550],[79.3050,30.3650],[79.3100,30.3750],[79.3150,30.3850],[79.3200,30.3950],[79.3264,30.4031]],
  },
  {
    id: 'seg-012', name: 'Chamoli to Pipalkoti', km_start: 215, km_end: 235,
    geometry: [[79.3264,30.4031],[79.3400,30.4150],[79.3550,30.4270],[79.3700,30.4390],[79.3850,30.4510],[79.4000,30.4630],[79.4150,30.4750],[79.4300,30.4870]],
  },
  {
    id: 'seg-013', name: 'Pipalkoti to Joshimath', km_start: 235, km_end: 255,
    geometry: [[79.4300,30.4870],[79.4450,30.4950],[79.4600,30.5030],[79.4750,30.5120],[79.4900,30.5200],[79.5100,30.5300],[79.5300,30.5400],[79.5500,30.5500],[79.5660,30.5567]],
  },
  {
    id: 'seg-014', name: 'Joshimath to Badrinath', km_start: 255, km_end: 295,
    geometry: [[79.5660,30.5567],[79.5600,30.5700],[79.5500,30.5900],[79.5400,30.6100],[79.5300,30.6300],[79.5200,30.6500],[79.5100,30.6700],[79.5050,30.6900],[79.5000,30.7100],[79.4960,30.7250],[79.4938,30.7433]],
  },
];

function makeFactors(topReason: string): { code: string; weight: number }[] {
  const allCodes = ['rain_24h', 'wet', 'slope', 'history'];
  const top = { code: topReason, weight: 0.7 + Math.random() * 0.2 };
  const others = allCodes
    .filter(c => c !== topReason)
    .slice(0, 2)
    .map(code => ({ code, weight: 0.2 + Math.random() * 0.4 }));
  return [top, ...others];
}

function makeRain(level: Level): { last_24h_mm: number; next_24h_mm: number } {
  const base = [8, 28, 64, 110][level];
  const forecast = [4, 18, 38, 80][level];
  return {
    last_24h_mm: base + Math.floor(Math.random() * 10),
    next_24h_mm: forecast + Math.floor(Math.random() * 10),
  };
}

export function getSegments(scenario: Scenario = 'dry'): Segment[] {
  const data = scenarioData[scenario];
  return segmentTemplates.map((t, i) => ({
    ...t,
    level: data.levels[i] as Level,
    score: data.scores[i],
    top_reason: data.topReasons[i],
    factors: makeFactors(data.topReasons[i]),
    rain: makeRain(data.levels[i] as Level),
    geometry: { type: 'LineString' as const, coordinates: t.geometry },
  }));
}
