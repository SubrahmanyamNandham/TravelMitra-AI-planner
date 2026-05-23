import type {
  NavLink, 
  StatItem, ProofBadge, NewsletterPerk,
} from './types';

export const DESTINATIONS = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1552058550-2b3f641af573?w=500&h=400&fit=crop',
    rating: 4.8,
    reviews: 2840,
    budget: '$1,200',
    description: 'Tropical paradise with beautiful beaches, rice terraces, and ancient temples.',
    highlights: ['Beaches', 'Temples', 'Culture', 'Food'],
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a9?w=500&h=400&fit=crop',
    rating: 4.9,
    reviews: 3521,
    budget: '$1,800',
    description: 'Modern metropolis blending cutting-edge technology with traditional culture.',
    highlights: ['Technology', 'Food', 'Shopping', 'Culture'],
  },
  {
    id: 3,
    name: 'Paris, France',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1524354973554-cd8db73f6d7e?w=500&h=400&fit=crop',
    rating: 4.7,
    reviews: 4103,
    budget: '$1,600',
    description: 'The City of Light with iconic landmarks, art museums, and world-class cuisine.',
    highlights: ['Art', 'History', 'Food', 'Romance'],
  },
  {
    id: 4,
    name: 'New York City, USA',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=400&fit=crop',
    rating: 4.6,
    reviews: 5234,
    budget: '$1,400',
    description: 'The city that never sleeps with endless attractions, shows, and dining.',
    highlights: ['Shopping', 'Shows', 'Food', 'Nightlife'],
  },
  {
    id: 5,
    name: 'Barcelona, Spain',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1562883676-8c6feb6d72cb?w=500&h=400&fit=crop',
    rating: 4.7,
    reviews: 3845,
    budget: '$950',
    description: 'Mediterranean charm with stunning architecture and vibrant street life.',
    highlights: ['Architecture', 'Beaches', 'Food', 'Culture'],
  },
  {
    id: 6,
    name: 'Dubai, UAE',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453475285-cf7ee93a2fdf?w=500&h=400&fit=crop',
    rating: 4.5,
    reviews: 2934,
    budget: '$1,500',
    description: 'Ultra-modern luxury destination with world-class shopping and entertainment.',
    highlights: ['Shopping', 'Luxury', 'Beaches', 'Architecture'],
  },
];

export const FEATURES = [
  {
    icon: '✨',
    title: 'AI Itinerary Generation',
    description: 'Get personalized travel plans powered by advanced AI algorithms in seconds.',
  },
  {
    icon: '🏨',
    title: 'Smart Hotel Recommendations',
    description: 'Find the perfect accommodation based on your preferences and budget.',
  },
  {
    icon: '🌦️',
    title: 'Real-time Weather Updates',
    description: 'Stay informed with accurate weather forecasts for your destination.',
  },
  {
    icon: '🗺️',
    title: 'Google Maps Integration',
    description: 'Explore destinations with integrated interactive mapping.',
  },
  {
    icon: '💰',
    title: 'Budget Optimization',
    description: 'Maximize your travel experience while staying within budget.',
  },
  {
    icon: '🔍',
    title: 'Hidden Gems Discovery',
    description: 'Uncover local secrets and off-the-beaten-path attractions.',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Travel Enthusiast',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    content: 'TravelMitra.io completely transformed how I plan trips. The AI suggestions are incredible and saved me so much time!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Traveler',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    content: 'The budget optimization feature helped me cut my travel costs by 30% without sacrificing quality.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Adventure Seeker',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    content: 'Found the most amazing hidden gems in Barcelona thanks to the app. Worth every penny!',
    rating: 4.5,
  },
];

export const CHAT_PREVIEW = {
  user: 'Suggest a 5-day trip to Japan under $2,000 for a first-time visitor',
  ai: `I'd love to help you plan an amazing 5-day Japan trip! Here's my recommendation:

**Day 1-2: Tokyo**
- Arrive in Tokyo, explore Shibuya & Shinjuku
- Visit Senso-ji Temple and traditional neighborhoods
- Hotel: Budget-friendly capsule hotel or hostel ($40-60/night)

**Day 3: Kyoto**
- Take the Shinkansen bullet train (covered in JR Pass)
- Explore Fushimi Inari Shrine & Arashiyama Bamboo Grove
- Traditional ryokan experience ($80-100/night)

**Day 4-5: Osaka**
- Day trip to Kobe or local Osaka attractions
- Osaka Castle and Dotonbori district
- Budget accommodation ($50-70/night)

**Budget Breakdown:**
- Flights: $800-1000
- JR Pass 7-day: $280
- Accommodation: $400
- Food & Activities: $300-400
- Total: ~$1,900

**Pro Tips:**
✓ Travel during shoulder seasons for better rates
✓ Use convenience stores for affordable meals
✓ Buy a Suica card for easy transport

Ready to book? 🚀`,
};

export const MENU_LINKS = [
  { label: 'Explore', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Blog', href: '#' },
];

export const SOCIAL_LINKS = [
  { icon: 'twitter', url: '#' },
  { icon: 'facebook', url: '#' },
  { icon: 'instagram', url: '#' },
  { icon: 'linkedin', url: '#' },
];


 
export const NAV_LINKS: NavLink[] = [
  { label: 'Features',      href: '#features' },
  { label: 'Destinations',  href: '#destinations' },
  { label: 'AI Chat',       href: '#ai-chat' },
  { label: 'Reviews',       href: '#testimonials' },
  { label: 'Newsletter',    href: '#newsletter' },
];
 
 
 
export const HERO_STATS: StatItem[] = [
  { number: '50K+',  label: 'Destinations' },
  { number: '500K+', label: 'Happy Travelers' },
  { number: '100K+', label: 'Itineraries Created' },
  { number: '99%',   label: 'Satisfaction Rate' },
];
 
export const PROOF_BADGES: ProofBadge[] = [
  { value: '500K+', label: 'Active Users' },
  { value: '2M+',   label: 'Trips Planned' },
  { value: '4.9 ★', label: 'Avg Rating' },
  { value: '195',   label: 'Countries' },
];
 
export const NEWSLETTER_PERKS: NewsletterPerk[] = [
  { icon: '📧', title: 'Weekly Tips',      desc: 'Travel hacks & guides' },
  { icon: '🎉', title: 'Exclusive Deals',  desc: 'Limited offers first' },
  { icon: '🤖', title: 'AI Picks',         desc: 'Personalized for you' },
];
 
export const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Security', 'Blog'],
  Company: ['About Us', 'Careers', 'Press Kit', 'Contact'],
  Legal:   ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'License'],
};