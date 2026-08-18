'use client';

import React from 'react';
import { Shield, CheckCircle, XCircle, Pencil, Power } from 'lucide-react';
import { formatarData } from '../../utils/formatters';

export default function TabelaUsuarios({ usuarios, usuarioLogado, tUsuarios, tCommon, onEditar, onAlternarStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="p-4">{tUsuarios('id')}</th>
            <th className="p-4">{tUsuarios('nome')}</th>
            <th className="p-4">{tUsuarios('email')}</th>
            <th className="p-4">{tCommon('status')}</th>
            <th className="p-4">{tUsuarios('perfilAtual')}</th>
            <th className="p-4">{tUsuarios('criacao')}</th>
            <th className="p-4">{tUsuarios('ultimoLogin')}</th>
            <th className="p-4 text-right">{tCommon('acoes')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-8 text-center text-slate-400">
                {tUsuarios('nenhumUsuarioEncontrado')}
              </td>
            </tr>
          ) : (
            usuarios.map((u) => {
              const ehUsuarioLogado = u.id === usuarioLogado?.id;
              const isUserAdmin = u.role?.nome === 'ADMIN';

              return (
                <tr
                  key={u.id}
                  className={`transition ${u.ativo
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    : 'bg-slate-100/50 dark:bg-slate-950/40 opacity-60'
                  }`}
                >
                  <td className="p-4 text-slate-400 dark:text-slate-500 font-mono">#{u.id}</td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{u.nome}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${u.ativo
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {u.ativo ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {u.ativo ? tCommon('ativo') : tCommon('inativo')}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${isUserAdmin
                        ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-400'
                      }`}
                    >
                      <Shield size={12} />
                      {u.role?.nome}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {formatarData(u.created_at)}
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {u.ultimo_login ? formatarData(u.ultimo_login) : null}
                  </td>

                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(u)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title={tUsuarios('editarUsuario')}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onAlternarStatus(u)}
                      disabled={ehUsuarioLogado}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer disabled:opacity-30"
                      title={tUsuarios('ativarInativar')}
                    >
                      <Power size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}