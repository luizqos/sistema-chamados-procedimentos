'use client';

import React, { useEffect, useState } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../config/msalConfig';
import { AuthProvider } from '../contexts/AuthContext';
import { UploadProvider } from '../contexts/UploadContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from '../contexts/I18nContext';

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

  if (!initialized) return null;

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <UploadProvider>
          <I18nProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster position="top-right" reverseOrder={false} />
            </ThemeProvider>
          </I18nProvider>
        </UploadProvider>
      </AuthProvider>
    </MsalProvider>
  );
}