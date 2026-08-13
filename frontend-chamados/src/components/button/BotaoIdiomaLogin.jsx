'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

export default function BotaoIdiomaLogin() {
  const { locale, changeLocale } = useI18n();

  return (
    <div className="absolute top-6 right-6 z-50 flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-xl text-xs">
      <Globe size={14} className="text-slate-400 ml-1.5" />
      <button
        type="button"
        onClick={() => changeLocale('pt-BR')}
        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
          locale === 'pt-BR'
            ? 'bg-sky-600 text-white shadow'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => changeLocale('en-US')}
        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
          locale === 'en-US'
            ? 'bg-sky-600 text-white shadow'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}