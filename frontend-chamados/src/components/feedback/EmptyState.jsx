'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmptyState() {
  const t = useTranslations('Procedimento');

  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
      <FileText size={56} strokeWidth={1} className="mb-4" />
      <p className="text-base font-medium text-center">
        {t('selecioneProcedimento')}
      </p>
    </div>
  );
}