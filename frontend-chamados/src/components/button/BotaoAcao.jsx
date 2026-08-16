import React from 'react';
import { Loader2 } from 'lucide-react';

export default function BotaoAcao({ 
  label, 
  icon: Icon, 
  onClick, 
  disabled = false, 
  loading = false, 
  variant = 'primary' 
}) {
  const baseClasses = "flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white",
    secondary: "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  };

  return (
    <button 
      type="button"
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseClasses} ${variants[variant]}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />} 
      {label}
    </button>
  );
}