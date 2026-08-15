'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Shield, Loader2, ArrowLeft, Plus, Trash2, Globe, Mail, CheckCircle, XCircle, Search } from 'lucide-react';

import { WithPermission } from '../components/WithPermission';
import { ssoRegrasService } from '../services/ssoRegrasService';
import { dialog } from '../utils/dialogs';
import ModalNovaRegraSso from '../components/modal/ModalNovaRegraSso';
import { useAuth } from '../contexts/AuthContext';
import BotaoConfiguracao from '@/components/button/BotaoConfiguracao';

export default function SsoRegrasPage() {
  const tSso = useTranslations('Sso');
  const tCommon = useTranslations('Common');
  const tAlertaSso = useTranslations('Alerta.Sso');
  const tToastSso = useTranslations('Toast.Sso');
  const tUsuarios = useTranslations('Usuarios');
  const { user: usuarioLogado } = useAuth();

  const [regras, setRegras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarRegras();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, limit, busca]);

  async function carregarRegras() {
    try {
      setLoading(true);
      const response = await ssoRegrasService.listar({ page, limit, busca });

      if (Array.isArray(response)) {
        setRegras(response);
        setTotalRegistros(response.length);
        setTotalPages(1);
      } else {
        setRegras(response.dados || []);
        setTotalRegistros(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      toast.error(tToastSso('carregarRegrasErro'));
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    const confirmado = await dialog.confirmarExclusao({
      titulo: tAlertaSso('tituloExclusao'),
      texto: tAlertaSso('textoExclusao'),
      textoBotaoConfirmar: tAlertaSso('msgConfirmaExclusao'),
      textoBotaoCancelar: tAlertaSso('msgCancelaExclusao'),
    });
    if (confirmado) {
      try {
        await ssoRegrasService.deletar(id);
        toast.success(tToastSso('deleteRegraSucesso'));
        carregarRegras();
      } catch (err) {
        toast.error(tToastSso('deleteRegraErro'));
      }
    }
  };

  const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
  const isAdmin = roleNome === 'ADMIN';

  return (
    <WithPermission role="ADMIN">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 space-y-6 transition-colors duration-200">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition shadow-sm" 
              title={tCommon('voltar')}
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tSso('titulo')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tSso('subtitulo')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && <BotaoConfiguracao />}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20 cursor-pointer"
            >
              <Plus size={16} /> {tSso('novaRegra')}
            </button>
          </div>
        </div>

        {/* Barra de Busca Dinâmica */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPage(1);
              }}
              placeholder={tSso('buscarPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Alerta */}
        {regras.some(r => r.acao === 'PERMITIR') && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} /> 
            {tSso('alertaAllowlist')}
          </div>
        )}

        {/* Tabela de Regras */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-sky-600 dark:text-sky-500" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-200">
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
                      <td colSpan="4" className="p-8 text-center text-slate-500 dark:text-slate-400">
                        {tSso('semRegras')}
                      </td>
                    </tr>
                  ) : (
                    regras.map((r) => (
                      <tr key={r.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-400">
                            {r.tipo === 'DOMINIO' ? <Globe size={12} /> : <Mail size={12} />}
                            {r.tipo === 'DOMINIO' ? `${tCommon('dominio')}` : `${tCommon('email')}` }
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-slate-800 dark:text-slate-200">{r.valor}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            r.acao === 'PERMITIR' 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400'
                          }`}>
                            {r.acao === 'PERMITIR' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {r.acao === 'PERMITIR' ? `${tCommon('permitir')}` : `${tCommon('negar')}` }
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(r.id)}
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

            {/* Controles de Paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {tUsuarios('totalRegistros') || 'Total de registros:'} <strong className="text-slate-700 dark:text-slate-300">{totalRegistros}</strong>
                </span>
                
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value={10}>10 {tUsuarios('porPagina') || 'por pág'}</option>
                  <option value={25}>25 {tUsuarios('porPagina') || 'por pág'}</option>
                  <option value={50}>50 {tUsuarios('porPagina') || 'por pág'}</option>
                  <option value={100}>100 {tUsuarios('porPagina') || 'por pág'}</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {tCommon('anterior') || 'Anterior'}
                </button>
                
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {tUsuarios('paginaDe', { page, totalPages: totalPages || 1 }) || `Página ${page} de ${totalPages || 1}`}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages || loading}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {tCommon('proxima') || 'Próxima'}
                </button>
              </div>
            </div>

          </div>
        )}

        <ModalNovaRegraSso
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={carregarRegras}
        />
      </div>
    </WithPermission>
  );
}