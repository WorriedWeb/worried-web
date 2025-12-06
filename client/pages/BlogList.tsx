
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;

export const BlogList: React.FC = () => {
  const { blogPosts } = useData();

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-canvas dark:bg-gray-900 min-h-screen pt-12 pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Insights</span>
          <h1 className="font-heading text-5xl font-bold text-primary dark:text-white mb-4">Latest from the Blog</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Thoughts on technology, design, and finding calm in the digital chaos.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <MotionDiv 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700"
              >
                <div className="relative h-56 overflow-hidden">
                  <MotionImg 
                    src={post.coverImage || 'https://picsum.photos/600/400'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/90 dark:bg-gray-900/90 text-primary dark:text-white text-xs font-bold rounded shadow-sm backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}</span>
                  </div>

                  <h2 className="text-xl font-heading font-bold text-dark dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="text-accent font-bold text-sm flex items-center mt-auto">
                    Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </MotionDiv>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
