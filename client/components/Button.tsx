import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const MotionButton = motion.button as any;

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading, 
  icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-accent shadow-lg hover:shadow-accent/30",
    secondary: "bg-warm text-primary hover:bg-white hover:text-accent shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 dark:border-white dark:text-white dark:hover:bg-white/10",
    ghost: "text-primary hover:bg-primary/5 dark:text-white dark:hover:bg-white/10"
  };

  const sizes = "px-8 py-4 text-lg";

  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
      {...props}
    >
      {/* Background fill animation for primary */}
      {variant === 'primary' && (
        <motion.div 
          className="absolute inset-0 bg-accent z-0"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {!isLoading && icon}
        {children}
      </span>
    </MotionButton>
  );
};