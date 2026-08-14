'use client';
import React, { createContext, useContext, useState } from 'react';

const UploadContext = createContext({});

export function UploadProvider({ children }) {
  const [uploadsAtivos, setUploadsAtivos] = useState([]);

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
    </UploadContext.Provider>
  );
}

export const useUpload = () => useContext(UploadContext);