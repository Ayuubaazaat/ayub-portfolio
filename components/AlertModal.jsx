import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const AlertModal = ({ type, title, message, onClose }) => {
  const isSuccess = type === 'success';
  const iconComponent = isSuccess ? <Check className="w-10 h-10 text-white" /> : <X className="w-10 h-10 text-white" />;
  const iconBgColorClass = isSuccess ? 'bg-blue-500' : 'bg-red-500';
  const titleColorClass = isSuccess ? 'text-blue-600' : 'text-red-600';
  const buttonColorClass = isSuccess ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600';
  const gradientColorClass = isSuccess ? 'from-blue-50 to-white' : 'from-red-50 to-white';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle gradient at the bottom - behind everything */}
          <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${gradientColorClass} opacity-50 pointer-events-none`}></div>
          
          {/* Icon Circle */}
          <motion.div 
            className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${iconBgColorClass} relative z-10`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                ease: "easeInOut"
              }}
            >
              {iconComponent}
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.h3 
            className={`text-3xl font-bold mb-3 ${titleColorClass} relative z-10`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-gray-600 mb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {message}
          </motion.p>
          <motion.button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 relative z-20 ${buttonColorClass}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSuccess ? 'Continue' : 'Try Again'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertModal;
