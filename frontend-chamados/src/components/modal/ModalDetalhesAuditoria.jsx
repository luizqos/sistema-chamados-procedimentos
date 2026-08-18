'use client';

import React, { useState } from 'react';
import { ShieldAlert, Minimize2, Maximize2, X } from 'lucide-react';

export default function ModalDetalhesAuditoria({ log, onClose, tAuditoria }) {
  const [maximizado, setMaximizado] = useState(false);

  if (!log) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 transition-all ${maximizado ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white dark:bg-slate-900 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
        maximizado ? 'w-full h-full rounded-none border-0' : 'w-full max-w-5xl h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800'
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg"><ShieldAlert size={18} /></div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tAuditoria('modalTitulo')}</h2>
              <p className="text-[10px] text-slate-500 font-mono">{log.entidade} #{log.registro_id} • {log.acao}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMaximizado(!maximizado)}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all p-2 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/40 border border-slate-200 hover:border-indigo-100 dark:border-slate-700 dark:hover:border-indigo-900/40 rounded-xl active:scale-90 duration-150 cursor-pointer shadow-sm"
            >
              {maximizado ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all p-2 bg-slate-100 hover:bg-red-500/10 dark:bg-slate-800 dark:hover:bg-red-500/10 border border-slate-200 hover:border-red-200 dark:border-slate-700 dark:hover:border-red-900/30 rounded-xl active:scale-90 duration-150 cursor-pointer shadow-sm"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Corpo */}
        <div className="p-4 flex-1 flex flex-col md:flex-row gap-4 bg-slate-100/50 dark:bg-black/20 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> {tAuditoria('dadosAntigos')}
            </h3>
            <div className="relative flex-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner bg-white dark:bg-[#0d1117] overflow-hidden">
              <pre className="absolute inset-0 p-4 text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-auto custom-scrollbar">
                {log.dados_antigos ? JSON.stringify(log.dados_antigos, null, 2) : tAuditoria('nenhumDadoAnterior')}
              </pre>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {tAuditoria('dadosNovos')}
            </h3>
            <div className="relative flex-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner bg-white dark:bg-[#0d1117] overflow-hidden">
              <pre className="absolute inset-0 p-4 text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-auto custom-scrollbar">
                {log.dados_novos ? JSON.stringify(log.dados_novos, null, 2) : tAuditoria('nenhumDadoNovo')}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}