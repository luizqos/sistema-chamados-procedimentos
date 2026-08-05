import React from 'react';
import { Image as ImageIcon, Film } from 'lucide-react';
import { API_URL } from '../utils/constants';

export default function GaleriaAnexos({ anexos }) {
  if (!anexos || anexos.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Anexos e Vídeos Demonstrativos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anexos.map((anexo) => (
          <div key={anexo.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              {anexo.tipo === 'imagem' ? <ImageIcon size={14} /> : <Film size={14} />}
              <span className="truncate">{anexo.nome_original}</span>
            </div>
            <div className="p-2 flex justify-center items-center min-h-[160px]">
              {anexo.tipo === 'imagem' ? (
                <img 
                  src={`${API_URL}${anexo.caminho_arquivo}`} 
                  alt={anexo.nome_original} 
                  className="max-w-full max-h-56 rounded object-contain" 
                />
              ) : (
                <video controls className="w-full max-h-56 rounded">
                  <source src={`${API_URL}${anexo.caminho_arquivo}`} type={anexo.mime_type} />
                </video>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}