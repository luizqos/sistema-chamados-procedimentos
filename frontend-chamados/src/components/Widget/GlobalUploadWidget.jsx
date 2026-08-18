'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useUpload } from '../../contexts/UploadContext';
import { X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function GlobalUploadWidget() {
  const { uploadsAtivos, removerUpload } = useUpload();
  const tCommon = useTranslations('Common');
  
  const [minimizado, setMinimizado] = useState(false);

  useEffect(() => {
    if (uploadsAtivos.some(item => item.status === 'erro')) {
      setMinimizado(false);
    }
  }, [uploadsAtivos]);

  if (uploadsAtivos.length === 0) return null;

  const emExecucao = uploadsAtivos.some(item => item.status === 'enviando');

  if (minimizado) {
    return (
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-200">
        <button 
          onClick={() => setMinimizado(false)}
          className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-3 hover:bg-slate-800 transition cursor-pointer"
        >
          {emExecucao && <Loader2 size={16} className="animate-spin text-sky-400" />}
          <span className="text-xs font-semibold">
            {tCommon('enviando')} ({uploadsAtivos.length})
          </span>
          <ChevronUp size={16} className="text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-auto">
      {uploadsAtivos.map((item) => (
        <div key={item.id} className="relative bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs">
          
          {/* Botões ancorados no canto superior direito do widget */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {item.status === 'enviando' && (
              <button 
                onClick={() => setMinimizado(true)}
                className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-1.5 rounded-lg transition cursor-pointer"
              >
                <ChevronDown size={16} />
              </button>
            )}
            {item.status === 'erro' && (
              <button 
                onClick={() => removerUpload(item.id)}
                className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 p-1.5 rounded-lg transition cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {item.procedimento && (
            <div className="mb-2 pb-2 border-b border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium tracking-wide uppercase pr-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span className="truncate max-w-[240px]">Proc: <span className="text-slate-200">{item.procedimento}</span></span>
            </div>
          )}

          <div className="flex justify-between items-center mb-2 gap-2 pr-10">
            <span className={`font-bold truncate flex-1 ${item.status === 'erro' ? 'text-red-400' : 'text-sky-400'}`} title={item.nome}>
              {item.status === 'enviando' ? `${tCommon('enviando')}: ` : item.status === 'concluido' ? `${tCommon('concluido')}: ` : `${tCommon('erro')}: `} 
              {item.nome}
            </span>
            <span className="font-semibold text-slate-300 shrink-0">
              {item.status === 'enviando' ? `${item.progresso}%` : item.status === 'concluido' ? tCommon('concluido') : tCommon('erro')}
            </span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1.5">
            <div 
              className={`h-full transition-all duration-150 ease-out ${item.status === 'erro' ? 'bg-red-500' : item.status === 'concluido' ? 'bg-emerald-500' : 'bg-sky-500'}`}
              style={{ width: `${item.progresso}%` }}
            ></div>
          </div>

          {item.status === 'enviando' && item.total > 0 && (
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>{formatBytes(item.enviado)} {tCommon('de')} {formatBytes(item.total)}</span>
              <span className="text-sky-400 animate-pulse">{tCommon('aguarde')}...</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}