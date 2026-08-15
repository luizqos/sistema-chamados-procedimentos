'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useUpload } from '../contexts/UploadContext';

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function GlobalUploadWidget() {
  const { uploadsAtivos } = useUpload();
  const tCommon = useTranslations('Common');

  if (uploadsAtivos.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-auto">
      {uploadsAtivos.map((item) => (
        <div key={item.id} className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs">
          
          {item.procedimento && (
            <div className="mb-2 pb-2 border-b border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span className="truncate max-w-[280px]">Proc: <span className="text-slate-200">{item.procedimento}</span></span>
            </div>
          )}

          <div className="flex justify-between items-center mb-1.5">
            <span className="font-bold text-sky-400 truncate max-w-[200px]" title={item.nome}>
              {item.status === 'enviando' ? `${tCommon('enviando')}: ` : item.status === 'concluido' ? `${tCommon('concluido')}: ` : `${tCommon('erro')}: `} 
              {item.nome}
            </span>
            <span className="font-semibold text-slate-300">
              {item.status === 'enviando' ? `${item.progresso}%` : item.status === 'concluido' ? tCommon('concluido') : tCommon('erro')}
            </span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-150 ${item.status === 'erro' ? 'bg-red-500' : item.status === 'concluido' ? 'bg-emerald-500' : 'bg-sky-500'}`}
              style={{ width: `${item.progresso}%` }}
            ></div>
          </div>

          {item.status === 'enviando' && item.total > 0 && (
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
              <span>{formatBytes(item.enviado)} {tCommon('de')} {formatBytes(item.total)}</span>
              <span className="text-sky-400 animate-pulse">{tCommon('aguarde')}...</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}