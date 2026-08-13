'use client';
import React, { createContext, useContext, useState } from 'react';

const UploadContext = createContext({});

export function UploadProvider({ children }) {
  const [uploadsAtivos, setUploadsAtivos] = useState([]);

  // Adiciona ou atualiza um upload na lista global flutuante
  const registrarOuAtualizarUpload = (uploadId, dados) => {
    setUploadsAtivos((prev) => {
      const index = prev.findIndex((item) => item.id === uploadId);
      if (index >= 0) {
        const novaLista = [...prev];
        novaLista[index] = { ...novaLista[index], ...dados };
        return novaLista;
      }
      return [...prev, { id: uploadId, ...dados }];
    });
  };

  const removerUpload = (uploadId) => {
    setUploadsAtivos((prev) => prev.filter((item) => item.id !== uploadId));
  };

  return (
    <UploadContext.Provider value={{ registrarOuAtualizarUpload, removerUpload, uploadsAtivos }}>
      {children}
      <GlobalUploadWidget uploads={uploadsAtivos} />
    </UploadContext.Provider>
  );
}

export const useUpload = () => useContext(UploadContext);

function GlobalUploadWidget({ uploads }) {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {uploads.map((item) => (
        <div key={item.id} className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-bold text-sky-400 truncate max-w-[200px]" title={item.nome}>
              {item.status === 'enviando' ? 'Segundo plano: ' : item.status === 'concluido' ? 'Concluído: ' : 'Erro: '} 
              {item.nome}
            </span>
            <span className="font-semibold text-slate-300">
              {item.status === 'enviando' ? `${item.progresso}%` : item.status === 'concluido' ? 'Sucesso' : 'Erro'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-150 ${item.status === 'erro' ? 'bg-red-500' : item.status === 'concluido' ? 'bg-emerald-500' : 'bg-sky-500'}`}
              style={{ width: `${item.progresso}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}