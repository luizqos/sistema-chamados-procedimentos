'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Search, Loader2, ArrowLeft, History } from 'lucide-react';

import { WithPermission } from '../components/auth/WithPermission';
import { auditoriaService } from '../services/auditoriaService';
import BotaoConfiguracao from '../components/button/BotaoConfiguracao';
import TabelaAuditoria from '../components/table/TabelaAuditoria';
import ModalDetalhesAuditoria from '../components/modal/ModalDetalhesAuditoria';

export default function AuditoriaPage() {
  const tCommon = useTranslations('Common');
  const tAuditoria = useTranslations('Auditoria');

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [busca, setBusca] = useState('');
  const [logSelecionado, setLogSelecionado] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => carregarLogs(), 400);
    return () => clearTimeout(timer);
  }, [page, limit, busca]);

  async function carregarLogs() {
    try {
      setLoading(true);
      const response = await auditoriaService.listar({ page, limit, busca });
      setLogs(response.dados || []);
      setTotalPages(response.totalPages || 1);
      setTotalRegistros(response.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const fecharModal = () => {
    setLogSelecionado(null);
  };

  return (
    <WithPermission role="ADMIN">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition shadow-sm hover:scale-105 duration-150">
              <ArrowLeft size={20} />
            </Link>
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl"><History size={22} /></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tAuditoria('titulo')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tAuditoria('subtitulo')}</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <BotaoConfiguracao />
          </div>
        </div>

        {/* Busca */}
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(1); }}
            placeholder={tAuditoria('buscarPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition shadow-sm"
          />
        </div>

        {/* Listagem */}
        {loading ? (
          <div className="flex justify-center items-center py-20"><Loader2 size={32} className="animate-spin text-indigo-600" /></div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            
            <TabelaAuditoria 
              logs={logs} 
              tAuditoria={tAuditoria} 
              tCommon={tCommon} 
              onVerDetalhes={setLogSelecionado} 
            />

            {/* Paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{tAuditoria('total')} <strong className="text-slate-700 dark:text-slate-300">{totalRegistros}</strong></span>
                <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500">
                  <option value={15}>15 {tAuditoria('porPagina')}</option>
                  <option value={30}>30 {tAuditoria('porPagina')}</option>
                  <option value={50}>50 {tAuditoria('porPagina')}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 duration-100 cursor-pointer">{tCommon('anterior')}</button>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{tAuditoria('paginaDe', { page, totalPages: totalPages || 1 })}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 duration-100 cursor-pointer">{tCommon('proxima')}</button>
              </div>
            </div>
          </div>
        )}

        <ModalDetalhesAuditoria 
          log={logSelecionado} 
          onClose={fecharModal} 
          tAuditoria={tAuditoria} 
        />
      </div>
    </WithPermission>
  );
}