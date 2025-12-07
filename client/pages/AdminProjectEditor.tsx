
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData, api } from '../context/DataContext';
import { Project } from '../types';
import { ArrowLeft, Save, Image as ImageIcon, X, Loader2, Plus, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminProjectEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, addProject, updateProject } = useData();

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category: 'Web App',
    businessUnit: '',
    description: '',
    imageUrl: '',
    gallery: [],
    tags: [],
    technologies: [],
    featured: false,
    status: 'Live',
    websiteUrl: ''
  });

  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setFormData(project);
      } else {
        // Wait for data load if deep linking, handled by DataContext
      }
    }
  }, [id, projects, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and Description are required');
      return;
    }

    setIsSubmitting(true);
    
    // Remove id from payload for new creations to avoid backend validation error
    const { id: _, ...payload } = formData as any;

    const finalProject = {
      ...payload,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `project-${Date.now()}`,
      gallery: formData.gallery || [],
      tags: formData.tags || [],
      technologies: formData.technologies || [],
      imageUrl: formData.imageUrl || 'https://picsum.photos/800/600',
    };

    try {
      if (id) {
        // For updates, we pass the id explicitly to the update function
        await updateProject(id, { ...finalProject, id });
        toast.success('Project updated successfully');
      } else {
        await addProject(finalProject);
        toast.success('Project created successfully');
      }
      navigate('/admin/dashboard');
    } catch (error) {
       console.error(error);
       toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    const toastId = toast.loading('Uploading image...');

    try {
      const res = await api.post('/upload', formDataUpload, {
          headers: { 
              'Content-Type': 'multipart/form-data',
          }
      });
      const url = res.data.url;

      if (field === 'imageUrl') {
        setFormData(prev => ({ ...prev, imageUrl: url }));
      } else {
        setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
      }
      toast.success('Uploaded', { id: toastId });
    } catch (error) {
      toast.error('Upload failed', { id: toastId });
    }
    
    e.target.value = '';
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== t) }));
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData(prev => ({ ...prev, technologies: [...(prev.technologies || []), techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (t: string) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies?.filter(tech => tech !== t) }));
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-gray-900 transition-colors duration-300 pb-20">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-dark dark:text-white">{id ? 'Edit Project' : 'New Project'}</h1>
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
             onClick={handleSave} 
             disabled={isSubmitting}
             className="px-6 py-2 bg-primary dark:bg-blue-600 text-white rounded-lg hover:bg-primary/90 dark:hover:bg-blue-700 text-sm font-bold flex items-center gap-2 transition-colors shadow-md hover:shadow-lg disabled:opacity-70"
           >
             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isSubmitting ? 'Saving...' : 'Save Project'}
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xl font-heading font-bold px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="e.g. LuxeHomes Realty"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  rows={5} 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-dark dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Describe the project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
                <input 
                  type="url" 
                  value={formData.websiteUrl} 
                  onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">Users will be redirected to this URL when clicking "Visit Live Site".</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="font-bold text-dark dark:text-white mb-4">Project Visuals</h3>
               
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Cover Image</label>
                 <div className="relative group cursor-pointer">
                    <div className={`aspect-video w-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden border-2 border-dashed ${formData.imageUrl ? 'border-transparent' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center relative hover:border-primary transition-all`}>
                      {formData.imageUrl ? (
                        <>
                          <img src={formData.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                            Change Image
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                          <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                          <span className="text-xs font-medium">Click to upload main image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gallery Images</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {formData.gallery?.map((img, index) => (
                       <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                          <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          <button 
                             type="button" 
                             onClick={() => removeGalleryImage(index)}
                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <Trash2 className="w-3 h-3" />
                          </button>
                       </div>
                    ))}
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-400 hover:text-primary">
                        <Plus className="w-6 h-6" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-bold text-dark dark:text-white mb-4">Technology Stack</h3>
              <div className="flex gap-2 mb-3">
                 <input 
                   type="text" 
                   value={techInput}
                   onChange={e => setTechInput(e.target.value)}
                   className="flex-grow px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                   placeholder="Add technology (e.g. React)..."
                   onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                 />
                 <button onClick={addTech} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-dark dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                 {formData.technologies?.map((tech, idx) => (
                   <span key={idx} className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-md flex items-center gap-1 font-medium border border-green-100 dark:border-green-800">
                     {tech}
                     <button onClick={() => removeTech(tech)} className="hover:text-green-900 dark:hover:text-green-100"><X className="w-3 h-3" /></button>
                   </span>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
               <h3 className="font-bold text-dark dark:text-white mb-4">Project Details</h3>
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Unit</label>
                  <input 
                    type="text" 
                    value={formData.businessUnit} 
                    onChange={e => setFormData({ ...formData, businessUnit: e.target.value })}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Real Estate"
                  />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                 <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                 >
                    <option value="Web App">Web App</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Website">Website</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Other">Other</option>
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                 <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                 >
                    <option value="Live">Live</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Case Study">Case Study</option>
                 </select>
               </div>
               
               <div className="pt-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature this project</span>
                 </label>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <h3 className="font-bold text-dark dark:text-white mb-4">Tags</h3>
               <div className="flex gap-2 mb-3">
                 <input 
                   type="text" 
                   value={tagInput}
                   onChange={e => setTagInput(e.target.value)}
                   className="flex-grow px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                   placeholder="Add tag..."
                   onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                 />
                 <button onClick={addTag} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-dark dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Add</button>
               </div>
               <div className="flex flex-wrap gap-2">
                 {formData.tags?.map((tag, idx) => (
                   <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-md flex items-center gap-1 font-medium border border-blue-100 dark:border-blue-800">
                     #{tag} 
                     <button onClick={() => removeTag(tag)} className="hover:text-red-500 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
