import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  children,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-1',
    secondary: 'glass text-white hover:bg-opacity-20',
    tertiary: 'text-blue-400 hover:text-blue-300 border border-blue-400 hover:border-blue-300',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={`
        font-semibold rounded-full transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-r-transparent" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
