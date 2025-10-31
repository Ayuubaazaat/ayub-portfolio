import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Upload, Eye, X, ArrowUp } from 'lucide-react';

export default function GalleryPage() {
  // Default gallery images
  const defaultGallery = [
    '/aa-removebg-preview.png',
    '/hero-image.png-removebg-preview.png',
    '/me2-removebg-preview.png',
    '/me3-removebg-preview.png',
    '/me-removebg-preview.png'
  ];
  
  const [galleryImages, setGalleryImages] = useState(defaultGallery);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Smooth scroll effect for the whole page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Show/hide back-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Generate varied heights for masonry effect
  const getImageHeight = (index) => {
    const heights = ['h-64', 'h-72', 'h-80', 'h-96'];
    return heights[index % heights.length];
  };
  
  // Generate creative captions
  const getCaption = (index) => {
    const captions = [
      'Portrait Series',
      'Creative Expression',
      'Visual Storytelling',
      'Artistic Vision',
      'Digital Art',
      'Creative Journey',
      'Visual Narrative',
      'Artistic Perspective'
    ];
    return captions[index % captions.length];
  };

  // Load images from R2 on mount
  useEffect(() => {
    const loadImagesFromR2 = async () => {
      try {
        const response = await fetch('/api/gallery/list');
        const data = await response.json();
        if (data.success && data.images.length > 0) {
          // Combine default gallery images with R2 images
          const r2Urls = data.images.map(img => img.url);
          setGalleryImages([...defaultGallery, ...r2Urls]);
          return;
        }
      } catch (error) {
        console.error('Error loading images from R2:', error);
      }

      // Fallback to localStorage if R2 fails
    try {
      const saved = localStorage.getItem('galleryImages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          setGalleryImages(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
    };

    loadImagesFromR2();
  }, []);

  // Save images to localStorage as backup whenever galleryImages changes
  useEffect(() => {
    try {
      localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
    } catch (error) {
      console.error('Error saving gallery images:', error);
    }
  }, [galleryImages]);

  const handleUploadFiles = async (files) => {
    if (!files || !files.length) return;
    
    setUploading(true);
    
    const uploadPromises = Array.from(files).map(async (file) => {
      // Only accept image files
      if (file.type && !file.type.startsWith('image/')) {
        return null;
      }
      // Limit size to ~10MB for R2
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return null;
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const response = await fetch('/api/gallery/upload-simple', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: e.target.result,
                fileName: file.name,
                contentType: file.type,
              }),
            });

            const data = await response.json();
            if (data.success) {
              resolve(data.url);
            } else {
              console.error('Upload failed for', file.name);
              resolve(null);
            }
      } catch (error) {
            console.error('Upload error:', error);
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
    
    if (uploadedUrls.length > 0) {
      // Add uploaded URLs to the gallery
      setGalleryImages((prev) => {
        // Filter out duplicates
        const existingUrls = new Set(prev);
        const newUrls = uploadedUrls.filter(url => !existingUrls.has(url));
        return [...newUrls, ...prev].slice(0, 60);
      });
      
      // Reload images from R2 to ensure consistency
      try {
        const response = await fetch('/api/gallery/list');
        const data = await response.json();
        if (data.success && data.images.length > 0) {
          const r2Urls = data.images.map(img => img.url);
          setGalleryImages([...defaultGallery, ...r2Urls]);
        }
      } catch (error) {
        console.error('Error reloading images:', error);
      }
      
      alert(`${uploadedUrls.length} image(s) uploaded successfully to Cloudflare R2!`);
    } else if (uploadedUrls.length === 0 && Array.from(files).length > 0) {
      alert('No images were uploaded. Please check your connection and try again.');
    }
    
    setUploading(false);
  };

  const handleDeleteImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <Head>
        <title>Creative Showcase - Personal Portfolio</title>
        <meta name="description" content="A premium gallery showcasing creative work and visual excellence" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors">
        <Navbar />
        
        {/* Premium Hero Section with Glassmorphism */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[75vh] flex items-center justify-center px-6 py-32 overflow-hidden"
        >
          {/* Soft Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/30 to-blue-500/40 dark:from-primary/20 dark:via-purple-500/15 dark:to-blue-500/20 transition-all duration-500" />
          
          {/* Glassmorphism Layer */}
          <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-3xl border-b border-white/10 dark:border-white/5" />
          
          {/* Floating Orbs */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl dark:bg-primary/10"
          />
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              x: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl dark:bg-purple-500/10"
          />

          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-[0.9]">
                Creative Showcase
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto mb-16 font-light tracking-wide leading-relaxed"
              >
                A curated collection of visual excellence, showcasing creative work and artistic vision
              </motion.p>
              
              {/* Glassmorphic Floating Upload Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="fixed bottom-8 right-8 z-50"
              >
                <label className={`group relative inline-flex items-center gap-3 px-8 py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/30 hover:scale-105 font-semibold text-lg text-gray-900 dark:text-white overflow-hidden ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {/* Gradient Accent */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.div
                      animate={uploading ? { rotate: 360 } : { rotate: [0, 180, 0] }}
                      transition={uploading ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Upload className="w-6 h-6 text-primary dark:text-primary" />
                    </motion.div>
                    <span className="relative z-10">{uploading ? 'Uploading...' : 'Upload Images'}</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => {
                      if (!uploading) {
                      handleUploadFiles(e.target.files);
                      e.target.value = '';
                      }
                    }}
                  />
                </label>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Masonry Gallery Grid */}
        <section className="px-6 py-24 max-w-7xl mx-auto">
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
              <AnimatePresence>
                {galleryImages.map((src, idx) => (
                  <motion.div
                    key={`${src}-${idx}`}
                    initial={{ opacity: 0, y: 60, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.7, 
                      delay: idx * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    exit={{ opacity: 0, scale: 0.85, y: 20 }}
                    onHoverStart={() => setHoveredIndex(idx)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    className={`group relative overflow-hidden rounded-3xl cursor-pointer ${getImageHeight(idx)}`}
                  >
                    {/* Glassmorphic Card Background with Soft Shadows */}
                    <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-500 dark:shadow-gray-900/50" />
                    
                    {/* Gradient Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredIndex === idx ? 0.1 : 0 
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-3xl transition-opacity duration-500 z-0"
                    />
                    
                    {/* Image Container */}
                    <div className={`relative ${getImageHeight(idx)} overflow-hidden rounded-t-3xl`}>
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: hoveredIndex === idx ? 1.05 : 1 
                        }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative w-full h-full"
                      >
                        <img
                          src={src}
                          alt={getCaption(idx)}
                          className="w-full h-full object-cover transition-transform duration-500"
                          onError={(e) => {
                            console.error('Image failed to load:', src);
                            e.target.style.display = 'none';
                          }}
                        />
                        
                        {/* Darkened Background Overlay on Hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: hoveredIndex === idx ? 1 : 0 
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-0 bg-black/60 dark:bg-black/70 z-10"
                        />
                        
                        {/* Soft Glowing Shadow Effect on Hover */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ 
                            opacity: hoveredIndex === idx ? 1 : 0,
                            scale: hoveredIndex === idx ? 1.02 : 0.98
                          }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 blur-2xl -z-10 dark:from-primary/15 dark:via-purple-500/15 dark:to-blue-500/15"
                        />
                        
                        {/* "View Project" Overlay Text with Fade-in */}
                        <motion.div
                          initial={{ y: 30, opacity: 0, scale: 0.9 }}
                          animate={{ 
                            y: hoveredIndex === idx ? 0 : 30,
                            opacity: hoveredIndex === idx ? 1 : 0,
                            scale: hoveredIndex === idx ? 1 : 0.9
                          }}
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="absolute inset-0 flex items-center justify-center z-20"
                        >
                          <div className="flex flex-col items-center gap-3 text-white">
                            <Eye className="w-7 h-7 mb-1 opacity-90" />
                            <span className="font-semibold text-xl tracking-wide">View Project</span>
                          </div>
                        </motion.div>

                        {/* Delete Button */}
                        <motion.button
                          initial={{ opacity: 0, scale: 0, x: 10 }}
                          animate={{ 
                            opacity: hoveredIndex === idx ? 1 : 0,
                            scale: hoveredIndex === idx ? 1 : 0,
                            x: hoveredIndex === idx ? 0 : 10
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(idx);
                          }}
                          className="absolute top-4 right-4 z-30 w-10 h-10 bg-red-500/90 dark:bg-red-600/90 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-700 shadow-xl border border-white/20"
                          aria-label="Delete image"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Caption Card with Soft Shadows */}
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ 
                        y: hoveredIndex === idx ? -8 : 0 
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative z-10 p-5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200/60 dark:border-gray-700/40 rounded-b-3xl shadow-lg dark:shadow-gray-900/30"
                    >
                      <p className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                        {getCaption(idx)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        Visual Project #{idx + 1}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-40"
            >
              <div className="max-w-lg mx-auto">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/10 dark:to-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-primary/20"
                >
                  <Upload className="w-16 h-16 text-primary dark:text-primary" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Your gallery awaits
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 font-light">
                  Begin your creative journey by uploading your first masterpiece
                </p>
                <label className={`inline-flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 shadow-lg font-semibold text-gray-900 dark:text-white ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <motion.div
                    animate={uploading ? { rotate: 360 } : {}}
                    transition={uploading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                  >
                  <Upload className="w-5 h-5 text-primary" />
                  </motion.div>
                  {uploading ? 'Uploading...' : 'Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => {
                      if (!uploading) {
                      handleUploadFiles(e.target.files);
                      e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>
            </motion.div>
          )}
        </section>

        {/* Floating Back-to-Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(108, 99, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="fixed bottom-8 left-8 z-50 w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl text-primary dark:text-primary rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/50 dark:border-gray-700/50 flex items-center justify-center group"
              aria-label="Scroll to top"
            >
              {/* Gradient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ArrowUp className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:-translate-y-1" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
