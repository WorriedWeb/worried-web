
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, ContactMessage, TeamMember, Testimonial, Service, FAQ, HeroContent, Lead, Offer, Subscriber, BlogPost } from '../types';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { 
  DUMMY_PROJECTS, 
  DUMMY_SERVICES, 
  DUMMY_TESTIMONIALS, 
  DUMMY_TEAM, 
  DUMMY_FAQS, 
  DUMMY_OFFERS, 
  DUMMY_BLOG_POSTS, 
  DUMMY_HERO 
} from './dummyData';

interface DataContextType {
  projects: Project[];
  messages: ContactMessage[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  services: Service[];
  faqs: FAQ[];
  leads: Lead[];
  offers: Offer[];
  subscribers: Subscriber[];
  heroContent: HeroContent;
  blogPosts: BlogPost[];
  
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, project: Project) => Promise<void>;
  deleteProject: (id: string) => void;
  
  addMessage: (message: ContactMessage) => void;
  updateMessageStatus: (id: string, status: 'new' | 'read' | 'resolved') => void;
  deleteMessage: (id: string) => void;

  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;

  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  addService: (service: Service) => void;
  updateService: (id: string, service: Service) => void;
  deleteService: (id: string) => void;

  addFAQ: (faq: FAQ) => void;
  updateFAQ: (id: string, faq: FAQ) => void;
  deleteFAQ: (id: string) => void;

  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Lead) => void;
  deleteLead: (id: string) => void;

  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, offer: Offer) => void;
  deleteOffer: (id: string) => void;

  addSubscriber: (email: string) => void;
  deleteSubscriber: (id: string) => void;

  addBlogPost: (post: Partial<BlogPost>) => Promise<BlogPost>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<BlogPost>;
  deleteBlogPost: (id: string) => void;

  updateHeroContent: (content: HeroContent) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to construct API URL safely
const getBaseUrl = () => {
  // Default to the production backend if env var is missing
  let url = (import.meta as any).env.VITE_BACKEND_URL || 'https://worriedweb-backend.vercel.app/api';
  
  // Remove trailing slash to normalize
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  
  return url;
};

// Axios instance with interceptor
const api = axios.create({ 
  baseURL: getBaseUrl() 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Map MongoDB _id to frontend id, ensuring we don't break if _id is missing
const mapId = (item: any) => ({ ...item, id: item._id || item.id });

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [heroContent, setHeroContent] = useState<HeroContent>(DUMMY_HERO);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Helper to load dummy data
  const loadDummyData = () => {
    console.warn("Backend unavailable. Loading Dummy Data.");
    setProjects(DUMMY_PROJECTS);
    setServices(DUMMY_SERVICES);
    setTestimonials(DUMMY_TESTIMONIALS);
    setTeamMembers(DUMMY_TEAM);
    setFaqs(DUMMY_FAQS);
    setOffers(DUMMY_OFFERS);
    setBlogPosts(DUMMY_BLOG_POSTS);
    setHeroContent(DUMMY_HERO);
  };

  // Fetch Public Data
  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [p, s, t, tm, f, o, b, h] = await Promise.all([
          api.get('/project'),
          api.get('/service'),
          api.get('/testimonial'),
          api.get('/team'),
          api.get('/faq'),
          api.get('/offer'),
          api.get('/blog'),
          api.get('/hero')
        ]);
        
        setProjects(p.data.map(mapId));
        setServices(s.data.map(mapId));
        setTestimonials(t.data.map(mapId));
        setTeamMembers(tm.data.map(mapId));
        setFaqs(f.data.map(mapId));
        setOffers(o.data.map(mapId));
        setBlogPosts(b.data.map(mapId));
        if(h.data && h.data.headline) setHeroContent(mapId(h.data));
      } catch (error) {
        console.error("Error fetching public data:", error);
        loadDummyData();
      }
    };
    fetchPublicData();
  }, []);

  // Fetch Protected Data
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProtectedData = async () => {
        try {
          const [m, l, sub] = await Promise.all([
            api.get('/contact'),
            api.get('/lead'),
            api.get('/subscriber')
          ]);
          setMessages(m.data.map(mapId));
          setLeads(l.data.map(mapId));
          setSubscribers(sub.data.map(mapId));
        } catch (error) {
          console.error("Error fetching protected data:", error);
          setMessages([]);
          setLeads([]);
          setSubscribers([]);
        }
      };
      fetchProtectedData();
    }
  }, [isAuthenticated]);

  // Projects
  const addProject = async (project: Project) => {
    try {
      const res = await api.post('/project', project);
      setProjects([mapId(res.data), ...projects]);
    } catch (e) { 
      console.error(e); 
      throw e;
    }
  };
  const updateProject = async (id: string, project: Project) => {
    try {
      const res = await api.put(`/project/${id}`, project);
      setProjects(projects.map(p => p.id === id ? mapId(res.data) : p));
    } catch (e) { 
      console.error(e); 
      throw e;
    }
  };
  const deleteProject = async (id: string) => {
    try {
      await api.delete(`/project/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (e) { console.error(e); }
  };

  // Content
  const addService = async (s: Service) => {
    try {
      const res = await api.post('/service', s);
      setServices([...services, mapId(res.data)]);
    } catch (e) { console.error(e); }
  };
  const updateService = async (id: string, s: Service) => {
    try {
      const res = await api.put(`/service/${id}`, s);
      setServices(services.map(i => i.id === id ? mapId(res.data) : i));
    } catch (e) { console.error(e); }
  };
  const deleteService = async (id: string) => {
    try {
      await api.delete(`/service/${id}`);
      setServices(services.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  const addTestimonial = async (t: Testimonial) => {
    try {
      const res = await api.post('/testimonial', t);
      setTestimonials([...testimonials, mapId(res.data)]);
    } catch (e) { console.error(e); }
  };
  const updateTestimonial = async (id: string, t: Testimonial) => {
    try {
      const res = await api.put(`/testimonial/${id}`, t);
      setTestimonials(testimonials.map(i => i.id === id ? mapId(res.data) : i));
    } catch (e) { console.error(e); }
  };
  const deleteTestimonial = async (id: string) => {
    try {
      await api.delete(`/testimonial/${id}`);
      setTestimonials(testimonials.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  const addTeamMember = async (m: TeamMember) => {
    try {
      const res = await api.post('/team', m);
      setTeamMembers([...teamMembers, mapId(res.data)]);
    } catch (e) { console.error(e); }
  };
  const updateTeamMember = async (id: string, m: TeamMember) => {
    try {
      const res = await api.put(`/team/${id}`, m);
      setTeamMembers(teamMembers.map(i => i.id === id ? mapId(res.data) : i));
    } catch (e) { console.error(e); }
  };
  const deleteTeamMember = async (id: string) => {
    try {
      await api.delete(`/team/${id}`);
      setTeamMembers(teamMembers.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  const addFAQ = async (f: FAQ) => {
    try {
      const res = await api.post('/faq', f);
      setFaqs([...faqs, mapId(res.data)]);
    } catch (e) { console.error(e); }
  };
  const updateFAQ = async (id: string, f: FAQ) => {
    try {
      const res = await api.put(`/faq/${id}`, f);
      setFaqs(faqs.map(i => i.id === id ? mapId(res.data) : i));
    } catch (e) { console.error(e); }
  };
  const deleteFAQ = async (id: string) => {
    try {
      await api.delete(`/faq/${id}`);
      setFaqs(faqs.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  const addOffer = async (o: Offer) => {
    try {
      const res = await api.post('/offer', o);
      setOffers([...offers, mapId(res.data)]);
    } catch (e) { console.error(e); }
  };
  const updateOffer = async (id: string, o: Offer) => {
    try {
      const res = await api.put(`/offer/${id}`, o);
      setOffers(offers.map(i => i.id === id ? mapId(res.data) : i));
    } catch (e) { console.error(e); }
  };
  const deleteOffer = async (id: string) => {
    try {
      await api.delete(`/offer/${id}`);
      setOffers(offers.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  const updateHeroContent = async (c: HeroContent) => {
    try {
      const res = await api.post('/hero', c);
      setHeroContent(mapId(res.data));
    } catch (e) { console.error(e); }
  };

  // Blog
  const addBlogPost = async (p: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      const res = await api.post('/blog', p);
      const newPost = mapId(res.data);
      setBlogPosts([newPost, ...blogPosts]);
      return newPost;
    } catch (e) { 
      console.error(e); 
      throw e;
    }
  };
  const updateBlogPost = async (id: string, p: Partial<BlogPost>): Promise<BlogPost> => {
    try {
      const res = await api.put(`/blog/${id}`, p);
      const updatedPost = mapId(res.data);
      setBlogPosts(blogPosts.map(i => i.id === id ? updatedPost : i));
      return updatedPost;
    } catch (e) { 
      console.error(e); 
      throw e;
    }
  };
  const deleteBlogPost = async (id: string) => {
    try {
      await api.delete(`/blog/${id}`);
      setBlogPosts(blogPosts.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  // Interaction
  const addMessage = async (m: ContactMessage) => {
    try {
        const res = await api.post('/contact', m);
    } catch (e) { console.error(e) }
  };
  const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'resolved') => {
    try {
      const res = await api.put(`/contact/${id}`, { status });
      setMessages(messages.map(m => m.id === id ? mapId(res.data) : m));
    } catch (e) { console.error(e); }
  };
  const deleteMessage = async (id: string) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  const addLead = async (l: Lead) => {
    try {
        const res = await api.post('/lead', l);
        setLeads([mapId(res.data), ...leads]);
    } catch(e) { console.error(e) }
  };
  const updateLead = async (id: string, l: Lead) => {
    try {
      const res = await api.put(`/lead/${id}`, l);
      setLeads(leads.map(i => i.id === id ? mapId(res.data) : i));
    } catch (e) { console.error(e); }
  };
  const deleteLead = async (id: string) => {
    try {
      await api.delete(`/lead/${id}`);
      setLeads(leads.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  const addSubscriber = async (email: string) => {
    try {
      await api.post('/subscriber', { email });
    } catch (e) { console.error(e); }
  };
  const deleteSubscriber = async (id: string) => {
    try {
      await api.delete(`/subscriber/${id}`);
      setSubscribers(subscribers.filter(s => s.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <DataContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      messages, addMessage, updateMessageStatus, deleteMessage,
      teamMembers, addTeamMember, updateTeamMember, deleteTeamMember,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      services, addService, updateService, deleteService,
      faqs, addFAQ, updateFAQ, deleteFAQ,
      leads, addLead, updateLead, deleteLead,
      offers, addOffer, updateOffer, deleteOffer,
      subscribers, addSubscriber, deleteSubscriber,
      heroContent, updateHeroContent,
      blogPosts, addBlogPost, updateBlogPost, deleteBlogPost
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
