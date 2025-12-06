import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  icon?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, icon }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between border-b border-yellow-500/30 pb-4 mb-6">
      <div className="flex items-center gap-3">
        {icon && <span className="text-yellow-400">{icon}</span>}
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wider uppercase">{title}</h1>
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-900 bg-yellow-500 hover:bg-yellow-400 rounded transition-colors"
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </button>
      )}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-4 py-3 rounded font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
    secondary: "bg-slate-800 text-yellow-500 border border-yellow-500/50 hover:bg-slate-700 hover:border-yellow-400",
    danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30",
    ghost: "text-slate-400 hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-900/80 border border-slate-700 rounded-lg p-6 shadow-xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);