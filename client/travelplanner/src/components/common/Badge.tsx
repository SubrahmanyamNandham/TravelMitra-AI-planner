import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary',
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    secondary: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  };

  return (
    <span className={`
      inline-block px-3 py-1 rounded-full text-sm font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
