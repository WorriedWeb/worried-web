

import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code, Hash, Layers, Briefcase, Gift } from 'lucide-react';
import { ClaimModal } from '../components/ClaimModal';

const MotionDiv = motion.div as any;

export const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects, offers } = useData();
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const project = projects.find(p => p.slug === slug);
  const activeOffer = offers.find(o => o.isActive);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  return (
    <div className="bg-canvas dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300">
      
      {/* --- Hero Section --- */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-20" />
        
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />

        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 z-30">
          <Link 
            to="/portfolio" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </div>

        {/* Title Block */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto">
          <MotionDiv 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent text-white text-sm font-bold uppercase tracking-wider shadow-lg">
                {project.category}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-bold uppercase tracking-wider shadow-lg">
                {project.businessUnit}
              </span>
              {project.status && (
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg ${project.status === 'Live' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                  {project.status}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4 drop-shadow-lg">
              {project.title}
            </h1>
          </MotionDiv>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Info (Left) */}
          <MotionDiv 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">About the Project</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
                {project.description}
              </p>

              {/* Detailed Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Briefcase className="w-4 h-4" /> Business Unit
                    </div>
                    <div className="font-bold text-dark dark:text-white text-lg">{project.businessUnit}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Layers className="w-4 h-4" /> Category
                    </div>
                    <div className="font-bold text-dark dark:text-white text-lg">{project.category}</div>
                  </div>
              </div>
            </div>

            {/* Gallery Section */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                 <h3 className="text-xl font-bold text-primary dark:text-white mb-6">Project Gallery</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {project.gallery.map((img, index) => (
                      <div key={index} className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" alt={`${project.title} gallery ${index + 1}`} />
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </MotionDiv>

          {/* Sidebar (Right) */}
          <MotionDiv 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
              
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4" /> Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-sm font-semibold rounded-lg border border-blue-100 dark:border-blue-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                {project.websiteUrl ? (
                  <a 
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary dark:bg-white dark:text-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Visit Live Site <ExternalLink className="w-5 h-5" />
                  </a>
                ) : (
                   <button disabled className="w-full bg-gray-100 dark:bg-gray-700 text-gray-400 font-bold py-4 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                      Live Site Unavailable
                   </button>
                )}
                
                {activeOffer && (
                  <button 
                    onClick={() => setIsClaimModalOpen(true)}
                    className="w-full bg-accent text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-accent/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" /> Claim Free Offer
                  </button>
                )}
              </div>

            </div>
          </MotionDiv>

        </div>
      </div>

      <ClaimModal 
        isOpen={isClaimModalOpen} 
        onClose={() => setIsClaimModalOpen(false)} 
        preSelectedProject={project}
      />
    </div>
  );
};