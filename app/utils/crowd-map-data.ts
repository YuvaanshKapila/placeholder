import { Location, BusyPeriod, Category, BusyStatus } from '../types/crowd-map';

function generateBusySchedule(
  peakHours: number[],
  type: 'grocery' | 'restaurant' | 'coffee' | 'gym' | 'library' | 'nature'
): BusyPeriod[] {
  const schedule: BusyPeriod[] = [];

  for (let hour = 0; hour < 24; hour++) {
    let status: 'quiet' | 'moderate' | 'busy' = 'quiet';
    let estimatedPeople = 5;

    if (peakHours.includes(hour)) {
      status = 'busy';
      estimatedPeople =
        type === 'grocery' ? 45 :
        type === 'restaurant' ? 35 :
        type === 'library' ? 60 :
        type === 'gym' ? 50 :
        type === 'nature' ? 15 :
        25;
    } else if (peakHours.some(p => Math.abs(p - hour) === 1)) {
      status = 'moderate';
      estimatedPeople =
        type === 'grocery' ? 25 :
        type === 'restaurant' ? 20 :
        type === 'library' ? 35 :
        type === 'gym' ? 30 :
        type === 'nature' ? 8 :
        15;
    } else {
      estimatedPeople =
        type === 'grocery' ? 8 :
        type === 'restaurant' ? 5 :
        type === 'library' ? 10 :
        type === 'gym' ? 8 :
        type === 'nature' ? 3 :
        3;
    }

    schedule.push({ hour, status, estimatedPeople });
  }

  return schedule;
}

export const categories: Category[] = [
  {
    id: 'grocery',
    name: 'Grocery Stores',
    keywords: ['walmart', 'grocery', 'supermarket', 'food', 'metro', 'loblaws', 'no frills'],
    color: '#10B981',
  },
  {
    id: 'restaurant',
    name: 'Restaurants',
    keywords: ['restaurant', 'food', 'dining', 'cafe', 'eatery', 'mcdonald', 'tim hortons', 'pizza', 'rex den'],
    color: '#F59E0B',
  },
  {
    id: 'coffee',
    name: 'Coffee Shops',
    keywords: ['coffee', 'starbucks', 'cafe', 'tim hortons', 'chatime', 'tea'],
    color: '#78350F',
  },
  {
    id: 'gym',
    name: 'Gyms & Sports',
    keywords: ['gym', 'fitness', 'workout', 'goodlife', 'planet fitness', 'pan am', 'tpasc', 'sports'],
    color: '#059669',
  },
  {
    id: 'library',
    name: 'Libraries & Study',
    keywords: ['library', 'study', 'books', 'research', 'quiet', 'reading'],
    color: '#3B82F6',
  },
  {
    id: 'nature',
    name: 'Nature & Trails',
    keywords: ['trail', 'valley', 'nature', 'park', 'outdoor', 'highland', 'creek', 'walk'],
    color: '#16A34A',
  },
];

export const locations: Location[] = [
  {
    id: 'utsc-library',
    name: 'UTSC Library',
    category: 'library',
    lat: 43.7841,
    lng: -79.1871,
    address: '1265 Military Trail, Scarborough',
    description: 'Study space with books and quiet areas',
    busySchedule: generateBusySchedule([10, 11, 14, 15, 16, 17, 18], 'library'),
  },
  {
    id: 'valley-trail',
    name: 'Valley Land Trail',
    category: 'nature',
    lat: 43.7835,
    lng: -79.1880,
    address: 'UTSC Campus - Valley Access',
    description: 'Accessible trail with nature views',
    busySchedule: generateBusySchedule([12, 13, 16, 17], 'nature'),
  },
  {
    id: 'tpasc',
    name: 'Toronto Pan Am Sports Centre',
    category: 'gym',
    lat: 43.7848,
    lng: -79.1883,
    address: '875 Morningside Ave, Scarborough',
    description: 'Large fitness facility with pools and gym',
    busySchedule: generateBusySchedule([7, 8, 17, 18, 19], 'gym'),
  },
  {
    id: 'rexs-den',
    name: "Rex's Den",
    category: 'restaurant',
    lat: 43.7844,
    lng: -79.1868,
    address: 'UTSC Student Centre',
    description: 'Campus eatery',
    busySchedule: generateBusySchedule([12, 13, 17, 18], 'restaurant'),
  },
  {
    id: 'chatime-utsc',
    name: 'Chatime',
    category: 'coffee',
    lat: 43.7842,
    lng: -79.1870,
    address: 'UTSC Student Centre',
    description: 'Bubble tea shop',
    busySchedule: generateBusySchedule([12, 13, 14, 15, 16], 'coffee'),
  },
  {
    id: 'timhortons-utsc',
    name: 'Tim Hortons UTSC',
    category: 'coffee',
    lat: 43.7838,
    lng: -79.1872,
    address: 'UTSC Campus',
    description: 'Coffee shop',
    busySchedule: generateBusySchedule([8, 9, 12, 13], 'coffee'),
  },
  {
    id: 'walmart-1',
    name: 'Walmart Supercentre',
    category: 'grocery',
    lat: 43.7850,
    lng: -79.1950,
    address: '4040 Lawrence Ave E, Scarborough',
    description: 'Large supermarket',
    busySchedule: generateBusySchedule([11, 12, 17, 18], 'grocery'),
  },
  {
    id: 'metro-1',
    name: 'Metro',
    category: 'grocery',
    lat: 43.7830,
    lng: -79.1850,
    address: '300 Borough Dr, Scarborough',
    description: 'Grocery store',
    busySchedule: generateBusySchedule([10, 11, 16, 17], 'grocery'),
  },
];

export function getBusyStatusColor(status: BusyStatus): string {
  switch (status) {
    case 'quiet':
      return '#10B981';
    case 'moderate':
      return '#F59E0B';
    case 'busy':
      return '#EF4444';
    default:
      return '#9CA3AF';
  }
}

export function getCurrentBusyStatus(location: Location): { status: BusyStatus; estimatedPeople: number } | null {
  if (!location?.busySchedule?.length) return null;

  const now = new Date();
  const currentHour = now.getHours();

  const currentPeriod = location.busySchedule.find(period => period.hour === currentHour);

  if (!currentPeriod) return null;

  return {
    status: currentPeriod.status,
    estimatedPeople: currentPeriod.estimatedPeople
  };
}
