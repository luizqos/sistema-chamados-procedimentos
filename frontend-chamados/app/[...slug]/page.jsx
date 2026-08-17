'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';

import LoginPage from '@/src/views/LoginPage';
import SetupPage from '@/src/views/SetupPage';
import UsuariosPage from '@/src/views/UsuariosPage';
import SsoRegrasPage from '@/src/views/SsoRegrasPage';
import AuditoriaPage from '@/src/views/AuditoriaPage';

const MAPA_PAGINAS = {
  login: LoginPage,
  setup: SetupPage,
  usuarios: UsuariosPage,
  sso: SsoRegrasPage,
  auditora: AuditoriaPage
};

export default function DynamicRouter({ params }) {
  const resolvedParams = use(params);
  const rotaAtual = resolvedParams.slug?.[0]?.toLowerCase();

  const PaginaComponente = MAPA_PAGINAS[rotaAtual];

  if (!PaginaComponente) {
    notFound();
  }

  return <PaginaComponente />;
}