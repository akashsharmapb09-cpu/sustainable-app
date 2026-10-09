export type TransportMode = 'car' | 'bus' | 'metro' | 'walk' | 'bike';

const EMISSION_FACTORS_KG_PER_KM: Readonly<Record<TransportMode, number>> = {
  car: 0.1705,
  bus: 0.08,
  metro: 0.015,
  walk: 0,
  bike: 0,
};

export function getTransportEmissionFactor(mode: TransportMode): number {
  return EMISSION_FACTORS_KG_PER_KM[mode];
}

export function estimateTransportEmissions(distanceKm: number, tripsPerWeek: number, mode: TransportMode): number {
  if (!Number.isFinite(distanceKm) || distanceKm < 0 || distanceKm > 500) throw new RangeError('Distance must be between 0 and 500 km.');
  if (!Number.isInteger(tripsPerWeek) || tripsPerWeek < 0 || tripsPerWeek > 14) throw new RangeError('Trips per week must be an integer from 0 to 14.');
  return distanceKm * tripsPerWeek * 4.33 * getTransportEmissionFactor(mode);
}
