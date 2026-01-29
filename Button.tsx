import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20 border-b-4 border-brand-800 hover:border-brand-700 active:border-b-0 active:translate-y-1",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white shadow-lg shadow-slate-900/20 border-b-4 border-slate-900 hover:border-slate-800 active:border-b-0 active:translate-y-1",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-900/20 border-b-4 border-red-700 hover:border-red-600 active:border-b-0 active:translate-y-1",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-500"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};