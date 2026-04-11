// ── Providers ───────────────────────────────────────────────────────

export type Provider = 'lime' | 'voi' | 'dott' | 'velib';

export const ALL_PROVIDERS: Provider[] = ['lime', 'voi', 'dott', 'velib'];

export const PROVIDER_COLORS: Record<Provider, string> = {
  lime: '#00de00',
  voi: '#f44336',
  dott: '#f5a623',
  velib: '#6b3fa0',
};

// ── Vehicle types ───────────────────────────────────────────────────

export type FormFactor = 'scooter' | 'bicycle';
export type PropulsionType = 'electric' | 'electric_assist' | 'human';

export interface VehicleType {
  vehicle_type_id: string;
  form_factor: FormFactor;
  propulsion_type: PropulsionType;
  name?: string;
  rider_capacity?: number;
  max_range_meters?: number;
}

// Lime vehicle type IDs
export type LimeVehicleTypeId = '1' | '2' | '3' | '4';

// Voi vehicle type IDs
export type VoiVehicleTypeId = 'voi_scooter' | 'voi_bike';

// Dott vehicle type IDs
export type DottVehicleTypeId = 'dott_bicycle';

export const VEHICLE_TYPES: Record<string, VehicleType> = {
  // Lime
  '1': {
    vehicle_type_id: '1',
    form_factor: 'scooter',
    propulsion_type: 'electric',
    max_range_meters: 24140,
  },
  '2': {
    vehicle_type_id: '2',
    form_factor: 'scooter',
    propulsion_type: 'electric',
    max_range_meters: 40233,
  },
  '3': {
    vehicle_type_id: '3',
    form_factor: 'bicycle',
    propulsion_type: 'electric_assist',
    max_range_meters: 85000,
  },
  '4': {
    vehicle_type_id: '4',
    form_factor: 'bicycle',
    propulsion_type: 'human',
  },
  // Voi
  voi_scooter: {
    vehicle_type_id: 'voi_scooter',
    form_factor: 'scooter',
    propulsion_type: 'electric',
    name: 'scooter',
    rider_capacity: 1,
    max_range_meters: 80000,
  },
  voi_bike: {
    vehicle_type_id: 'voi_bike',
    form_factor: 'bicycle',
    propulsion_type: 'electric_assist',
    name: 'bicycle',
    rider_capacity: 1,
    max_range_meters: 80000,
  },
  // Dott
  dott_bicycle: {
    vehicle_type_id: 'dott_bicycle',
    form_factor: 'bicycle',
    propulsion_type: 'electric_assist',
    name: 'bicycle',
    max_range_meters: 100000,
  },
};

// ── GBFS types ──────────────────────────────────────────────────────

export interface GbfsResponse {
  last_updated: number;
  ttl: number;
  version: string;
  data: { bikes: GbfsBike[] };
}

export interface GbfsBike {
  bike_id: string;
  lat: number;
  lon: number;
  is_reserved: boolean;
  is_disabled: boolean;
  current_range_meters?: number;
  current_fuel_percent?: number;
  vehicle_type_id?: string;
  last_reported?: number;
}

// ── App bike (enriched) ─────────────────────────────────────────────

export interface Bike {
  kind: 'bike';
  bike_id: string;
  lat: number;
  lon: number;
  is_reserved?: boolean;
  is_disabled?: boolean;
  vehicle_type_id?: string;
  form_factor?: FormFactor;
  current_range_meters?: number;
  max_range_meters?: number;
  battery_percent?: number;
  distance?: number;
  provider: Provider;
}

// ── Vélib station (enriched) ────────────────────────────────────────

export interface VelibStation {
  kind: 'station';
  station_id: string;
  stationCode?: string;
  name: string | null;
  lat: number;
  lon: number;
  capacity: number | null;
  num_bikes_available: number;
  mechanical: number;
  ebike: number;
  num_docks_available: number;
  is_installed?: number;
  is_renting?: number;
  is_returning?: number;
  distance?: number;
  provider: 'velib';
}

// ── Map entity (discriminated union) ───────────────────────────────

export type MapEntity = Bike | VelibStation;

// ── Profile / Filters ───────────────────────────────────────────────

/** -1 = not set / unlimited */
export const UNSET = -1;

export const FILTER_BOUNDS = {
  limit: { min: 5, max: 100, step: 5, default: 100 },
  maxDistance: { min: UNSET, max: 10_000, step: 100, default: UNSET },
  minBattery: { min: UNSET, max: 100, step: 5, default: UNSET },
  pollInterval: { min: 15, max: 300, step: 15, default: 60 },
} as const;

export type LocationMode = 'geo' | 'manual';

export interface ProfileState {
  lat: number | null;
  lng: number | null;
  locationMode: LocationMode;
  providers: Provider[];
  limit: number;
  maxDistance: number;
  minBattery: number;
  pollInterval: number;
}

export function createDefaultState(): ProfileState {
  return {
    lat: null,
    lng: null,
    locationMode: 'geo',
    providers: [...ALL_PROVIDERS],
    limit: FILTER_BOUNDS.limit.default,
    maxDistance: FILTER_BOUNDS.maxDistance.default,
    minBattery: FILTER_BOUNDS.minBattery.default,
    pollInterval: FILTER_BOUNDS.pollInterval.default,
  };
}
