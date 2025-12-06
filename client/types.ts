

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  gallery?: string[]; // Multiple images for the project details page
  tags: string[];
  technologies: string[];
  category: string;
  businessUnit: string;
  featured: boolean;
  status?: string; // New field for listing status (e.g. "Live", "In Development")
  websiteUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  serviceInterest: string;
  message: string;
  consent: boolean;
  createdAt: string;
  status: 'new' | 'read' | 'resolved';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
  isActive: boolean;
  expiryDate?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML string
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
}

export interface AdminUser {
  email: string;
  token: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  imageUrl: string;
  rating?: number;
}

export enum ServiceInterest {
  WEB_DEV = 'Web Development',
  DESIGN = 'UI/UX Design',
  SEO = 'SEO & Marketing',
  CONSULTING = 'Consulting',
  OTHER = 'Other'
}