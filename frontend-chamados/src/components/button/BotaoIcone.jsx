import React from 'react';

export default function BotaoIcone({ 
  icon: Icon, 
  onClick, 
  title, 
  color = 'default', 
  active = false, 
  disabled = false 
}) {
  const baseClasses = "p-2 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const colorVariants = {
    default: "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
    sky: "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30",
    emerald: "text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
    red: "text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30",
    greenActive: "text-green-600 bg-green-50 dark:bg-green-900/30"
  };

  const variantClass = active && color === 'greenActive' ? colorVariants.greenActive : colorVariants[color] || colorVariants.default;

  return (
    <button 
      type="button"
      onClick={onClick} 
      title={title} 
      disabled={disabled} 
      className={`${baseClasses} ${variantClass}`}
    >
      <Icon size={18} />
    </button>
  );
}