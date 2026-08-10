'use client';

import React, { useEffect, useState } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../config/msalConfig';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    msalInstance.initialize().then(() => {
      setInitialized(true);
    }).catch((err) => {
      console.error("Erro ao inicializar o MSAL:", err);
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </MsalProvider>
  );
}