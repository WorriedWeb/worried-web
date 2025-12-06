
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const MotionDiv = motion.div as any;

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useData();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Calculate read time roughly
  const wordCount = post.content.replace(/<[^>]+>/g, '').split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

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
    <div className="bg-canvas dark:bg-gray-900 min-h-screen pb-24 transition-colors duration-300">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-primary/40 z-10" />
        <img 
          src={post.coverImage || 'https://picsum.photos/1200/600'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto w-full">
           <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors font-medium">
             <ArrowLeft className="w-4 h-4" /> Back to Blog
           </Link>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white drop-shadow-md mb-4 max-w-4xl">
             {post.title}
           </h1>
           <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {readTime} min read</span>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <MotionDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          {/* Content */}
          <div 
            className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-heading prose-a:text-accent hover:prose-a:text-accent/80 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <hr className="my-12 border-gray-200 dark:border-gray-700" />

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};
