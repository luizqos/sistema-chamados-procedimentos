'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * Bloqueia o acesso a uma página se o usuário não possuir autorização.
 *
 * @param {Object} props
 * @param {string} [props.permission] - Chave da permissão
 * @param {string} [props.role] - Nome da Role
 * @param {React.ReactNode} props.children
 */
export function WithPermission({ permission, role, children }) {
  const { user, loading, hasPermission, hasRole } = useAuth();
  const router = useRouter();

  const autorizado =
    (!role || hasRole(role)) &&
    (!permission || hasPermission(permission));

  useEffect(() => {
    if (!loading && (!user || !autorizado)) {
      router.push('/');
    }
  }, [user, loading, autorizado, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 gap-3">
        <Loader2 size={32} className="animate-spin text-sky-500" />
        <p className="text-xs text-slate-400">Verificando permissões...</p>
      </div>
    );
  }

  if (!autorizado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 gap-3 p-6 text-center">
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-xl font-bold">Acesso Restrito</h1>
        <p className="text-xs text-slate-400 max-w-sm">
          Você não possui as permissões necessárias para visualizar este conteúdo.
        </p>
      </div>
    );
  }

  return children;
}