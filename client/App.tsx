
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { ProjectDetails } from './pages/ProjectDetails';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminBlogEditor } from './pages/AdminBlogEditor';
import { AdminProjectEditor } from './pages/AdminProjectEditor';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import { OfferNotification } from './components/OfferNotification';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-canvas dark:bg-gray-900 text-dark dark:text-gray-100 selection:bg-warm selection:text-primary transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Explicit Home Route */}
                  <Route path="/" element={<Home />} />
                  
                  {/* Public Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/project/:slug" element={<ProjectDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Protected Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Blog Editor Routes */}
                  <Route 
                    path="/admin/blog/new" 
                    element={
                      <ProtectedRoute>
                        <AdminBlogEditor />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/blog/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <AdminBlogEditor />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Project Editor Routes */}
                  <Route 
                    path="/admin/project/new" 
                    element={
                      <ProtectedRoute>
                        <AdminProjectEditor />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/project/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <AdminProjectEditor />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Redirect /admin to /admin/dashboard */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  
                  {/* Fallback Route - unknown route goes to NotFound */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <OfferNotification />
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#0B3D91',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#00A896',
                    },
                  },
                  error: {
                    style: {
                      background: '#FF6B35',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
