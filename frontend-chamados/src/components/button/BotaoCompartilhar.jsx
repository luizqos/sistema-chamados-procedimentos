'use client';
import React from 'react';
import { Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BotaoCompartilhar({ onClick }) {
  const tCommon = useTranslations('Common');
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition cursor-pointer"
      title={tCommon('compartilhar')}
    >
      <Share2 size={18} /> {tCommon('compartilhar')}
    </button>
  );
}