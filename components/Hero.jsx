import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp } from 'lucide-react';
import AlertModal from './AlertModal';

const Hero = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Email form handler
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertType('error');
      setAlertTitle('Oooops!');
      setAlertMessage('Please enter a valid email address.');
      setShowAlert(true);
      return;
    }
    
    // Reset email and show success
    setEmail('');
    setAlertType('success');
    setAlertTitle('Success!');
    setAlertMessage('Thank you! I\'ll get back to you soon.');
    setShowAlert(true);
  };

  // Professional photos array - using your actual image files
  const professionalPhotos = [
    '/aa-removebg-preview.png',
    '/hero-image.png-removebg-preview.png',
    '/me2-removebg-preview.png',
    '/me3-removebg-preview.png',
    '/me-removebg-preview.png'
  ];

  // Animated text array - modern UI/UX portfolio texts
  const animatedTexts = [
    {
      line1: "Building digital",
      line2: "products, brands",
      line3: "experience."
    },
    {
      line1: "Creating stunning",
      line2: "user interfaces",
      line3: "that inspire."
    },
    {
      line1: "Transforming ideas",
      line2: "into digital",
      line3: "masterpieces."
    }
  ];

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % professionalPhotos.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [professionalPhotos.length]);

  // Auto-rotate text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => 
        (prevIndex + 1) % animatedTexts.length
      );
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [animatedTexts.length]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-6 py-12 bg-transparent"
      >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 confetti-bg transition-colors"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Heading - Animated Text */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <div className="relative h-[200px] md:h-[240px] lg:h-[280px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={currentTextIndex}
                      initial={{ 
                        opacity: 0, 
                        y: 50,
                        scale: 0.9,
                        rotateX: 15
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        rotateX: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: -50,
                        scale: 1.1,
                        rotateX: -15
                      }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.4, 0, 0.2, 1],
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight absolute inset-0 flex flex-col justify-center"
                    >
                      {animatedTexts[currentTextIndex].line1}<br />
                      {animatedTexts[currentTextIndex].line2}<br />
                      <span className="text-primary flex items-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <ArrowRight className="w-8 h-8 mr-2" />
                        </motion.div>
                        {animatedTexts[currentTextIndex].line3}
                      </span>
                    </motion.h1>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Subtext */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-2"
              >
                <p className="text-lg text-muted leading-relaxed">
                  a <span className="font-semibold text-gray-900 dark:text-gray-100">Product Designer and Visual Developer</span> in SF.
                </p>
                <p className="text-lg text-muted leading-relaxed">
                  I specialize in UI/UX Design, Responsive Web Design,
                  and Visual Development.
                </p>
              </motion.div>

              {/* Email Form */}
              <motion.form 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(108, 99, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 whitespace-nowrap"
                >
                  Connect With Me
                </motion.button>
              </motion.form>
            </div>

            {/* Right Content - Free-Flowing Animated Images */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center lg:justify-end relative"
            >
              <div className="relative w-full max-w-lg h-[600px] flex items-center justify-center">
                {/* Floating Background Elements */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Main Image Container - No Rectangle */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={professionalPhotos[currentImageIndex]}
                      alt="Professional portrait"
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
                      }}
                      initial={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        rotateY: 25,
                        y: 50
                      }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        rotateY: 0,
                        y: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 1.2, 
                        rotateY: -25,
                        y: -50
                      }}
                      transition={{ 
                        duration: 1.2, 
                        ease: [0.4, 0, 0.2, 1],
                        type: "spring",
                        stiffness: 80,
                        damping: 20
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => console.log('Image loaded successfully')}
                    />
                  </AnimatePresence>
                </div>

                {/* Floating Particles */}
                <motion.div
                  className="absolute top-10 right-10 w-3 h-3 bg-primary/30 rounded-full"
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute bottom-20 left-10 w-2 h-2 bg-primary/40 rounded-full"
                  animate={{ 
                    y: [0, 15, 0],
                    opacity: [0.4, 0.9, 0.4]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                <motion.div
                  className="absolute top-1/3 left-5 w-1.5 h-1.5 bg-primary/50 rounded-full"
                  animate={{ 
                    x: [0, 10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>

    {/* About Section */}
    <motion.section 
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
          className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 transition-colors"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            About <span className="text-primary">Me</span>
          </h2>
          
          <div className="space-y-6 text-lg text-muted leading-relaxed">
            <p>
              I'm a passionate <span className="font-semibold text-gray-900 dark:text-gray-100">Product Designer and Visual Developer</span> based in Mogadishu, 
              dedicated to creating exceptional digital experiences that bridge the gap between design and technology.
            </p>
            
            <p>
              With expertise in <span className="font-semibold text-gray-900 dark:text-gray-100">UI/UX Design</span>, <span className="font-semibold text-gray-900 dark:text-gray-100">Responsive Web Design</span>, 
              and <span className="font-semibold text-gray-900 dark:text-gray-100">Visual Development</span>, I help businesses transform their ideas into 
              beautiful, functional digital products.
            </p>
            
            <p>
              My approach combines creative vision with technical precision, ensuring every project 
              not only looks stunning but also delivers exceptional user experiences across all devices.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">UI/UX Design</h3>
              <p className="text-muted">Creating intuitive and beautiful user interfaces</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Web Development</h3>
              <p className="text-muted">Building responsive and performant websites</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Visual Development</h3>
              <p className="text-muted">Bringing designs to life with modern technologies</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>


    {/* Works Section */}
    <motion.section 
      id="works"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-transparent"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            My <span className="text-primary">Journey</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Currently pursuing Computer Science while actively trading in financial markets. 
            Here's a glimpse into my academic and trading journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Computer Science Studies */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 transition-colors"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Computer Science</h3>
                <p className="text-muted">Student & Developer</p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted">
              <p>
                Currently pursuing a <span className="font-semibold text-gray-900 dark:text-gray-100">Computer Science degree</span>, 
                focusing on software development, algorithms, and system design.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Key Areas of Study:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Programming Languages (Python, JavaScript, Java)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Data Structures & Algorithms
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Web Development & UI/UX Design
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Database Management & System Design
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Trading */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 transition-colors"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Trading</h3>
                <p className="text-muted">Active Trader</p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted">
              <p>
                Actively trading in financial markets, combining <span className="font-semibold text-gray-900 dark:text-gray-100">technical analysis</span> 
                with <span className="font-semibold text-gray-900 dark:text-gray-100">programming skills</span> to develop trading strategies.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Trading Focus:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Technical Analysis & Chart Patterns
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Algorithmic Trading Strategies
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Risk Management & Portfolio Optimization
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Market Research & Financial Analysis
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Future Projects */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What's Next?</h3>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Combining my Computer Science education with trading experience, I'm working on 
              <span className="font-semibold text-gray-900 dark:text-gray-100"> algorithmic trading systems</span> and 
              <span className="font-semibold text-gray-900 dark:text-gray-100"> financial technology solutions</span>. 
              Stay tuned for exciting projects that bridge technology and finance!
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>

    {/* Services Section */}
    <motion.section 
      id="services"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            My <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Combining my Computer Science education with practical trading experience, 
            I offer specialized services in technology and finance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Web Development */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Web Development</h3>
            <p className="text-muted mb-6">
              Custom website development using modern technologies like React, Next.js, and Node.js. 
              Responsive, fast, and user-friendly applications.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Frontend Development (React, Next.js)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Backend Development (Node.js, Python)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Database Design & Management
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Responsive Design & Optimization
              </li>
            </ul>
          </motion.div>

          {/* UI/UX Design */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">UI/UX Design</h3>
            <p className="text-muted mb-6">
              User-centered design solutions that enhance user experience and drive engagement. 
              From wireframes to high-fidelity prototypes.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                User Research & Analysis
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Wireframing & Prototyping
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Visual Design & Branding
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Usability Testing & Optimization
              </li>
            </ul>
          </motion.div>

          {/* Trading Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Trading Analysis</h3>
            <p className="text-muted mb-6">
              Technical analysis and market research services for informed trading decisions. 
              Combining traditional analysis with algorithmic approaches.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Technical Chart Analysis
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Market Research & Reports
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Risk Assessment & Management
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Trading Strategy Development
              </li>
            </ul>
          </motion.div>

          {/* Algorithmic Trading */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Algorithmic Trading</h3>
            <p className="text-muted mb-6">
              Custom trading algorithms and automated systems using programming and data analysis. 
              Bridging computer science with financial markets.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Trading Bot Development
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Data Analysis & Backtesting
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                API Integration & Automation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Performance Monitoring
              </li>
            </ul>
          </motion.div>

          {/* Portfolio Management */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Portfolio Management</h3>
            <p className="text-muted mb-6">
              Strategic portfolio optimization and risk management solutions. 
              Data-driven approaches to maximize returns while minimizing risk.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Asset Allocation Strategies
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Risk Assessment & Mitigation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Performance Tracking & Analysis
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Diversification Strategies
              </li>
            </ul>
          </motion.div>

          {/* Consulting */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-colors duration-300"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tech & Finance Consulting</h3>
            <p className="text-muted mb-6">
              Strategic consulting services combining technology expertise with financial market knowledge. 
              Helping businesses leverage both domains effectively.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Technology Strategy & Planning
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Financial Technology Solutions
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Market Research & Insights
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Investment Strategy Guidance
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Work Together?</h3>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
              Whether you need web development, trading analysis, or tech consulting, 
              I'm here to help you achieve your goals with practical, student-friendly solutions.
            </p>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(108, 99, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>

    {/* Scroll to Top Button */}
    {showScrollTop && (
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(108, 99, 255, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    )}

    {/* Alert Modal */}
    {showAlert && (
      <AlertModal
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={handleCloseAlert}
      />
    )}
    </>
  );
};

export default Hero;
