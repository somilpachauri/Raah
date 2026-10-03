import type { Town } from '../types';

/**
 * Towns along NH-7 (Rishikesh to Badrinath).
 * Approximate km from Rishikesh and lat/lng.
 */
export const towns: Town[] = [
  { id: 'rishikesh',   name_en: 'Rishikesh',    name_hi: 'ऋषिकेश',    km: 0,   lat: 30.0869, lng: 78.2676 },
  { id: 'devprayag',   name_en: 'Devprayag',    name_hi: 'देवप्रयाग',   km: 70,  lat: 30.1466, lng: 78.5964 },
  { id: 'srinagar',    name_en: 'Srinagar',     name_hi: 'श्रीनगर',     km: 105, lat: 30.2206, lng: 78.7833 },
  { id: 'rudraprayag', name_en: 'Rudraprayag',  name_hi: 'रुद्रप्रयाग',  km: 140, lat: 30.2840, lng: 78.9801 },
  { id: 'karnaprayag', name_en: 'Karnaprayag',  name_hi: 'कर्णप्रयाग',  km: 170, lat: 30.2597, lng: 79.2128 },
  { id: 'chamoli',     name_en: 'Chamoli',      name_hi: 'चमोली',      km: 215, lat: 30.4031, lng: 79.3264 },
  { id: 'joshimath',   name_en: 'Joshimath',    name_hi: 'जोशीमठ',    km: 255, lat: 30.5567, lng: 79.5660 },
  { id: 'badrinath',   name_en: 'Badrinath',    name_hi: 'बद्रीनाथ',    km: 295, lat: 30.7433, lng: 79.4938 },
];
