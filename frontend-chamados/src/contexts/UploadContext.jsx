'use client';
import React, { createContext, useContext, useState } from 'react';
import { procedimentoService } from '@/src/services/procedimentoService';
import toast from 'react-hot-toast';

const UploadContext = createContext({});

export function UploadProvider({ children }) {
  const [uploadsAtivos, setUploadsAtivos] = useState([]);

  const iniciarUploadBackground = async (procedimentoId, arquivo) => {
    const uploadId = `${Date.now()}-${arquivo.name}`;
    
    // Adiciona o arquivo à lista global flutuante
    setUploadsAtivos((prev) => [
      ...prev,
      { id: uploadId, nome: arquivo.name, progresso: 0, status: 'enviando' }
    ]);

    try {
      await procedimentoService.enviarAnexo(procedimentoId, arquivo, (progressData) => {
        setUploadsAtivos((prev) =>
          prev.map((item) =>
            item.id === uploadId ? { ...item, progresso: progressData.percent } : item
          )
        );
      });

      // Sucesso
      setUploadsAtivos((prev) =>
        prev.map((item) => (item.id === uploadId ? { ...item, status: 'concluido' } : item))
      );
      toast.success(`Upload de "${arquivo.name}" concluído com sucesso!`);

      // Remove da lista flutuante após 5 segundos
      setTimeout(() => {
        setUploadsAtivos((prev) => prev.filter((item) => item.id !== uploadId));
      }, 5000);

    } catch (err) {
      console.error(`Erro no upload de ${arquivo.name}:`, err);
      setUploadsAtivos((prev) =>
        prev.map((item) => (item.id === uploadId ? { ...item, status: 'erro' } : item))
      );
      toast.error(`Falha no upload de "${arquivo.name}".`);
    }
  };

  return (
    <UploadContext.Provider value={{ iniciarUploadBackground, uploadsAtivos }}>
      {children}
      {/* Componente Flutuante Global fixo no canto da tela */}
      <GlobalUploadWidget uploads={uploadsAtivos} />
    </UploadContext.Provider>
  );
}

export const useUpload = () => useContext(UploadContext);

// Widget Flutuante que fica visível em qualquer página da aplicação
function GlobalUploadWidget({ uploads }) {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {uploads.map((item) => (
        <div key={item.id} className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-bold text-sky-400 truncate max-w-[200px]" title={item.nome}>
              {item.status === 'enviando' ? 'Enviando: ' : item.status === 'concluido' ? 'Concluído: ' : 'Erro: '} 
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