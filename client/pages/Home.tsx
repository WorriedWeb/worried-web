
import React, { useRef } from 'react';
import { ArrowRight, Code, PenTool, BarChart3, ShieldCheck, Quote, Star, Zap, Layout, Globe, Smartphone, Search, Server, Database, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Button } from '../components/Button';
import { NewsletterSection } from '../components/NewsletterSection';

// Cast motion components to any to avoid TypeScript errors
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionH2 = motion.h2 as any;
const MotionH3 = motion.h3 as any;
const MotionP = motion.p as any;
const MotionSpan = motion.span as any;
const MotionImg = motion.img as any;

// --- Helper Components ---

const IconRenderer: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
  const icons: Record<string, React.ReactNode> = {
    'Code': <Code className={className} />,
    'PenTool': <PenTool className={className} />,
    'BarChart3': <BarChart3 className={className} />,
    'Zap': <Zap className={className} />,
    'Layout': <Layout className={className} />,
    'Globe': <Globe className={className} />,
    'Smartphone': <Smartphone className={className} />,
    'Search': <Search className={className} />,
    'Server': <Server className={className} />,
    'Database': <Database className={className} />
  };
  return <>{icons[iconName] || <Code className={className} />}</>;
};

// --- Animations ---
// Using functional variants to support Reduced Motion preference
const animations = (shouldReduceMotion: boolean) => ({
  fadeInUp: {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    })
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  hoverLift: {
    hover: { 
      y: shouldReduceMotion ? 0 : -6, 
      transition: { duration: 0.3, ease: "easeOut" } 
    }
  }
});
console.log(import.meta.env.VITE_BACKEND_URL);
// --- Main Component ---

export const Home: React.FC = () => {
  const { testimonials, projects, services, heroContent } = useData();
  const recentWork = projects.slice(0, 3);
  const scrollRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const anim = animations(Boolean(shouldReduceMotion));
  

  // Parallax for Hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 100 : 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  // Parallax for Testimonials
  const testimonialY = useTransform(scrollY, [1800, 2400], [0, shouldReduceMotion ? 0 : -50]);

  // Function to highlight specific keywords
  const renderHeadline = (text: string) => {
    const parts = text.split(/(Don't worry|web presence)/gi);
    return parts.map((part, i) => {
      if (part.toLowerCase() === "don't worry") {
        return <span key={i} className="text-accent font-extrabold relative inline-block">
          {part}
          <MotionSpan 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-1 left-0 h-3 bg-accent/20 -z-10 rounded-full"
          />
        </span>;
      }
      if (part.toLowerCase() === "web presence") {
        return <span key={i} className="text-warm relative">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div ref={scrollRef} className="flex flex-col gap-0 bg-canvas dark:bg-gray-900 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF7F2] to-[#FDF5DF] dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {/* Warm Gold Blob */}
          <MotionDiv 
            animate={shouldReduceMotion ? {} : { 
              rotate: [0, 360],
              scale: [1, 1.1, 0.9, 1],
              x: [0, 30, -30, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-warm/20 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-normal dark:bg-yellow-600/10" 
          />
          {/* Accent Orange Blob */}
          <MotionDiv 
            animate={shouldReduceMotion ? {} : { 
              rotate: [360, 0],
              scale: [1, 1.2, 0.8, 1],
              x: [0, -40, 40, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] right-[-5%] w-[600px] h-[900px] bg-accent/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal dark:bg-orange-600/10" 
          />
        </div>

        <MotionDiv 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 pt-20 pb-32"
        >
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={anim.staggerContainer}
            className="max-w-5xl mx-auto flex flex-col items-center"
          >
            <MotionDiv variants={anim.fadeInUp} custom={1}>
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/60 dark:bg-white/10 text-primary dark:text-blue-200 text-sm font-semibold tracking-wide mb-8 border border-primary/5 dark:border-white/10 backdrop-blur-sm shadow-sm">
                <Star className="w-4 h-4 text-warm fill-warm" /> Digital Peace of Mind
              </span>
            </MotionDiv>

            <MotionH1 
              variants={anim.fadeInUp} 
              custom={2}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-primary dark:text-white tracking-tight mb-8 leading-[1.1]"
            >
              {renderHeadline(heroContent.headline)}
            </MotionH1>

            <MotionP 
              variants={anim.fadeInUp} 
              custom={3}
              className="text-lg md:text-2xl text-[#3C4A57] dark:text-gray-300 leading-relaxed mb-10 max-w-3xl mx-auto font-light"
            >
              {heroContent.subheadline}
            </MotionP>

            <MotionDiv 
              variants={anim.fadeInUp} 
              custom={4}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full"
            >
              <Link to={heroContent.ctaLink}>
                <Button 
                  variant="primary" 
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {heroContent.ctaText}
                </Button>
              </Link>

              <Link to="/portfolio">
                <Button variant="outline">
                  View Portfolio
                </Button>
              </Link>
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>
        
        {/* --- TRUST BAR --- */}
        <div className="absolute bottom-0 w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-t border-white/20 dark:border-gray-800 z-20">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="text-xs font-bold text-primary dark:text-gray-400 uppercase tracking-widest">Trusted By</span>
               <div className="flex gap-12 items-center overflow-x-auto no-scrollbar max-w-full px-4">
                  <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary dark:text-white shrink-0"><ShieldCheck className="w-5 h-5" /> SecureCorp</div>
                  <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary dark:text-white shrink-0"><Zap className="w-5 h-5" /> BoltEnergy</div>
                  <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary dark:text-white shrink-0"><Globe className="w-5 h-5" /> GlobalTech</div>
                  <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary dark:text-white shrink-0"><Layout className="w-5 h-5" /> DesignCo</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-32 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={anim.staggerContainer}
            className="text-center mb-20"
          >
            <MotionH2 variants={anim.fadeInUp} className="text-support dark:text-teal-400 font-bold tracking-widest uppercase text-sm mb-3">Our Expertise</MotionH2>
            <MotionH3 variants={anim.fadeInUp} className="font-heading text-4xl md:text-5xl font-bold text-primary dark:text-white mb-6">Calm in the Chaos.</MotionH3>
            <MotionP variants={anim.fadeInUp} className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We replace digital anxiety with robust, elegant solutions.
            </MotionP>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <MotionDiv 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { y: -8, boxShadow: "0 20px 40px -15px rgba(10, 42, 67, 0.1)" }}
                className="group p-8 rounded-[2rem] bg-canvas dark:bg-gray-800 border border-transparent hover:border-warm/30 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
              >
                {/* Decorative blob on card */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-warm/10 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
                
                <div className="w-16 h-16 bg-white dark:bg-gray-700 text-primary dark:text-blue-300 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                  <IconRenderer iconName={service.icon} className="w-8 h-8" />
                </div>
                
                <h4 className="text-2xl font-heading font-bold mb-4 text-primary dark:text-white group-hover:text-accent transition-colors relative z-10">{service.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10 flex-grow">
                  {service.description}
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Learn more <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO SECTION --- */}
      <section className="py-32 bg-canvas dark:bg-gray-800 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">Selected Work</h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg">
                Crafted with care, deployed with confidence.
              </p>
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/portfolio" className="group inline-flex items-center text-lg font-semibold text-primary dark:text-blue-400 hover:text-accent transition-colors">
                View All Projects <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MotionDiv>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentWork.map((item, index) => (
              <Link to={`/project/${item.slug}`} key={item.id}>
                <MotionDiv 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                  className="group relative h-[500px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-700 cursor-pointer"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <MotionImg 
                      variants={{ hover: { scale: 1.05, filter: "brightness(0.7)" } }}
                      transition={{ duration: 0.6 }}
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <MotionDiv 
                      variants={{ hover: { y: 0, opacity: 1 } }}
                      initial={{ y: 20, opacity: 0 }}
                      className="mb-auto"
                    >
                       <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/30">
                        {item.category}
                      </span>
                    </MotionDiv>

                    <MotionDiv
                      variants={{ hover: { y: -10 } }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-3xl font-heading font-bold text-white mb-2 drop-shadow-md">{item.title}</h3>
                      <p className="text-white/90 text-sm line-clamp-2 drop-shadow-sm">{item.description}</p>
                    </MotionDiv>
                    
                    <MotionDiv
                      variants={{ hover: { opacity: 1, x: 0 } }}
                      initial={{ opacity: 0, x: -10 }}
                      className="mt-4 flex items-center text-warm font-bold"
                    >
                      View Case Study <ArrowRight className="w-4 h-4 ml-2" />
                    </MotionDiv>
                  </div>
                </MotionDiv>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-32 bg-gradient-to-br from-[#FAF7F2] to-[#FDF5DF] dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
         {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center p-3 mb-6 bg-white rounded-full shadow-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-warm fill-warm" />)}
              </div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary dark:text-white mb-6">Voices of Relief.</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how we've helped businesses stop worrying and start growing.
            </p>
          </MotionDiv>

          {/* Floating Cards with Parallax */}
          <MotionDiv 
            style={{ y: testimonialY }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <MotionDiv 
                key={t.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={shouldReduceMotion ? {} : { y: -10, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-10 rounded-[2rem] shadow-xl shadow-primary/5 relative border border-white/50 dark:border-gray-700"
              >
                <Quote className="w-10 h-10 text-accent/20 absolute top-8 right-8" />
                
                <p className="text-lg text-primary/80 dark:text-gray-200 mb-8 italic leading-relaxed relative z-10">"{t.text}"</p>
                
                <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div className="relative shrink-0">
                    <img src={t.imageUrl} alt={t.author} className="w-12 h-12 rounded-full object-cover border border-gray-200" loading="lazy" />
                  </div>
                  <div>
                    <div className="font-bold text-primary dark:text-white text-base">{t.author}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl"
          >
            {/* Soft Ambient Background inside CTA */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-support/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8">Ready to feel calm?</h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-light">
                Let's discuss your project. We'll handle the tech, so you can handle your business.
              </p>
              <Link to="/contact">
                <Button variant="secondary" className="text-xl px-10 py-5">
                  Start Your Project
                </Button>
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <NewsletterSection />

    </div>
  );
};
