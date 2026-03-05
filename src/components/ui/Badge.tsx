import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variants = {
    default: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200',
    success: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-200',
    error: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-200',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full ring-1 ring-black/5 dark:ring-white/10',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
