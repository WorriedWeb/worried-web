
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { BlogPost } from '../types';
import { RichTextEditor } from '../components/RichTextEditor';
import { ArrowLeft, Save, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const AdminBlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogPosts, addBlogPost, updateBlogPost } = useData();
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: [], author: 'Admin'
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data if editing
  useEffect(() => {
    if (id) {
      const post = blogPosts.find(p => p.id === id);
      if (post) {
        setFormData(post);
      } else {
        // Wait in case data is still loading, otherwise handled by user navigation
      }
    }
  }, [id, blogPosts]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    const toastId = toast.loading('Uploading image...');

    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post('/api/upload', formDataUpload, {
          headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      });
      const url = res.data.url;
      setFormData(prev => ({ ...prev, coverImage: url }));
      toast.success('Uploaded', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Upload failed', { id: toastId });
    }
    
    e.target.value = '';
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    } else if (tagInput.trim()) {
       setFormData(prev => ({ ...prev, tags: [tagInput.trim()] }));
       setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    if (formData.tags) {
      setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Title, Content and Excerpt are required');
      return;
    }

    setIsSubmitting(true);

    // Prepare payload without ID (backend generates it)
    const postPayload = {
      title: formData.title,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || '',
      excerpt: formData.excerpt,
      content: formData.content,
      coverImage: formData.coverImage,
      author: formData.author || 'Admin',
      tags: formData.tags || [],
      publishedAt: formData.publishedAt || new Date().toISOString().split('T')[0],
    };

    try {
      if (id) {
        await updateBlogPost(id, postPayload);
        toast.success('Post updated successfully');
      } else {
        await addBlogPost(postPayload);
        toast.success('Post created successfully');
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || 'Failed to save post';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-gray-900 transition-colors duration-300 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-dark dark:text-white">{id ? 'Edit Post' : 'New Post'}</h1>
        </div>
        <div className="flex gap-3">
           <button 
             type="button" 
             onClick={() => navigate('/admin/dashboard')}
             className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleSubmit} 
             disabled={isSubmitting}
             className="px-6 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-bold flex items-center gap-2 transition-colors shadow-md hover:shadow-lg disabled:opacity-70"
           >
             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isSubmitting ? 'Saving...' : 'Save Post'}
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Post Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-3xl md:text-4xl font-heading font-bold bg-transparent border-0 border-b-2 border-gray-100 dark:border-gray-700 focus:border-primary dark:focus:border-blue-500 focus:ring-0 px-0 py-2 text-dark dark:text-white placeholder-gray-300 transition-colors"
                placeholder="Enter an engaging title..."
              />
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <RichTextEditor 
                label="Content"
                initialValue={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt / Meta Description</label>
              <textarea 
                rows={3} 
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-dark dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                placeholder="A short summary displayed on the blog list page..."
              />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Publishing Meta */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
                 Publishing Details
               </h3>
               
               <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Name</label>
                    <input 
                      type="text" 
                      value={formData.author} 
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL)</label>
                    <input 
                      type="text" 
                      value={formData.slug} 
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="auto-generated-from-title"
                    />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from title.</p>
                 </div>
               </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="font-bold text-dark dark:text-white mb-4">Cover Image</h3>
               
               <div className="relative group cursor-pointer">
                  <div className={`aspect-video w-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border-2 border-dashed ${formData.coverImage ? 'border-transparent' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center relative hover:border-primary transition-all`}>
                    {formData.coverImage ? (
                      <>
                        <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                          Change Image
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Click to upload</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
               </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="font-bold text-dark dark:text-white mb-4">Tags</h3>
               <div className="flex gap-2 mb-3">
                 <input 
                   type="text" 
                   value={tagInput}
                   onChange={e => setTagInput(e.target.value)}
                   className="flex-grow px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                   placeholder="Add a tag..."
                   onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                 />
                 <button onClick={handleAddTag} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-dark dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Add</button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {formData.tags?.map((tag, idx) => (
                   <span key={idx} className="px-2 py-1 bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs rounded-md flex items-center gap-1 font-medium">
                     #{tag} 
                     <button onClick={() => removeTag(tag)} className="hover:text-red-500 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                   </span>
                 ))}
                 {(!formData.tags || formData.tags.length === 0) && (
                   <p className="text-xs text-gray-400 italic">No tags added yet.</p>
                 )}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
