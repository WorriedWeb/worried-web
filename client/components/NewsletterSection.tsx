
import React, { useState } from 'react';
import { Send, Check, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

// Cast motion components
const MotionDiv = motion.div as any;

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addSubscriber } = useData();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    
    // Real API call
    toast.promise(
      addSubscriber(email),
      {
        loading: 'Subscribing...',
        success: () => {
          setIsSubscribed(true);
          setEmail('');
          return 'Subscribed successfully!';
        },
        error: 'Could not subscribe. Please try again.',
      }
    );
  };

  return (
    <section className="py-24 bg-primary dark:bg-gray-800 text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Mail className="w-64 h-64" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-12"
        >
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    Join our digital inner circle.
                </h2>
                <p className="text-blue-200 text-lg leading-relaxed">
                    Get the latest tech trends, design insights, and exclusive offers delivered straight to your inbox. No spam, just value.
                </p>
            </div>

            <div className="w-full max-w-md">
                {isSubscribed ? (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">You're on the list!</h3>
                        <p className="text-blue-100">Keep an eye on your inbox for our next update.</p>
                        <button 
                            onClick={() => setIsSubscribed(false)} 
                            className="mt-4 text-sm text-accent hover:text-white transition-colors"
                        >
                            Subscribe another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="bg-white dark:bg-gray-700 p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="flex-grow bg-transparent px-6 py-4 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-lg w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            Subscribe <Send className="w-5 h-5" />
                        </button>
                    </form>
                )}
                <p className="text-blue-300 text-xs mt-4 text-center">
                    We care about your data in our <span className="underline decoration-accent underline-offset-2">Privacy Policy</span>.
                </p>
            </div>
        </MotionDiv>
      </div>
    </section>
  );
};
