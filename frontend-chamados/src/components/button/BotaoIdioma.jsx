'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export default function BotaoIdioma() {
  const { locale, changeLocale } = useI18n();

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
      <Globe size={14} className="text-slate-500 dark:text-slate-400 ml-1" />
      <button
        type="button"
        onClick={() => changeLocale('pt-BR')}
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
          locale === 'pt-BR'
            ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => changeLocale('en-US')}
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
          locale === 'en-US'
            ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}