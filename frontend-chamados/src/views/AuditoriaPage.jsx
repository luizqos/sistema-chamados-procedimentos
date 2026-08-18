'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { ShieldAlert, Loader2, Search, FileJson, ArrowLeft, History, Maximize2, Minimize2, X } from 'lucide-react';
import { WithPermission } from '../components/WithPermission';
import { auditoriaService } from '../services/auditoriaService';
import { formatarData } from '../utils/formatters';
import BotaoConfiguracao from '../components/button/BotaoConfiguracao';

export default function AuditoriaPage() {
  const tCommon = useTranslations('Common');
  const tAuditoria = useTranslations('Auditoria');
  const tToastAuditoria = useTranslations('Toast.Auditoria');

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [busca, setBusca] = useState('');

  const [logSelecionado, setLogSelecionado] = useState(null);
  const [maximizado, setMaximizado] = useState(false);

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
      toast.error(tToastAuditoria('erroCarregar'));
    } finally {
      setLoading(false);
    }
  }

  const fecharModal = () => {
    setLogSelecionado(null);
    setMaximizado(false);
  };

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
    <WithPermission role="ADMIN">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 space-y-6 transition-colors duration-200">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <BotaoConfiguracao />
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <History size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tAuditoria('titulo')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tAuditoria('subtitulo')}</p>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPage(1); }}
              placeholder={tAuditoria('buscarPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-500" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-200">
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
                          <button onClick={() => setLogSelecionado(log)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition" title={tAuditoria('verJson')}>
                            <FileJson size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800">{tCommon('anterior')}</button>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{tAuditoria('paginaDe', { page, totalPages: totalPages || 1 })}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800">{tCommon('proxima')}</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Visualizador de Diff / JSON */}
        {logSelecionado && (
          <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 transition-all ${maximizado ? 'p-0' : 'p-4'}`}>
            <div className={`bg-white dark:bg-slate-900 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${maximizado
                ? 'w-full h-full rounded-none border-0'
                : 'w-full max-w-5xl h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800'
              }`}>

              {/* Header do Modal */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 shrink-0 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg"><ShieldAlert size={18} /></div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tAuditoria('modalTitulo')}</h2>
                    <p className="text-[10px] text-slate-500 font-mono">{logSelecionado.entidade} #{logSelecionado.registro_id} • {logSelecionado.acao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMaximizado(!maximizado)}
                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                    title={maximizado ? tAuditoria('restaurarTamanho') : tAuditoria('telaCheia')}
                  >
                    {maximizado ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button
                    onClick={fecharModal}
                    className="text-slate-400 hover:text-red-500 transition p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                    title={tAuditoria('fechar')}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Corpo do Modal */}
              <div className="p-4 flex-1 flex flex-col md:flex-row gap-4 bg-slate-100/50 dark:bg-black/20 min-h-0 transition-colors">

                {/* Coluna 1: Dados Antigos */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> {tAuditoria('dadosAntigos')}
                  </h3>
                  <div className="relative flex-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner bg-white dark:bg-[#0d1117] overflow-hidden transition-colors">
                    <pre className="absolute inset-0 p-4 text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-auto custom-scrollbar">
                      {logSelecionado.dados_antigos ? JSON.stringify(logSelecionado.dados_antigos, null, 2) : tAuditoria('nenhumDadoAnterior')}
                    </pre>
                  </div>
                </div>

                {/* Coluna 2: Dados Novos */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {tAuditoria('dadosNovos')}
                  </h3>
                  <div className="relative flex-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner bg-white dark:bg-[#0d1117] overflow-hidden transition-colors">
                    <pre className="absolute inset-0 p-4 text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-auto custom-scrollbar">
                      {logSelecionado.dados_novos ? JSON.stringify(logSelecionado.dados_novos, null, 2) : tAuditoria('nenhumDadoNovo')}
                    </pre>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </WithPermission>
  );
}