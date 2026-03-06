import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface AnimatedBlobProps {
  className?: string;
}

export const AnimatedBlob: React.FC<AnimatedBlobProps> = ({ className }) => {
  return (
    <motion.div
      animate={{
  x: [0, -4, 3, -2, 0],
  y: [0, -5, -2, 3, 0],
}}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'absolute z-0 rounded-[3rem] bg-[#EDE7FF] opacity-70',
        className
      )}
    />
  );
};
