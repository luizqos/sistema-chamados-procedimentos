import React, { useState } from 'react';
import { Image as ImageIcon, Film, X, Maximize2, PlayCircle } from 'lucide-react';
import { API_URL } from '../utils/constants';

export default function GaleriaAnexos({ anexos }) {
  const [mediaExpandida, setMediaExpandida] = useState(null);

  if (!anexos || anexos.length === 0) return null;

  const token = typeof window !== 'undefined' ? localStorage.getItem('@chamados:token') : '';

  const getMediaUrl = (caminho) => {
    const caminhoCorrigido = caminho.startsWith('/') ? caminho : `/${caminho}`;
    return `${API_URL}${caminhoCorrigido}?token=${token}`;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Anexos e Vídeos Demonstrativos
      </h3>
      
      {/* Grade de Miniaturas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anexos.map((anexo) => (
          <div key={anexo.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              {anexo.tipo === 'imagem' ? <ImageIcon size={14} /> : <Film size={14} />}
              <span className="truncate" title={anexo.nome_original}>{anexo.nome_original}</span>
            </div>
            
            {/* Container da Miniatura Clicável */}
            <div 
              className="p-2 flex justify-center items-center h-48 relative group cursor-pointer overflow-hidden bg-slate-200/50"
              onClick={() => setMediaExpandida(anexo)}
            >
              {/* Efeito de Hover Escurecido com Ícone */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300 flex items-center justify-center z-10">
                <div className="bg-slate-900/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 shadow-lg">
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
                // O vídeo na miniatura fica sem 'controls' para ser apenas uma capa ilustrativa
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

      {/* Modal / Popup de Expansão (Tela Cheia) */}
      {mediaExpandida && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          
          {/* Botão Fechar no canto superior */}
          <button 
            onClick={() => setMediaExpandida(null)} 
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all z-50 shadow-2xl border border-slate-700 hover:border-red-500"
            title="Fechar (Esc)"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          {/* Área de clique invisível no fundo para fechar ao clicar fora da mídia */}
          <div 
            className="absolute inset-0 z-40 cursor-zoom-out" 
            onClick={() => setMediaExpandida(null)}
          ></div>

          {/* Conteúdo Expandido */}
          <div className="relative z-50 w-full max-w-6xl max-h-full flex items-center justify-center outline-none pointer-events-auto">
            {mediaExpandida.tipo === 'imagem' ? (
              <img
                src={getMediaUrl(mediaExpandida.caminho_arquivo)}
                alt={mediaExpandida.nome_original}
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain border border-slate-800"
              />
            ) : (
              // No popup, o vídeo recebe os controles (controls) e toca automaticamente (autoPlay)
              <video 
                controls 
                autoPlay 
                className="w-full max-h-[85vh] rounded-lg shadow-2xl bg-black border border-slate-800"
              >
                <source src={getMediaUrl(mediaExpandida.caminho_arquivo)} type={mediaExpandida.mime_type} />
                Seu navegador não suporta a tag de vídeo.
              </video>
            )}
          </div>
          
          {/* Legenda Flutuante Inferior */}
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