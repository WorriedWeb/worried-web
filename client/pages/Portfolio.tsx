
import React, { useState } from 'react';
import { Project } from '../types';
import { useData } from '../context/DataContext';
import { ExternalLink, Star, Eye, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Web App', 'E-Commerce', 'Website'];

// Cast motion components to any to avoid TypeScript errors
const MotionDiv = motion.div as any;

// --- New Portfolio Card Component ---
const PortfolioCard: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate();

  const handleVisitSite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (project.websiteUrl) {
      window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Link to={`/project/${project.slug}`} className="block">
      <div 
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row cursor-pointer"
      >
        {/* Image Section - Left (Desktop) / Top (Mobile) */}
        <div className="md:w-[350px] lg:w-[400px] shrink-0 relative h-64 md:h-auto">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            loading="lazy"
          />
          
          {/* View Gallery Overlay Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
             <button className="bg-white/90 text-dark px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
               <Eye className="w-4 h-4" /> View Details
             </button>
          </div>

          {/* Notification Toast (Bottom Left) */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-gray-900/90 backdrop-blur text-white text-xs px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-gray-700">
             <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
             <span className="font-medium">Top rated project this week</span>
          </div>
        </div>

        {/* Content Section - Right (Desktop) / Bottom (Mobile) */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
             <div>
               <h3 className="text-2xl font-heading font-bold text-dark dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                 {project.title}
               </h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-2">
                 <Briefcase className="w-3 h-3" /> {project.businessUnit} <span className="text-gray-300">•</span> {project.category}
               </p>
             </div>
             
             {/* Status Tag */}
             <span className={`
               text-xs font-bold px-3 py-1 rounded uppercase tracking-wider
               ${project.status === 'Live' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                 project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
             `}>
               {project.status || 'Completed'}
             </span>
          </div>

          {/* Info Row (Tech Stack Highlights) */}
          <div className="flex flex-wrap items-center gap-4 md:gap-8 my-5 py-4 border-y border-gray-100 dark:border-gray-700">
             <div className="min-w-[80px]">
                <span className="block text-lg font-bold text-primary dark:text-blue-400 truncate">
                  {project.technologies?.[0] || 'React'}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Frontend</span>
             </div>
             
             <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
             
             <div className="min-w-[80px]">
                <span className="block text-lg font-bold text-primary dark:text-blue-400 truncate">
                  {project.technologies?.[1] || 'Node'}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Backend</span>
             </div>

             <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

             <div>
                <span className="block text-lg font-bold text-primary dark:text-blue-400">
                   100%
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Responsive</span>
             </div>
          </div>

          {/* Highlights / Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
             <span className="text-xs font-bold text-gray-400 uppercase py-1 mr-1">Highlights:</span>
             {project.tags.slice(0, 3).map(tag => (
               <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                 {tag}
               </span>
             ))}
             {project.tags.length > 3 && (
               <span className="bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs font-semibold px-2 py-1 rounded border border-gray-100 dark:border-gray-700">
                 +{project.tags.length - 3} more
               </span>
             )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
            {project.description}
          </p>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-auto">
             <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold text-xs">
                   WW
                </div>
                <div className="text-xs">
                   <div className="font-bold text-dark dark:text-white">Worried Web</div>
                   <div className="text-gray-400">Agency Portfolio</div>
                </div>
             </div>
             
             <div className="flex gap-3 w-full md:w-auto">
                <span 
                   className="flex-1 md:flex-none text-center px-5 py-2.5 border border-primary dark:border-blue-500 text-primary dark:text-blue-400 font-bold rounded-lg text-sm hover:bg-primary/5 dark:hover:bg-blue-900/20 transition-colors"
                >
                  View Case Study
                </span>
                <button 
                   onClick={handleVisitSite}
                   className="flex-1 md:flex-none justify-center px-5 py-2.5 bg-primary dark:bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-primary/90 dark:hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                   <ExternalLink className="w-4 h-4" /> Visit Site
                </button>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const Portfolio: React.FC = () => {
  const { projects } = useData();
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="bg-canvas dark:bg-gray-900 min-h-screen pt-12 pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Gallery</span>
          <h1 className="font-heading text-5xl font-bold text-primary dark:text-white mb-4">Selected Works</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            A showcase of digital craftsmanship. We solve complex problems with elegant code and design.
          </p>
        </MotionDiv>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${filter === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery List */}
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <MotionDiv 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={project.id} 
              >
                <PortfolioCard project={project} />
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
