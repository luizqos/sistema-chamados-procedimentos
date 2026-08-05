import React from 'react';
import { FileText } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <FileText size={56} strokeWidth={1} className="mb-4" />
      <p className="text-base font-medium">
        Selecione um procedimento na barra lateral para visualizar o script.
      </p>
    </div>
  );
}