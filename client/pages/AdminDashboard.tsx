
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactMessage, Project, TeamMember, Testimonial, Service, FAQ, HeroContent, Lead, Offer, BlogPost } from '../types';
import { Inbox, Layout, Plus, Trash2, CheckCircle, Search, X, Image as ImageIcon, Users, MessageSquare, Pencil, Target, HelpCircle, UserPlus, Type, Tag, Percent, Mail, ChevronDown, ChevronRight, FileText, Briefcase, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../context/DataContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    projects, deleteProject,
    messages, updateMessageStatus, deleteMessage,
    teamMembers, addTeamMember, updateTeamMember, deleteTeamMember,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    services, addService, updateService, deleteService,
    faqs, addFAQ, updateFAQ, deleteFAQ,
    leads, addLead, updateLead, deleteLead,
    offers, addOffer, updateOffer, deleteOffer,
    subscribers, deleteSubscriber,
    blogPosts, deleteBlogPost, 
    heroContent, updateHeroContent
  } = useData();

  const [activeTab, setActiveTab] = useState<'hero' | 'messages' | 'leads' | 'portfolio' | 'services' | 'team' | 'testimonials' | 'faqs' | 'offers' | 'subscribers' | 'blog'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Expanded Row State for Leads
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Team Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: '', role: '', imageUrl: ''
  });

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({
    text: '', author: '', role: '', imageUrl: '', rating: 5
  });

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    title: '', description: '', icon: 'Code'
  });

  // FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({
    question: '', answer: ''
  });

  // Lead Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState<Partial<Lead>>({
    name: '', email: '', phone: '', source: '', status: 'New'
  });

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({
    title: '', description: '', code: '', isActive: true, expiryDate: ''
  });

  // Hero Content State
  const [tempHeroContent, setTempHeroContent] = useState<HeroContent>(heroContent);

  // Helper: Convert File to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLeadExpand = (id: string) => {
    setExpandedLeadId(expandedLeadId === id ? null : id);
  };

  // --- Message Handlers ---
  const handleMarkResolved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateMessageStatus(id, 'resolved');
    toast.success('Marked as resolved');
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('Delete this message?')) {
      deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message deleted');
    }
  };

  const openMessage = (msg: ContactMessage) => {
    if (msg.status === 'new') updateMessageStatus(msg.id, 'read');
    setSelectedMessage(msg);
  };

  // --- Blog Nav Handlers ---
  const handleCreatePost = () => {
    navigate('/admin/blog/new');
  };

  const handleEditPost = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  // --- Project Nav Handlers ---
  const handleCreateProject = () => {
    navigate('/admin/project/new');
  };

  const handleEditProject = (id: string) => {
    navigate(`/admin/project/edit/${id}`);
  };

  // --- Team Handlers ---
  const openTeamModal = (member?: TeamMember) => {
    if (member) {
      setEditingTeamId(member.id);
      setTeamForm(member);
    } else {
      setEditingTeamId(null);
      setTeamForm({ name: '', role: '', imageUrl: '' });
    }
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role) return toast.error('Name and Role required');
    
    // For new items, do NOT send ID. Backend generates it.
    const memberPayload: any = {
      ...teamForm,
      imageUrl: teamForm.imageUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'
    };

    if (editingTeamId) {
      updateTeamMember(editingTeamId, { ...memberPayload, id: editingTeamId });
      toast.success('Member updated');
    } else {
      addTeamMember(memberPayload as TeamMember); // Type cast allows missing ID for creation
      toast.success('Member added');
    }
    setIsTeamModalOpen(false);
  };

  // --- Testimonial Handlers ---
  const openTestimonialModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonialId(testimonial.id);
      setTestimonialForm(testimonial);
    } else {
      setEditingTestimonialId(null);
      setTestimonialForm({ text: '', author: '', role: '', imageUrl: '', rating: 5 });
    }
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.author || !testimonialForm.text) return toast.error('Author and Text required');

    const testimonialPayload: any = {
      ...testimonialForm,
      imageUrl: testimonialForm.imageUrl || 'https://randomuser.me/api/portraits/lego/2.jpg',
      rating: testimonialForm.rating || 5
    };

    if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, { ...testimonialPayload, id: editingTestimonialId });
      toast.success('Testimonial updated');
    } else {
      addTestimonial(testimonialPayload as Testimonial);
      toast.success('Testimonial added');
    }
    setIsTestimonialModalOpen(false);
  };

  // --- Service Handlers ---
  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingServiceId(service.id);
      setServiceForm(service);
    } else {
      setEditingServiceId(null);
      setServiceForm({ title: '', description: '', icon: 'Code' });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description) return toast.error('Title and Description required');

    const servicePayload: any = { ...serviceForm };

    if (editingServiceId) {
      updateService(editingServiceId, { ...servicePayload, id: editingServiceId });
      toast.success('Service updated');
    } else {
      addService(servicePayload as Service);
      toast.success('Service added');
    }
    setIsServiceModalOpen(false);
  };

  // --- FAQ Handlers ---
  const openFaqModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaqId(faq.id);
      setFaqForm(faq);
    } else {
      setEditingFaqId(null);
      setFaqForm({ question: '', answer: '' });
    }
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return toast.error('Question and Answer required');

    const faqPayload: any = { ...faqForm };

    if (editingFaqId) {
      updateFAQ(editingFaqId, { ...faqPayload, id: editingFaqId });
      toast.success('FAQ updated');
    } else {
      addFAQ(faqPayload as FAQ);
      toast.success('FAQ added');
    }
    setIsFaqModalOpen(false);
  };

  // --- Lead Handlers ---
  const openLeadModal = (lead?: Lead) => {
    if (lead) {
      setEditingLeadId(lead.id);
      setLeadForm(lead);
    } else {
      setEditingLeadId(null);
      setLeadForm({ name: '', email: '', phone: '', source: '', status: 'New' });
    }
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return toast.error('Name and Email required');

    // Remove ID for new items
    const leadPayload: any = {
      ...leadForm,
      createdAt: leadForm.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingLeadId) {
      updateLead(editingLeadId, { ...leadPayload, id: editingLeadId });
      toast.success('Lead updated');
    } else {
      addLead(leadPayload as Lead);
      toast.success('Lead added');
    }
    setIsLeadModalOpen(false);
  };

  // --- Offer Handlers ---
  const openOfferModal = (offer?: Offer) => {
    if (offer) {
      setEditingOfferId(offer.id);
      setOfferForm(offer);
    } else {
      setEditingOfferId(null);
      setOfferForm({ title: '', description: '', code: '', isActive: true, expiryDate: '' });
    }
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.title || !offerForm.description) return toast.error('Title and Description required');

    const offerPayload: any = { ...offerForm };

    if (editingOfferId) {
      updateOffer(editingOfferId, { ...offerPayload, id: editingOfferId });
      toast.success('Offer updated');
    } else {
      addOffer(offerPayload as Offer);
      toast.success('Offer added');
    }
    setIsOfferModalOpen(false);
  };

  // --- Hero Handler ---
  const handleSaveHero = () => {
    updateHeroContent(tempHeroContent);
    toast.success('Hero content updated');
  };

  // Sidebar Item Helper
  const SidebarItem = ({ id, label, icon: Icon, count }: { id: string, label: string, icon: any, count?: number }) => (
    <button 
      onClick={() => setActiveTab(id as any)} 
      className={`w-full flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors 
        ${activeTab === id 
          ? 'bg-primary/5 dark:bg-primary/20 text-primary dark:text-blue-400 border-l-4 border-primary dark:border-blue-400' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`
      }
    >
      <Icon className="w-5 h-5" /> {label}
      {count !== undefined && (
        <span className="ml-auto bg-primary dark:bg-blue-600 text-white text-xs py-0.5 px-2 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-canvas dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold text-dark dark:text-white">Dashboard</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">Welcome, Admin</div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
              <SidebarItem id="hero" label="Hero Content" icon={Type} />
              <SidebarItem id="messages" label="Messages" icon={Inbox} count={messages.filter(m => m.status === 'new').length} />
              <SidebarItem id="leads" label="Leads" icon={UserPlus} count={leads.filter(l => l.status === 'New').length} />
              <SidebarItem id="offers" label="Offers" icon={Percent} count={offers.filter(o => o.isActive).length} />
              <SidebarItem id="blog" label="Blog" icon={FileText} count={blogPosts.length} />
              <SidebarItem id="subscribers" label="Subscribers" icon={Mail} count={subscribers.length} />
              <SidebarItem id="portfolio" label="Portfolio" icon={Layout} />
              <SidebarItem id="services" label="Services" icon={Target} />
              <SidebarItem id="team" label="Team" icon={Users} />
              <SidebarItem id="testimonials" label="Testimonials" icon={MessageSquare} />
              <SidebarItem id="faqs" label="FAQs" icon={HelpCircle} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
             
             {/* Hero Tab */}
             {activeTab === 'hero' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-dark dark:text-white mb-6">Hero Section Management</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                      value={tempHeroContent.headline}
                      onChange={(e) => setTempHeroContent({...tempHeroContent, headline: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subheadline</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                      value={tempHeroContent.subheadline}
                      onChange={(e) => setTempHeroContent({...tempHeroContent, subheadline: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Text</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                        value={tempHeroContent.ctaText}
                        onChange={(e) => setTempHeroContent({...tempHeroContent, ctaText: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Link</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                        value={tempHeroContent.ctaLink}
                        onChange={(e) => setTempHeroContent({...tempHeroContent, ctaLink: e.target.value})}
                      />
                    </div>
                  </div>
                  <button onClick={handleSaveHero} className="bg-primary dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Inquiries</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 uppercase">
                        <th className="py-3 font-medium">From</th>
                        <th className="py-3 font-medium">Interest</th>
                        <th className="py-3 font-medium">Status</th>
                        <th className="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {messages.map(msg => (
                        <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group" onClick={() => openMessage(msg)}>
                          <td className="py-4">
                            <div className="font-medium text-dark dark:text-white">{msg.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</div>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{msg.serviceInterest}</td>
                          <td className="py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${msg.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : msg.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{msg.status}</span></td>
                          <td className="py-4 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               {msg.status !== 'resolved' && <button onClick={(e) => handleMarkResolved(msg.id, e)} className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded"><CheckCircle className="w-4 h-4" /></button>}
                               <button onClick={(e) => handleDeleteMessage(msg.id, e)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {messages.length === 0 && <div className="text-center py-12 text-gray-500 dark:text-gray-400">No messages found.</div>}
                </div>
              </div>
            )}

            {/* Leads Tab */}
             {activeTab === 'leads' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Leads</h2>
                  <button onClick={() => openLeadModal()} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Lead</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 uppercase">
                        <th className="py-3 px-4 font-medium">Name</th>
                        <th className="py-3 font-medium">Email</th>
                        <th className="py-3 font-medium">Phone</th>
                        <th className="py-3 font-medium">Source</th>
                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {leads.map(lead => (
                        <React.Fragment key={lead.id}>
                            <tr 
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => toggleLeadExpand(lead.id)}
                            >
                                <td className="py-4 px-4 font-medium text-dark dark:text-white flex items-center gap-2">
                                     <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedLeadId === lead.id ? 'rotate-90' : ''}`} />
                                     {lead.name}
                                </td>
                                <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{lead.email}</td>
                                <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{lead.phone || '-'}</td>
                                <td className="py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[150px] truncate" title={lead.source}>{lead.source}</td>
                                <td className="py-4 px-4 text-right">
                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => openLeadModal(lead)} className="p-1 text-gray-400 hover:text-primary dark:hover:text-white"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => deleteLead(lead.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                            {expandedLeadId === lead.id && (
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <td colSpan={5} className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                            <div>
                                                <span className="font-bold block text-gray-500 dark:text-gray-400 text-xs uppercase mb-2">Detailed Source / Offer</span>
                                                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                                                    {lead.source}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="font-bold block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Status</span>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                        lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                        lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {lead.status}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="font-bold block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Lead ID</span>
                                                        <p className="text-gray-800 dark:text-gray-200 font-mono text-xs">{lead.id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">Created At</span>
                                                        <p className="text-gray-800 dark:text-gray-200">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  {leads.length === 0 && <div className="text-center py-12 text-gray-500 dark:text-gray-400">No leads found.</div>}
                </div>
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Active Offers</h2>
                  <button onClick={() => openOfferModal()} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Offer</button>
                </div>
                <div className="space-y-4">
                  {offers.map(offer => (
                    <div key={offer.id} className={`border ${offer.isActive ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10' : 'border-gray-100 dark:border-gray-700'} rounded-lg p-4 transition-colors`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-dark dark:text-white flex items-center gap-2">
                            {offer.title}
                            {offer.isActive && <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-medium">Active</span>}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{offer.description}</p>
                          {offer.code && <div className="mt-2 inline-block px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded font-mono text-gray-700 dark:text-gray-300">Code: {offer.code}</div>}
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => openOfferModal(offer)} className="p-1 text-gray-400 hover:text-primary dark:hover:text-white"><Pencil className="w-4 h-4" /></button>
                           <button onClick={() => deleteOffer(offer.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {offers.length === 0 && <p className="text-center text-gray-500 py-8">No offers created.</p>}
                </div>
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Blog Posts</h2>
                  <button onClick={handleCreatePost} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Post</button>
                </div>
                <div className="grid gap-4">
                  {blogPosts.map(post => (
                    <div key={post.id} className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      <img src={post.coverImage || 'https://picsum.photos/600/400'} alt={post.title} className="w-24 h-16 object-cover rounded-md bg-gray-100 dark:bg-gray-700" />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-dark dark:text-white">{post.title}</h3>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{post.publishedAt} by {post.author}</div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => handleEditPost(post.id)} className="p-1 text-gray-400 hover:text-primary dark:hover:text-white"><Pencil className="w-4 h-4" /></button>
                             <button onClick={() => deleteBlogPost(post.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  ))}
                  {blogPosts.length === 0 && <p className="text-center text-gray-500 py-8">No blog posts found.</p>}
                </div>
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Newsletter Subscribers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 uppercase">
                        <th className="py-3 font-medium">Email</th>
                        <th className="py-3 font-medium">Date Subscribed</th>
                        <th className="py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {subscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-4">
                            <div className="font-medium text-dark dark:text-white">{sub.email}</div>
                          </td>
                          <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{sub.date}</td>
                          <td className="py-4 text-right">
                             <button onClick={() => deleteSubscriber(sub.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && <div className="text-center py-12 text-gray-500 dark:text-gray-400">No subscribers yet.</div>}
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Projects</h2>
                  <button onClick={handleCreateProject} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Project</button>
                </div>
                <div className="grid gap-4">
                  {projects.map(p => (
                    <div key={p.id} className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      <img src={p.imageUrl} alt={p.title} className="w-24 h-16 object-cover rounded-md bg-gray-100 dark:bg-gray-700" />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-dark dark:text-white">{p.title}</h3>
                            <div className="text-xs text-primary dark:text-blue-400 flex gap-2">
                                <span>{p.category}</span>
                                {p.businessUnit && <span className="text-gray-400">• {p.businessUnit}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => handleEditProject(p.id)} className="p-1 text-gray-400 hover:text-primary dark:hover:text-white"><Pencil className="w-4 h-4" /></button>
                             <button onClick={() => deleteProject(p.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-center text-gray-500 py-8">No projects.</p>}
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Services</h2>
                  <button onClick={() => openServiceModal()} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Service</button>
                </div>
                <div className="grid gap-4">
                  {services.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      <div>
                        <h3 className="font-bold text-dark dark:text-white flex items-center gap-2">
                           <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-mono">{s.icon}</span>
                           {s.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{s.description}</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => openServiceModal(s)} className="p-1 text-gray-400 hover:text-primary dark:hover:text-white"><Pencil className="w-4 h-4" /></button>
                         <button onClick={() => deleteService(s.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Team Members</h2>
                  <button onClick={() => openTeamModal()} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Member</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map(member => (
                    <div key={member.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center relative group hover:shadow-md transition-all bg-white dark:bg-gray-800">
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openTeamModal(member)} className="p-1 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-400 hover:text-primary"><Pencil className="w-3 h-3" /></button>
                         <button onClick={() => deleteTeamMember(member.id)} className="p-1 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                      <img src={member.imageUrl} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover bg-gray-200 dark:bg-gray-700" />
                      <h3 className="font-bold text-dark dark:text-white">{member.name}</h3>
                      <p className="text-sm text-primary dark:text-blue-400">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">Testimonials</h2>
                  <button onClick={() => openTestimonialModal()} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add Testimonial</button>
                </div>
                <div className="grid gap-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 relative group hover:shadow-md transition-all bg-white dark:bg-gray-800">
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openTestimonialModal(t)} className="text-gray-400 hover:text-primary"><Pencil className="w-4 h-4" /></button>
                         <button onClick={() => deleteTestimonial(t.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic mb-4 pr-16">"{t.text}"</p>
                      <div className="flex items-center gap-3">
                        <img src={t.imageUrl} alt={t.author} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                        <div>
                           <div className="font-bold text-sm text-dark dark:text-white">{t.author}</div>
                           <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* FAQs Tab */}
             {activeTab === 'faqs' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-dark dark:text-white">FAQs</h2>
                  <button onClick={() => openFaqModal()} className="inline-flex items-center px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-medium"><Plus className="w-4 h-4 mr-2" /> Add FAQ</button>
                </div>
                <div className="space-y-4">
                  {faqs.map(f => (
                    <div key={f.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-dark dark:text-white">{f.question}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">{f.answer}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openFaqModal(f)} className="text-gray-400 hover:text-primary dark:hover:text-white"><Pencil className="w-4 h-4" /></button>
                           <button onClick={() => deleteFAQ(f.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMessage(null)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative z-10 border border-gray-100 dark:border-gray-700">
             <button onClick={() => setSelectedMessage(null)} className="absolute top-4 right-4 text-gray-400 hover:text-dark dark:hover:text-white"><X className="w-5 h-5"/></button>
             <h3 className="text-xl font-bold mb-1 text-dark dark:text-white">{selectedMessage.name}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selectedMessage.email}</p>
             <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</div>
             <div className="flex justify-end gap-3">
               {selectedMessage.status !== 'resolved' && <button onClick={(e) => handleMarkResolved(selectedMessage.id, e)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Resolve</button>}
               <button onClick={(e) => handleDeleteMessage(selectedMessage.id, e)} className="px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
             </div>
          </div>
        </div>
      )}

      {/* Add/Edit Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setIsTeamModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">{editingTeamId ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleSaveTeamMember} className="space-y-4">
              <input type="text" required placeholder="Full Name" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} />
              <input type="text" required placeholder="Role (e.g. Developer)" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} />
              
              <div className="relative">
                <label htmlFor="team-image-upload" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 cursor-pointer flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors truncate">
                  <ImageIcon className="w-4 h-4" /> {teamForm.imageUrl ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input 
                  id="team-image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, (url) => setTeamForm({...teamForm, imageUrl: url}))} 
                />
              </div>

              {teamForm.imageUrl && (
                <div className="flex justify-center">
                  <img src={teamForm.imageUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600" />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsTeamModalOpen(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setIsTestimonialModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">{editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <input type="text" required placeholder="Client Name" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={testimonialForm.author} onChange={e => setTestimonialForm({...testimonialForm, author: e.target.value})} />
              <input type="text" placeholder="Client Role/Company" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} />
              <textarea required placeholder="Testimonial Text" rows={3} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} />
              
              <div className="relative">
                <label htmlFor="testimonial-image-upload" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 cursor-pointer flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors truncate">
                  <ImageIcon className="w-4 h-4" /> {testimonialForm.imageUrl ? 'Change Avatar' : 'Upload Avatar'}
                </label>
                <input 
                  id="testimonial-image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, (url) => setTestimonialForm({...testimonialForm, imageUrl: url}))} 
                />
              </div>

               {testimonialForm.imageUrl && (
                <div className="flex justify-center">
                  <img src={testimonialForm.imageUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-600" />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setIsServiceModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">{editingServiceId ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <input type="text" required placeholder="Service Title" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} />
              
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                <select 
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  value={serviceForm.icon}
                  onChange={e => setServiceForm({...serviceForm, icon: e.target.value})}
                >
                  <option value="Code">Code</option>
                  <option value="PenTool">PenTool</option>
                  <option value="BarChart3">BarChart3</option>
                  <option value="Zap">Zap</option>
                  <option value="Layout">Layout</option>
                  <option value="Globe">Globe</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Search">Search</option>
                  <option value="Server">Server</option>
                  <option value="Database">Database</option>
                </select>
              </div>

              <textarea required placeholder="Description" rows={3} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setIsFaqModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">{editingFaqId ? 'Edit FAQ' : 'Add FAQ'}</h3>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <input type="text" required placeholder="Question" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} />
              <textarea required placeholder="Answer" rows={3} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} />

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setIsLeadModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">{editingLeadId ? 'Edit Lead' : 'Add Lead'}</h3>
            <form onSubmit={handleSaveLead} className="space-y-4">
              <input type="text" required placeholder="Name" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} />
              <input type="email" required placeholder="Email" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} />
              <input type="tel" placeholder="Phone" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} />
              <input type="text" placeholder="Source (e.g. LinkedIn)" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={leadForm.source} onChange={e => setLeadForm({...leadForm, source: e.target.value})} />
              
              <select className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={leadForm.status} onChange={e => setLeadForm({...leadForm, status: e.target.value as any})}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsLeadModalOpen(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/75 backdrop-blur-sm transition-opacity" onClick={() => setIsOfferModalOpen(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-dark dark:text-white">{editingOfferId ? 'Edit Offer' : 'Add Offer'}</h3>
            <form onSubmit={handleSaveOffer} className="space-y-4">
              <input type="text" required placeholder="Offer Title" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} />
              <textarea required placeholder="Description" rows={3} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} />
              <input type="text" placeholder="Promo Code (Optional)" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white" value={offerForm.code} onChange={e => setOfferForm({...offerForm, code: e.target.value})} />
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="offerActive" 
                  checked={offerForm.isActive} 
                  onChange={e => setOfferForm({...offerForm, isActive: e.target.checked})}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="offerActive" className="text-dark dark:text-white">Active Offer</label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={() => setIsOfferModalOpen(false)} className="px-4 py-2 border dark:border-gray-600 rounded-lg text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700">Save Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
