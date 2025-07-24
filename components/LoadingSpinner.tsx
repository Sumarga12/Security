
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-[#22C55E] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
      />
    </div>
  );
};

export default LoadingSpinner;