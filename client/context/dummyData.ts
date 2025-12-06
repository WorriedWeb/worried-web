

import { Project, Service, Testimonial, TeamMember, FAQ, Offer, BlogPost, HeroContent } from '../types';

export const DUMMY_HERO: HeroContent = {
  headline: "Don't worry about your web presence.",
  subheadline: "We handle the complexity of digital transformation so you can focus on your business growth. Reliable code, warm design, and energetic results.",
  ctaText: "Start a Project",
  ctaLink: "/contact"
};

export const DUMMY_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Custom Web Development',
    description: 'Robust, scalable, and secure web applications built with modern technologies like React, Node.js, and Python.',
    icon: 'Code'
  },
  {
    id: '2',
    title: 'UI/UX Design',
    description: 'User-centric design that balances aesthetics with functionality to create intuitive and engaging digital experiences.',
    icon: 'PenTool'
  },
  {
    id: '3',
    title: 'E-Commerce Solutions',
    description: 'High-conversion online stores with secure payment gateways, inventory management, and seamless checkout flows.',
    icon: 'Layout'
  },
  {
    id: '4',
    title: 'Performance Optimization',
    description: 'Speed up your existing website to improve SEO rankings, user retention, and conversion rates.',
    icon: 'Zap'
  },
  {
    id: '5',
    title: 'Cloud Infrastructure',
    description: 'Secure and scalable cloud deployment, server management, and DevOps automation.',
    icon: 'Server'
  },
  {
    id: '6',
    title: 'Mobile App Development',
    description: 'Cross-platform mobile applications that provide a native experience on both iOS and Android.',
    icon: 'Smartphone'
  }
];

export const DUMMY_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'LuxeHomes Realty',
    slug: 'luxehomes-realty',
    description: 'A premium real estate platform featuring virtual tours, advanced property filtering, and an integrated CRM for agents. We reduced page load times by 40% and increased lead generation by 25%.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-600025518150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Real Estate', 'Virtual Tour', 'CRM Integration'],
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    category: 'Web App',
    businessUnit: 'Real Estate',
    featured: true,
    status: 'Live',
    websiteUrl: 'https://example.com/realestate'
  },
  {
    id: '2',
    title: 'EcoMarket',
    slug: 'ecomarket',
    description: 'A sustainable e-commerce marketplace connecting eco-friendly brands with conscious consumers. Features include carbon footprint tracking per product and a loyalty reward system.',
    imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    gallery: [
       'https://images.unsplash.com/photo-1472851294608-4155f2118c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['E-Commerce', 'Sustainability', 'Marketplace'],
    technologies: ['Next.js', 'Stripe', 'PostgreSQL'],
    category: 'E-Commerce',
    businessUnit: 'Retail',
    featured: true,
    status: 'Live',
    websiteUrl: 'https://example.com/eco'
  },
  {
    id: '3',
    title: 'FinTrack Pro',
    slug: 'fintrack-pro',
    description: 'A personal finance dashboard helping users track expenses, set budgets, and visualize investment growth. Built with high-security standards and real-time bank integration.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    gallery: [],
    tags: ['FinTech', 'Data Visualization', 'Security'],
    technologies: ['Vue.js', 'Python', 'Django'],
    category: 'Web App',
    businessUnit: 'Finance',
    featured: false,
    status: 'In Progress',
    websiteUrl: ''
  },
  {
    id: '4',
    title: 'HealthConnect',
    slug: 'healthconnect',
    description: 'Telemedicine platform facilitating secure video consultations between patients and doctors, including prescription management and appointment scheduling.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    gallery: [],
    tags: ['Healthcare', 'Video Streaming', 'HIPAA Compliant'],
    technologies: ['React Native', 'WebRTC', 'Firebase'],
    category: 'Mobile App',
    businessUnit: 'Healthcare',
    featured: false,
    status: 'Maintenance',
    websiteUrl: ''
  }
];

export const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    text: "Worried Web transformed our chaotic legacy system into a sleek, modern platform. The peace of mind they provided throughout the process was invaluable.",
    author: "Sarah Jenkins",
    role: "CTO, TechFlow",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    id: '2',
    text: "I was stressed about our launch deadline, but the team stepped in and not only met the deadline but exceeded our quality expectations. Truly energetic results!",
    author: "Michael Chen",
    role: "Founder, StartUp Inc",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: '3',
    text: "Their attention to detail is unmatched. They caught issues we didn't even know existed and fixed them before launch. Highly recommended.",
    author: "Elena Rodriguez",
    role: "Director of Marketing, CreativeCo",
    imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5
  }
];

export const DUMMY_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'Lead Developer',
    imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: '2',
    name: 'Jordan Lee',
    role: 'UI/UX Designer',
    imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
  {
    id: '3',
    name: 'Casey Smith',
    role: 'Project Manager',
    imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
  {
    id: '4',
    name: 'Taylor Doe',
    role: 'DevOps Engineer',
    imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg'
  }
];

export const DUMMY_FAQS: FAQ[] = [
  {
    id: '1',
    question: "How long does a typical project take?",
    answer: "Project timelines vary depending on complexity. A standard business website might take 4-6 weeks, while a custom web application could take 3-6 months. We provide a detailed timeline during our initial consultation."
  },
  {
    id: '2',
    question: "Do you provide ongoing support?",
    answer: "Absolutely. We believe in long-term partnerships. We offer various maintenance packages to ensure your digital product remains secure, up-to-date, and performant after launch."
  },
  {
    id: '3',
    question: "What makes 'Worried Web' different?",
    answer: "We focus on 'Digital Peace of Mind'. We don't just write code; we anticipate problems, handle the technical complexity, and ensure you never have to worry about your technology stack."
  },
  {
    id: '4',
    question: "Can you work with our existing team?",
    answer: "Yes, we often collaborate with internal teams to augment capabilities or handle specific parts of a larger project. We are flexible in our engagement models."
  }
];

export const DUMMY_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Free Technical Audit',
    description: 'Get a comprehensive review of your current website\'s performance, security, and SEO health.',
    code: 'AUDIT2024',
    isActive: true
  }
];

export const DUMMY_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Calm Before the Code: Planning for Success',
    slug: 'calm-before-code',
    excerpt: 'Why thorough discovery and planning phases are the antidote to development anxiety.',
    content: '<p>Planning is often overlooked in the rush to build...</p>',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    author: 'Alex Rivera',
    publishedAt: '2023-10-15',
    tags: ['Planning', 'Strategy']
  },
  {
    id: '2',
    title: 'Modern Web Vitals: Why Speed Matters',
    slug: 'modern-web-vitals',
    excerpt: 'Understanding Google\'s Core Web Vitals and how they impact your user experience and SEO.',
    content: '<p>Speed is not just a metric, it is a feature...</p>',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    author: 'Jordan Lee',
    publishedAt: '2023-11-02',
    tags: ['SEO', 'Performance']
  }
];