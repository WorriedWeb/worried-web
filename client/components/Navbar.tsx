
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cast motion components to any to avoid TypeScript errors with strict intrinsic attributes
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-canvas/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <span className="font-heading font-bold text-2xl text-primary dark:text-white tracking-tight group-hover:opacity-90 transition-opacity">
                Worried<span className="text-accent">Web.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="relative px-1 py-2 text-dark dark:text-gray-200 font-medium hover:text-primary dark:hover:text-white transition-colors"
              >
                {link.label}
                {location.pathname === link.path && (
                  <MotionDiv 
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && (
               <div className="flex items-center gap-4 border-l pl-4 ml-4 border-gray-300 dark:border-gray-700">
                 <Link to="/admin/dashboard" className="flex items-center gap-1 text-primary dark:text-blue-400 font-medium hover:text-primary/80 dark:hover:text-blue-300">
                   <LayoutDashboard className="w-4 h-4" /> Dashboard
                 </Link>
                 <button onClick={logout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
            )}
            
            <Link 
              to="/contact" 
            >
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary dark:bg-white dark:text-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-primary/30 transition-all"
              >
                Start a Project
              </MotionButton>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-canvas dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {links.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`block px-3 py-3 rounded-lg text-lg font-medium ${
                    location.pathname === link.path 
                      ? 'bg-primary/5 text-primary dark:text-white font-bold' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                 <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-600 dark:text-gray-300">
                   Admin Dashboard
                 </Link>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};
