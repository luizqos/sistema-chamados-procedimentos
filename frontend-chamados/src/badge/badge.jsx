import React from 'react';

export default function Badge({ 
  children, 
  type = 'default', 
  variant = 'default', 
  icon: Icon,
  className = ''
}) {
  const baseClasses = "inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border transition-colors";
  
  const shapeClasses = type === 'pill' ? 'rounded-full' : 'rounded-md';

  const colorClasses = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800/50',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-800/50',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300 border-slate-200 dark:border-slate-800'
  };

  const resolvedVariant = colorClasses[variant] || colorClasses.default;

  return (
    <span className={`${baseClasses} ${shapeClasses} ${resolvedVariant} ${className}`.trim()}>
      {Icon && <Icon size={12} className="shrink-0" />}

      <span className="truncate">{children}</span>
    </span>
  );
}