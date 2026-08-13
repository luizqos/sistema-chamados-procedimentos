'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Film, X, Maximize2, PlayCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { API_URL } from '../utils/constants';
import { secureStorage } from '@/src/utils/storage';

export default function GaleriaAnexos({ anexos }) {
  const t = useTranslations('Procedimento');
  const [mediaExpandida, setMediaExpandida] = useState(null);

  if (!anexos || anexos.length === 0) return null;

  const token = typeof window !== 'undefined' ? secureStorage.getItem('@chamados:token') : '';

  const getMediaUrl = (caminho) => {
    const caminhoCorrigido = caminho.startsWith('/') ? caminho : `/${caminho}`;
    return `${API_URL}${caminhoCorrigido}?token=${token}`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        {t('anexosLabel')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anexos.map((anexo) => (
          <div key={anexo.id} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex flex-col transition-colors duration-200">
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 transition-colors duration-200">
              {anexo.tipo === 'imagem' ? <ImageIcon size={14} /> : <Film size={14} />}
              <span className="truncate" title={anexo.nome_original}>{anexo.nome_original}</span>
            </div>
            
            <div 
              className="p-2 flex justify-center items-center h-48 relative group cursor-pointer overflow-hidden bg-slate-200/50 dark:bg-slate-800/50 transition-colors duration-200"
              onClick={() => setMediaExpandida(anexo)}
            >
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-300 flex items-center justify-center z-10">
                <div className="bg-slate-900/80 dark:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 shadow-lg">
                  {anexo.tipo === 'imagem' ? <Maximize2 size={24} /> : <PlayCircle size={28} />}
                </div>
              </div>

              {anexo.tipo === 'imagem' ? (
                <img
                   src={getMediaUrl(anexo.caminho_arquivo)}
                   alt={anexo.nome_original}
                   className="max-w-full max-h-full rounded object-contain group-hover:scale-105 transition-transform duration-500"
                 />
              ) : (
                <video 
                  className="w-full max-h-full rounded object-contain group-hover:scale-105 transition-transform duration-500"
                  preload="metadata"
                >
                  <source src={getMediaUrl(anexo.caminho_arquivo)} type={anexo.mime_type} />
                </video>
              )}
            </div>
          </div>
        ))}
      </div>

      {mediaExpandida && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <button 
            onClick={() => setMediaExpandida(null)} 
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all z-50 shadow-2xl border border-slate-700 hover:border-red-500 cursor-pointer"
            title="Fechar (Esc)"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          <div className="absolute inset-0 z-40 cursor-zoom-out" onClick={() => setMediaExpandida(null)}></div>
          <div className="relative z-50 w-full max-w-6xl max-h-full flex items-center justify-center outline-none pointer-events-auto">
            {mediaExpandida.tipo === 'imagem' ? (
              <img src={getMediaUrl(mediaExpandida.caminho_arquivo)} alt={mediaExpandida.nome_original} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain border border-slate-800" />
            ) : (
              <video controls autoPlay className="w-full max-h-[85vh] rounded-lg shadow-2xl bg-black border border-slate-800">
                <source src={getMediaUrl(mediaExpandida.caminho_arquivo)} type={mediaExpandida.mime_type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <span className="bg-slate-900/90 text-slate-200 text-xs px-4 py-2 rounded-full font-medium tracking-wide shadow-2xl border border-slate-800">
              {mediaExpandida.nome_original}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}