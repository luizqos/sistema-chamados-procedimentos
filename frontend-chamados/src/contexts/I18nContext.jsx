'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import ptBR from '../messages/pt-BR.json';
import enUS from '../messages/en-US.json';

const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

const I18nContext = createContext({});

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('pt-BR');

  useEffect(() => {
    const savedLocale = localStorage.getItem('@chamados:locale');
    if (savedLocale && dictionaries[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    if (dictionaries[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('@chamados:locale', newLocale);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale }}>
      <NextIntlClientProvider locale={locale} messages={dictionaries[locale]}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);