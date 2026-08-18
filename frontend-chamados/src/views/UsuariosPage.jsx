'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Users, Loader2, ArrowLeft, UserPlus, Search } from 'lucide-react';

import { WithPermission } from '../components/WithPermission';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../contexts/AuthContext';
import ModalNovoUsuario from '../components/modal/ModalNovoUsuario';
import ModalEditarUsuario from '../components/modal/ModalEditarUsuario';
import TabelaUsuarios from '../components/table/TabelaUsuarios';
import BotaoConfiguracao from '../components/button/BotaoConfiguracao';


export default function GestaoUsuariosPage() {
  const tUsuarios = useTranslations('Usuarios');
  const tCommon = useTranslations('Common');
  const tToastUser = useTranslations('Toast.Usuarios');
  const { user: usuarioLogado } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [isModalEdicaoOpen, setIsModalEdicaoOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarUsuarios();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [page, limit, busca]);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      const response = await usuarioService.listar({ page, limit, busca });
      if (Array.isArray(response)) {
        setUsuarios(response);
        setTotalRegistros(response.length);
        setTotalPages(1);
      } else {
        setUsuarios(response.dados || []);
        setTotalRegistros(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      toast.error(tToastUser('carregarUsuario'));
    } finally {
      setLoading(false);
    }
  }

  const handleToggleStatus = async (usuario) => {
    const novoStatus = !usuario.ativo;
    try {
      await usuarioService.alternarStatus(usuario.id, novoStatus);
      toast.success(`${tCommon('usuario')} ${novoStatus ? tCommon('ativado').toLowerCase() : tCommon('inativado').toLowerCase()} ${tCommon('comSucesso')}!`);
      carregarUsuarios();
    } catch (err) {
      toast.error(err.response?.data?.error || tToastUser('erroStatus'));
    }
  };

  const handleAbrirEdicao = (u) => {
    setUsuarioEmEdicao(u);
    setIsModalEdicaoOpen(true);
  };

  const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
  const isAdmin = roleNome === 'ADMIN';

  return (
    <WithPermission role="ADMIN">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 space-y-6 transition-colors duration-200">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tUsuarios('titulo')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tUsuarios('subtitulo')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <BotaoConfiguracao />}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20 cursor-pointer"
            >
              <UserPlus size={16} /> {tUsuarios('novoUsuario')}
            </button>
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
              placeholder={tUsuarios('buscarPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Estrutura de Listagem */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-sky-600 dark:text-sky-500" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            
            <TabelaUsuarios 
              usuarios={usuarios}
              usuarioLogado={usuarioLogado}
              tUsuarios={tUsuarios}
              tCommon={tCommon}
              onEditar={handleAbrirEdicao}
              onAlternarStatus={handleToggleStatus}
            />

            {/* Paginação */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  {tUsuarios('totalRegistros')} <strong className="text-slate-700 dark:text-slate-300">{totalRegistros}</strong>
                </span>
                <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="bg-white dark:bg-slate-900 border border-slate-300 text-xs rounded-lg px-2 py-1">
                  <option value={10}>10 {tUsuarios('porPagina')}</option>
                  <option value={25}>25 {tUsuarios('porPagina')}</option>
                  <option value={50}>50 {tUsuarios('porPagina')}</option>
                  <option value={100}>100 {tUsuarios('porPagina')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || loading} className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-40">{tCommon('anterior')}</button>
                <span className="text-xs font-mono">{tUsuarios('paginaDe', { page, totalPages: totalPages || 1 })}</span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page >= totalPages || loading} className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-40">{tCommon('proxima')}</button>
              </div>
            </div>
          </div>
        )}

        <ModalNovoUsuario isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={carregarUsuarios} />
        <ModalEditarUsuario
          isOpen={isModalEdicaoOpen}
          onClose={() => { setIsModalEdicaoOpen(false); setUsuarioEmEdicao(null); }}
          usuario={usuarioEmEdicao}
          onSuccess={carregarUsuarios}
        />
      </div>
    </WithPermission>
  );
}