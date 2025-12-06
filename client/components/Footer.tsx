import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary dark:bg-gray-800 text-white pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-heading font-bold text-2xl tracking-tight">
                Worried<span className="text-accent">Web.</span>
              </span>
            </div>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed max-w-xs">
              We build human-centered digital experiences that calm the chaos of the modern web. 
              Reliable code, warm design, and energetic results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-warm transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-blue-200 hover:text-warm transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-blue-200 hover:text-warm transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          {/* Services Column */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-warm">Services</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">UI/UX Design</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">E-Commerce</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">SEO & Performance</Link></li>
            </ul>
          </div>
          
          {/* Company Column */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-warm">Company</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} Worried Web Agency. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 text-accent fill-current" /> in React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};