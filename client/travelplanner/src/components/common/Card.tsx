import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = true, 
  onClick 
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -6 } : {}}
      className={`
        glass rounded-2xl p-6 transition-all duration-300 
        ${hoverable ? 'cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
