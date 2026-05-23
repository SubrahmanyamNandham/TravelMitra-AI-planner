export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  image: string;
  rating: number;
  avg_budget_per_week: number;
  currency: string;
  best_season: string;
  tags: string[];
  highlights: string[];
  visa_on_arrival: boolean;
  language: string;
  time_zone: string;
}

export const destinations: Destination[] = [
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    description: 'A tropical island famous for rice terraces, temples, beaches, and vibrant wellness culture.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    avg_budget_per_week: 950,
    currency: 'USD',
    best_season: 'April to October',
    tags: ['beaches', 'wellness', 'culture', 'temples'],
    highlights: ['Ubud rice terraces', 'Tanah Lot sunset temple', 'Seminyak beach day', 'Balinese spa experience'],
    visa_on_arrival: true,
    language: 'Indonesian',
    time_zone: 'UTC+8'
  },
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    description: 'Ancient capital full of shrines, tea houses, bento culture, and cherry blossom-lined streets.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    avg_budget_per_week: 1800,
    currency: 'USD',
    best_season: 'March to May',
    tags: ['culture', 'history', 'food', 'temples'],
    highlights: ['Fushimi Inari', 'Gion geisha district', 'Arashiyama bamboo grove', 'Kaiseki dining'],
    visa_on_arrival: false,
    language: 'Japanese',
    time_zone: 'UTC+9'
  },
  {
    id: 'santorini-greece',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    description: 'A postcard-perfect island with white-washed villages, volcanic cliffs, and world-class sunsets.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    avg_budget_per_week: 2200,
    currency: 'USD',
    best_season: 'May to September',
    tags: ['romance', 'beaches', 'scenery', 'wine'],
    highlights: ['Oia sunset', 'volcano cruise', 'vineyard tasting', 'Akrotiri ruins'],
    visa_on_arrival: false,
    language: 'Greek',
    time_zone: 'UTC+2'
  },
  {
    id: 'new-york-usa',
    name: 'New York City',
    country: 'United States',
    continent: 'North America',
    description: 'The city that never sleeps, packed with iconic architecture, cuisine, museums, and cultural neighborhoods.',
    image: 'https://images.unsplash.com/photo-1549921296-3a57ec8b1f12?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    avg_budget_per_week: 2400,
    currency: 'USD',
    best_season: 'April to June, September to November',
    tags: ['cities', 'food', 'art', 'nightlife'],
    highlights: ['Central Park', 'Metropolitan Museum', 'Broadway show', 'Brooklyn food tour'],
    visa_on_arrival: false,
    language: 'English',
    time_zone: 'UTC-5'
  },
  {
    id: 'cape-town-south-africa',
    name: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    description: 'A coastal city framed by Table Mountain, offering vibrant markets, vineyards, and dramatic scenery.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    avg_budget_per_week: 1300,
    currency: 'USD',
    best_season: 'November to March',
    tags: ['adventure', 'nature', 'wine', 'beaches'],
    highlights: ['Table Mountain hike', 'Robben Island', 'Cape Winelands', 'Clifton beach'],
    visa_on_arrival: false,
    language: 'English',
    time_zone: 'UTC+2'
  },
  {
    id: 'reykjavik-iceland',
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    description: 'A compact Nordic capital serving as a gateway to glaciers, hot springs, and northern lights adventures.',
    image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    avg_budget_per_week: 2700,
    currency: 'USD',
    best_season: 'June to August',
    tags: ['nature', 'wellness', 'adventure', 'scenery'],
    highlights: ['Golden Circle', 'Blue Lagoon', 'glacier walk', 'northern lights'],
    visa_on_arrival: false,
    language: 'Icelandic',
    time_zone: 'UTC'
  },
  {
    id: 'lisbon-portugal',
    name: 'Lisbon',
    country: 'Portugal',
    continent: 'Europe',
    description: 'A coastal European capital with historic tram-lined streets, pastel architecture, and a lively food scene.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    avg_budget_per_week: 1500,
    currency: 'USD',
    best_season: 'April to June, September to October',
    tags: ['culture', 'food', 'history', 'beaches'],
    highlights: ['Belém Tower', 'Alfama district', 'pastel de nata tasting', 'Sintra day trip'],
    visa_on_arrival: false,
    language: 'Portuguese',
    time_zone: 'UTC'
  },
  {
    id: 'queenstown-new-zealand',
    name: 'Queenstown',
    country: 'New Zealand',
    continent: 'Oceania',
    description: 'The adventure capital with alpine lakes, mountain vistas, bungee, and refined food and wine experiences.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    avg_budget_per_week: 2100,
    currency: 'USD',
    best_season: 'December to February',
    tags: ['adventure', 'nature', 'luxury', 'outdoors'],
    highlights: ['Milford Sound cruise', 'bungee jump', 'wine tour', 'lakefront hiking'],
    visa_on_arrival: false,
    language: 'English',
    time_zone: 'UTC+12'
  }
];
