'use client';

import React from 'react';
import { FileJson } from 'lucide-react';
import { formatarData } from '../utils/formatters';

export default function TabelaAuditoria({ logs, loading, tAuditoria, tCommon, onVerDetalhes }) {
  const getCorAcao = (acao) => {
    switch (acao) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'UPDATE': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800';
      case 'DELETE': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200';
    }
  };

  const getCorEntidade = (entidade) => {
    switch (entidade) {
      case 'Procedimento': return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200';
      case 'Usuario': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200';
      case 'SsoRegra': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200';
      default: return 'bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="p-4">{tAuditoria('colunas.idReg')}</th>
            <th className="p-4">{tAuditoria('colunas.dataHora')}</th>
            <th className="p-4">{tAuditoria('colunas.usuario')}</th>
            <th className="p-4">{tAuditoria('colunas.acao')}</th>
            <th className="p-4">{tAuditoria('colunas.entidade')}</th>
            <th className="p-4 text-right">{tAuditoria('colunas.detalhes')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
          {logs.length === 0 ? (
            <tr><td colSpan="6" className="p-8 text-center text-slate-400">{tAuditoria('nenhumLog')}</td></tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">#{log.registro_id}</td>
                <td className="p-4 font-mono text-[11px] text-slate-500">{formatarData(log.created_at)}</td>
                <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{log.usuario?.nome || tCommon('sistema')}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getCorAcao(log.acao)}`}>
                    {log.acao}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold border ${getCorEntidade(log.entidade)}`}>
                    {log.entidade}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onVerDetalhes(log)} 
                    className="p-2 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/40 rounded-xl transition-all duration-200 active:scale-90 inline-flex items-center justify-center cursor-pointer shadow-sm hover:shadow" 
                    title={tAuditoria('verJson')}
                  >
                    <FileJson size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}