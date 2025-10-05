export type BusyStatus = 'quiet' | 'moderate' | 'busy';

export interface BusyPeriod {
  hour: number;
  status: BusyStatus;
  estimatedPeople: number;
}

export interface Location {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  busySchedule: BusyPeriod[];
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  keywords: string[];
  color: string;
}
