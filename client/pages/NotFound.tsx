
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

// Cast motion div to any to avoid TS errors
const MotionDiv = motion.div as any;

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-canvas dark:bg-gray-900 transition-colors duration-300">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg"
      >
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 dark:text-red-400">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-6xl font-heading font-bold text-primary dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-dark dark:text-gray-200 mb-6">Page Not Found</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/">
          <Button variant="primary" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </MotionDiv>
    </div>
  );
};
