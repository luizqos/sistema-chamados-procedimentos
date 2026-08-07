'use client';

import React from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { Can } from '../../src/components/Can';

export default function DebugAuthPage() {
  const { user, loading, logout, hasPermission, hasRole } = useAuth();

  if (loading) return <div className="p-8 text-white">Carregando sessão...</div>;
  if (!user) return <div className="p-8 text-white">Nenhum usuário autenticado.</div>;

  return (
    <div className="p-8 space-y-6 bg-slate-900 text-slate-100 min-h-screen font-mono text-sm">
      <h1 className="text-xl font-bold text-sky-400">🔍 Painel de Debug do AuthContext</h1>

      {/* Dados do Usuário */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>E-mail:</strong> {user.email}</p>
        <p><strong>Role:</strong> <span className="text-emerald-400">{user.role?.nome}</span> (ID: {user.role?.id})</p>
        <p className="mt-2"><strong>Permissões Recebidas ({user.permissoes?.length || 0}):</strong></p>
        <pre className="text-xs bg-slate-900 p-2 rounded mt-1 text-slate-300">
          {JSON.stringify(user.permissoes, null, 2)}
        </pre>
      </div>

      {/* Teste de Validações de Permissão */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
        <p className="font-bold text-sky-400">Resultado dos Helpers:</p>
        <p>hasRole('ADMIN'): <span className={hasRole('ADMIN') ? 'text-green-400' : 'text-red-400'}>{String(hasRole('ADMIN'))}</span></p>
        <p>hasRole('OPERADOR'): <span className={hasRole('OPERADOR') ? 'text-green-400' : 'text-red-400'}>{String(hasRole('OPERADOR'))}</span></p>
        <p>hasPermission('procedimentos:criar'): <span className={hasPermission('procedimentos:criar') ? 'text-green-400' : 'text-red-400'}>{String(hasPermission('procedimentos:criar'))}</span></p>
        <p>hasPermission('usuarios:gerenciar'): <span className={hasPermission('usuarios:gerenciar') ? 'text-green-400' : 'text-red-400'}>{String(hasPermission('usuarios:gerenciar'))}</span></p>
      </div>

      {/* Teste do Componente <Can /> */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
        <p className="font-bold text-sky-400">Renderização Condicional (&lt;Can /&gt;):</p>
        <Can permission="procedimentos:criar">
          <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 rounded">
            ✅ Visível apenas se tiver permissão "procedimentos:criar"
          </div>
        </Can>
        <Can role="ADMIN">
          <div className="p-2 bg-sky-950/80 border border-sky-500/30 text-sky-300 rounded">
            ✅ Visível apenas para a Role "ADMIN"
          </div>
        </Can>
      </div>

      <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-sans font-semibold">
        Sair da Conta (Logout)
      </button>
    </div>
  );
}