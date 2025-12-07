
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ServiceInterest } from '../types';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Loader2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useData, api } from '../context/DataContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';

// Interface matching the backend
interface ContactFormInputs {
  name: string;
  email: string;
  company?: string;
  serviceInterest: string;
  message: string;
  consent: boolean;
}

// Cast motion components to any to avoid TypeScript errors
const MotionDiv = motion.div as any;

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormInputs>();
  const { faqs } = useData();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitting(true);
    
    try {
      await api.post('/contact', data);
      setIsSuccess(true);
      toast.success("Message sent! We'll be in touch shortly.");
      reset();
      // Reset success state after a few seconds to allow sending another
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="bg-canvas dark:bg-gray-900 min-h-screen py-12 md:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary dark:text-white mb-6">
            Let's build something <span className="text-accent relative">remarkable.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
             Ready to stop worrying about your tech? Fill out the form and our team will get back to you within 24 hours.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          
          {/* Info Side + Map */}
          <MotionDiv 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full gap-8"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="font-heading font-bold text-2xl mb-8 text-primary dark:text-white">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 bg-primary/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary dark:text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary dark:text-white">Email Us</h4>
                    <p className="text-gray-600 dark:text-gray-400">hello@worriedweb.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 group">
                   <div className="w-12 h-12 bg-primary/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary dark:text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary dark:text-white">Call Us</h4>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                 <div className="flex items-center gap-5 group">
                   <div className="w-12 h-12 bg-primary/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary dark:text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary dark:text-white">Visit Us</h4>
                    <p className="text-gray-600 dark:text-gray-400">100 Tech Blvd, Suite 200<br/>San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-[2rem] overflow-hidden shadow-sm h-64 lg:h-auto lg:flex-grow min-h-[300px] border-4 border-white dark:border-gray-800 relative">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0636842606556!2d-122.39626502367735!3d37.78809097198226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580630b2c347f%3A0x66c044199c0d7540!2sSan%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1709123456789!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </MotionDiv>

          {/* Form Side */}
          <MotionDiv 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 transition-colors relative overflow-hidden"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {isSuccess && (
                <MotionDiv 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-center p-8"
                >
                  <MotionDiv 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-10 h-10" />
                  </MotionDiv>
                  <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">Message Received!</h3>
                  <p className="text-gray-600 dark:text-gray-300">Thank you for reaching out. We'll be in touch within 24 hours.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-primary font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </MotionDiv>
              )}
            </AnimatePresence>

            <h2 className="text-3xl font-heading font-bold mb-8 text-primary dark:text-white">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-5 py-4 rounded-xl border-2 focus:ring-0 outline-none transition-all bg-canvas dark:bg-gray-900 dark:text-white ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-primary dark:focus:border-blue-400'}`}
                  placeholder="Jane Doe"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-5 py-4 rounded-xl border-2 focus:ring-0 outline-none transition-all bg-canvas dark:bg-gray-900 dark:text-white ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-primary dark:focus:border-blue-400'}`}
                  placeholder="jane@company.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company (Optional)</label>
                  <input
                    id="company"
                    type="text"
                    className="w-full px-5 py-4 rounded-xl border-2 border-transparent bg-canvas dark:bg-gray-900 dark:text-white focus:border-primary dark:focus:border-blue-400 outline-none transition-all"
                    placeholder="Acme Inc."
                    {...register("company")}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Interested In</label>
                  <div className="relative">
                    <select
                      id="service"
                      className="w-full px-5 py-4 rounded-xl border-2 border-transparent bg-canvas dark:bg-gray-900 dark:text-white focus:border-primary dark:focus:border-blue-400 outline-none transition-all appearance-none cursor-pointer"
                      {...register("serviceInterest")}
                    >
                      {Object.values(ServiceInterest).map((interest) => (
                        <option key={interest} value={interest}>{interest}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Message *</label>
                <textarea
                  id="message"
                  rows={4}
                  className={`w-full px-5 py-4 rounded-xl border-2 focus:ring-0 outline-none transition-all bg-canvas dark:bg-gray-900 dark:text-white ${errors.message ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-primary dark:focus:border-blue-400'}`}
                  placeholder="Tell us about your project..."
                  {...register("message", { 
                    required: "Message is required",
                    minLength: {
                      value: 20,
                      message: "Message must be at least 20 characters"
                    }
                  })}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
              </div>

              <div className="flex items-start bg-canvas dark:bg-gray-900 p-4 rounded-xl">
                <div className="flex items-center h-5">
                  <input
                    id="consent"
                    type="checkbox"
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                    {...register("consent", { required: "You must agree to proceed" })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consent" className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">I agree to the processing of my data.</label>
                  {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>}
                </div>
              </div>

              <Button 
                type="submit"
                variant="primary"
                className="w-full text-lg"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </MotionDiv>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <MotionDiv 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-primary dark:text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-400">Common questions about working with us.</p>
          </MotionDiv>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <MotionDiv 
                key={faq.id} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-bold text-lg text-primary dark:text-white pr-8">{faq.question}</span>
                  {openFaq === faq.id ? 
                    <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  }
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <MotionDiv 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                        {faq.answer}
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </MotionDiv>
            ))}
            {faqs.length === 0 && <p className="text-center text-gray-500">No FAQs currently available.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};
