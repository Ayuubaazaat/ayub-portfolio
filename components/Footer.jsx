import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';

const Footer = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Works', href: '/#works' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialIcons = [
    { 
      icon: Facebook, 
      href: 'https://www.facebook.com/share/1742L84bQh/?mibextid=wwXIfr',
      label: 'Facebook'
    },
    { 
      icon: Twitter, 
      href: 'https://x.com/ayuub_faahim?s=21',
      label: 'Twitter'
    },
    { 
      icon: Instagram, 
      href: 'https://www.instagram.com/ayuub_aazaat?igsh=MWR3eHolN294ZzV0bA%3D%3D&utm_source=qr',
      label: 'Instagram'
    }
  ];

  const handleLinkClick = (href) => {
    if (href.startsWith('/')) {
      if (router.pathname !== '/') {
        router.push(href);
      } else {
        if (href.includes('#')) {
          const sectionId = href.split('#')[1];
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          router.push(href);
        }
      }
    } else if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      if (router.pathname !== '/') {
        router.push(`/#${sectionId}`).then(() => {
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#0B0F19] dark:bg-[#0B0F19] text-white transition-colors duration-300"
    >
      {/* Gradient Border on Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-purple-500/5 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">Portfolio</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Building digital products, brands and experience. 
              A Product Designer and Visual Developer.
            </p>
            <div className="flex items-center gap-4">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary/20 transition-all duration-300 border border-white/10 dark:border-white/5"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300" />
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:somaliboy419@gmail.com"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  somaliboy419@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:ayuubboodaaye2@gmail.com"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  ayuubboodaaye2@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+252612496070"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  +252 61 249 6070
                </a>
              </li>
              <li>
                <a
                  href="tel:+252684197266"
                  className="hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  +252 68 419 7266
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm text-gray-500"
          >
            © {currentYear} All rights reserved. Designed with passion.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="w-10 h-10 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary/20 transition-all duration-300 border border-white/10 dark:border-white/5"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
