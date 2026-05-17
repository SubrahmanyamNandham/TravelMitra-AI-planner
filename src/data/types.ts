export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviews: string;
  budget: string;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface ProofBadge {
  value: string;
  label: string;
}

export interface NewsletterPerk {
  icon: string;
  title: string;
  desc: string;
}