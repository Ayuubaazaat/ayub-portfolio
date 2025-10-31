import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = ['About', 'Works', 'Gallery', 'Services', 'Contact'];
  
  const socialIcons = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1742L84bQh/?mibextid=wwXIfr', color: 'bg-primary' },
    { icon: Twitter, href: 'https://x.com/ayuub_faahim?s=21', color: 'bg-primary' },
    { icon: Instagram, href: 'https://www.instagram.com/ayuub_aazaat?igsh=MWR3eWhsN294ZzV0bA%3D%3D&utm_source=qr', color: 'bg-primary' }
  ];
  
  const handleMenuItemClick = (item) => {
    setMobileMenuOpen(false); // Close mobile menu
    
    if (item === 'About') {
      if (router.pathname !== '/') {
        router.push('/#about');
      } else {
        setTimeout(() => {
          const aboutSection = document.getElementById('about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else if (item === 'Works') {
      if (router.pathname !== '/') {
        router.push('/#works');
      } else {
        setTimeout(() => {
          const worksSection = document.getElementById('works');
          if (worksSection) {
            worksSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else if (item === 'Gallery') {
      router.push('/gallery');
    } else if (item === 'Services') {
      if (router.pathname !== '/') {
        router.push('/#services');
      } else {
        setTimeout(() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else if (item === 'Contact') {
      if (router.pathname !== '/') {
        router.push('/').then(() => {
          setTimeout(() => {
            const footer = document.getElementById('contact');
            if (footer) {
              footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        });
      } else {
        setTimeout(() => {
          const footer = document.getElementById('contact');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  return (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 transition-colors"
        >
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          whileHover={{ 
            scale: 1.1, 
            boxShadow: "0 8px 25px rgba(108, 99, 255, 0.4)",
            transition: { duration: 0.2 }
          }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="https://i.postimg.cc/6qqdvw4y/Me-icon-removebg-preview.png"
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                // Fallback to icon if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoad={() => console.log('Profile image loaded successfully')}
            />
            <div className="w-full h-full bg-primary rounded-full flex items-center justify-center" style={{display: 'none'}}>
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

            {/* Menu Items - Desktop */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {menuItems.map((item, index) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="text-gray-900 dark:text-gray-100 font-medium hover:text-primary transition-colors duration-200 cursor-pointer bg-transparent border-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMenuItemClick(item);
              }}
            >
              {item}
            </motion.button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-900 dark:text-gray-100 hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

            {/* User Authentication or Social Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:ml-0 ml-4">
          <ThemeToggle />
          {status === 'loading' ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : session ? (
            <>
              {/* Admin Dashboard Link - Only show if user is admin */}
              {session.user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '') && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/admin/gallery-approval')}
                  className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-200 rounded-lg hover:bg-primary/10"
                  title="Admin Dashboard"
                >
                  Admin
                </motion.button>
              )}
            </>
          ) : (
            <>
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-8 h-8 ${social.color} rounded-full flex items-center justify-center hover:shadow-lg transition-shadow duration-200`}
                >
                  <social.icon className="w-4 h-4 text-white" />
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                Login
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMenuItemClick(item);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-900 dark:text-gray-100 font-medium hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
