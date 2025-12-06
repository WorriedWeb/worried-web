import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { X, Tag, Copy, Check, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClaimModal } from './ClaimModal';

const MotionDiv = motion.div as any;

export const OfferNotification: React.FC = () => {
  const { offers } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [activeOffer, setActiveOffer] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Do not show on admin pages
    if (location.pathname.startsWith('/admin')) {
      setIsVisible(false);
      return;
    }

    // Find first active offer
    const offer = offers.find(o => o.isActive);
    if (!offer) {
        setIsVisible(false);
        return;
    }

    const isDismissed = sessionStorage.getItem(`offer_dismissed_${offer.id}`);
    
    if (offer && !isDismissed) {
      setActiveOffer(offer);
      // Delay showing it slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [offers, location.pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (activeOffer) {
        sessionStorage.setItem(`offer_dismissed_${activeOffer.id}`, 'true');
    }
  };

  const copyCode = () => {
    if (activeOffer?.code) {
        navigator.clipboard.writeText(activeOffer.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  }
  
  const handleClaim = () => {
    setIsClaimModalOpen(true);
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && activeOffer && (
          <MotionDiv
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-6 z-[100] max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-primary/10 dark:border-gray-700 overflow-hidden"
          >
              <div className="relative p-6">
                  <button 
                      onClick={handleDismiss}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                      <X className="w-4 h-4" />
                  </button>

                  <div className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                          <Tag className="w-6 h-6" />
                      </div>
                      <div>
                          <h4 className="font-heading font-bold text-dark dark:text-white text-lg leading-tight mb-1">
                              {activeOffer.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                              {activeOffer.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {activeOffer.code && (
                                <button 
                                    onClick={copyCode}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono font-bold text-primary dark:text-blue-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
                                >
                                    {activeOffer.code}
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />}
                                </button>
                            )}
                            
                            <button 
                              onClick={handleClaim}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-bold shadow-md hover:bg-accent/90 transition-colors"
                            >
                              <Gift className="w-3 h-3" /> Claim Now
                            </button>
                          </div>
                          
                          {copied && <div className="text-xs text-green-500 mt-1 animate-fade-in">Copied to clipboard!</div>}
                      </div>
                  </div>
              </div>
              
              {/* Progress/Timer Bar decoration (static for now) */}
              <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
                  <div className="h-full bg-accent w-full" />
              </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <ClaimModal 
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </>
  )
}
