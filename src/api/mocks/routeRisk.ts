import type { RouteRisk, RouteRiskSegment, Level } from '../types';
import { getSegments, type Scenario } from './segments';
import { towns } from './towns';

/**
 * Mock route-risk: returns the segments between two towns for a given date.
 * Risk levels are derived deterministically from the date so each of the
 * next 7 days looks different.
 */
export function getRouteRisk(
  from: string,
  to: string,
  date: string,
  scenario: Scenario = 'dry',
): RouteRisk {
  const fromTown = towns.find(t => t.id === from);
  const toTown = towns.find(t => t.id === to);
  if (!fromTown || !toTown) {
    throw new Error(`Unknown town: ${from} or ${to}`);
  }

  const kmStart = Math.min(fromTown.km, toTown.km);
  const kmEnd = Math.max(fromTown.km, toTown.km);

  const allSegments = getSegments(scenario);
  const routeSegments = allSegments.filter(
    s => s.km_end > kmStart && s.km_start < kmEnd,
  );

  // Derive a day offset from the date to shift levels deterministically
  const dateObj = new Date(date);
  const dayOfYear = Math.floor(
    (dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const dayOffset = dayOfYear % 7;

  const levelShifts = [0, 1, 0, -1, 1, 0, -1]; // Variation per day-of-week

  const segments: RouteRiskSegment[] = routeSegments.map(s => {
    const shifted = Math.max(0, Math.min(3, s.level + levelShifts[(dayOffset + s.km_start) % 7]));
    return { id: s.id, level: shifted as Level };
  });

  const worstLevel = Math.max(0, ...segments.map(s => s.level)) as Level;

  return {
    from,
    to,
    date,
    level: worstLevel,
    segments,
  };
}
