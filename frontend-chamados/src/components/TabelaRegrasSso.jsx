'use client';

import React from 'react';
import { Globe, Mail, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function TabelaRegrasSso({ regras, tCommon, tSso, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="p-4">{tSso('tipo')}</th>
            <th className="p-4">{tSso('alvo')}</th>
            <th className="p-4">{tSso('efeito')}</th>
            <th className="p-4 text-right">{tCommon('acoes')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
          {regras.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-8 text-center text-slate-400">
                {tSso('semRegras')}
              </td>
            </tr>
          ) : (
            regras.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-400">
                    {r.tipo === 'DOMINIO' ? <Globe size={12} /> : <Mail size={12} />}
                    {r.tipo === 'DOMINIO' ? `${tCommon('dominio')}` : `${tCommon('email')}`}
                  </span>
                </td>
                <td className="p-4 font-mono font-semibold text-slate-800 dark:text-slate-200">{r.valor}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${r.acao === 'PERMITIR'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400'
                  }`}>
                    {r.acao === 'PERMITIR' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {r.acao === 'PERMITIR' ? `${tCommon('permitir')}` : `${tCommon('negar')}`}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onDelete(r.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={16} />
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