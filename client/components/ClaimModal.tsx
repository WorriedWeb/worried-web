
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext';
import { Project, Offer } from '../types';
import { X, CheckCircle, Gift, Loader2, Tag, Smartphone, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedProject?: Project | null;
}

interface ClaimFormInputs {
  name: string;
  email: string;
  phone: string;
  projectId: string;
}

const MotionDiv = motion.div as any;

export const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onClose, preSelectedProject }) => {
  const { projects, offers, addLead } = useData();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<ClaimFormInputs>();
  
  // Watch the projectId to display the preview image
  const selectedProjectId = watch('projectId');
  const previewProject = projects.find(p => p.id === selectedProjectId);

  useEffect(() => {
    const foundOffer = offers.find(o => o.isActive);
    setActiveOffer(foundOffer || null);
  }, [offers]);

  useEffect(() => {
    if (preSelectedProject) {
      setValue('projectId', preSelectedProject.id);
    }
  }, [preSelectedProject, setValue]);

  useEffect(() => {
    if (isOpen) {
       // Save original overflow style to restore later
       const originalStyle = document.body.style.overflow;
       document.body.style.overflow = 'hidden';
       return () => { document.body.style.overflow = originalStyle; }
    }
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelectProject = (projectId: string) => {
      setValue('projectId', projectId);
      setIsDropdownOpen(false);
  };

  const onSubmit = async (data: ClaimFormInputs) => {
    if (!activeOffer) return;
    
    setIsSubmitting(true);
    
    const selectedProject = projects.find(p => p.id === data.projectId);
    const projectName = selectedProject ? selectedProject.title : 'General Interest';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    addLead({
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: 'New',
      source: `Claimed Offer: ${activeOffer.title} (${activeOffer.code || 'No Code'}) for Project: ${projectName}`,
      createdAt: new Date().toISOString()
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Offer claimed successfully!");
    
    // Close after delay
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      reset();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-primary/90 dark:bg-black/90 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <MotionDiv 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full overflow-visible"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="px-6 py-8 sm:p-10">
            {isSuccess ? (
              <div className="text-center py-8">
                <MotionDiv 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10" />
                </MotionDiv>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Offer Claimed!</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Check your inbox. We'll be in touch shortly to get you started.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                    Claim Your Offer
                  </h3>
                  {activeOffer ? (
                     <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 inline-block border border-gray-100 dark:border-gray-600">
                        <p className="font-bold text-accent">{activeOffer.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activeOffer.description}</p>
                     </div>
                  ) : (
                    <p className="text-gray-500">Sign up to start your project.</p>
                  )}
                </div>

                {/* Coupon Code Display */}
                {activeOffer?.code && (
                  <div className="mb-6 bg-accent/5 border-2 border-dashed border-accent/30 rounded-xl p-4 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="flex items-center justify-center gap-2 text-accent mb-1">
                      <Tag className="w-3 h-3" />
                      <p className="text-xs font-bold uppercase tracking-widest">Coupon Code</p>
                    </div>
                    <div className="text-3xl font-mono font-bold text-primary dark:text-white tracking-[0.2em] relative z-10">
                      {activeOffer.code}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Mention this code for the deal</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                      placeholder="Enter your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input
                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                      <div className="relative">
                        <input
                          {...register('phone', { required: 'Phone is required' })}
                          type="tel"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                          placeholder="(555) 123-4567"
                        />
                        <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Custom Project Dropdown with Preview */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interested Project / Style</label>
                    
                    {/* Trigger Button */}
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between transition-all ${isDropdownOpen ? 'ring-2 ring-accent border-transparent' : ''}`}
                    >
                        {previewProject ? (
                            <div className="flex items-center gap-3 w-full overflow-hidden">
                                <img src={previewProject.imageUrl} alt="" className="w-12 h-12 rounded-md object-cover shrink-0" />
                                <div className="text-left overflow-hidden">
                                    <div className="font-bold text-sm truncate">{previewProject.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{previewProject.category}</div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400">Select a project reference...</span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Hidden Input for Form Registration */}
                    <input 
                        type="hidden" 
                        {...register('projectId', { required: 'Please select a project' })} 
                    />
                    {errors.projectId && <p className="mt-1 text-sm text-red-500">{errors.projectId.message}</p>}
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl max-h-32 overflow-y-auto custom-scrollbar"
                            >
                                {projects.map(p => (
                                    <div 
                                        key={p.id}
                                        onClick={() => handleSelectProject(p.id)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                                    >
                                        <img src={p.imageUrl} alt="" className="w-16 h-12 rounded-md object-cover shrink-0" />
                                        <div className="flex-grow">
                                             <div className="font-bold text-sm text-gray-900 dark:text-white">{p.title}</div>
                                             <div className="text-xs text-gray-500 dark:text-gray-400">{p.category}</div>
                                        </div>
                                        {selectedProjectId === p.id && <Check className="w-4 h-4 text-accent shrink-0"/>}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !activeOffer}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 mt-6"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Claim Offer Free'}
                  </button>
                  
                  <p className="text-xs text-center text-gray-400">
                    By claiming, you agree to start a conversation about your project. No payment required today.
                  </p>
                </form>
              </>
            )}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};
