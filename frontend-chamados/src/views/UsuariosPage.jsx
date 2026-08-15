'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Users, Shield, Loader2, ArrowLeft, UserPlus, Power, CheckCircle, XCircle, Pencil, Clock } from 'lucide-react';

import { WithPermission } from '../components/WithPermission';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../contexts/AuthContext';
import ModalNovoUsuario from '../components/modal/ModalNovoUsuario';
import ModalEditarUsuario from '../components/modal/ModalEditarUsuario';

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

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      const data = await usuarioService.listar();
      setUsuarios(data);
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

  // Função auxiliar para formatar datas
  const formatarData = (dataString) => {
    if (!dataString) return 'Nunca';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tUsuarios('titulo')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tUsuarios('subtitulo')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20 cursor-pointer"
          >
            <UserPlus size={16} /> {tUsuarios('novoUsuario')}
          </button>
        </div>

        {/* Tabela de Usuários */}
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
                    <th className="p-4">{tUsuarios('id')}</th>
                    <th className="p-4">{tUsuarios('nome')}</th>
                    <th className="p-4">{tUsuarios('email')}</th>
                    <th className="p-4">{tCommon('status')}</th>
                    <th className="p-4">{tUsuarios('perfilAtual')}</th>
                    <th className="p-4">Criação</th>
                    <th className="p-4">Último Login</th>
                    <th className="p-4 text-right">{tCommon('acoes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {usuarios.map((u) => {
                    const ehUsuarioLogado = u.id === usuarioLogado?.id;
                    const isUserAdmin = u.role?.nome === 'ADMIN';

                    return (
                      <tr
                        key={u.id}
                        className={`transition ${
                          u.ativo
                            ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                            : 'bg-slate-100/50 dark:bg-slate-950/40 opacity-60'
                        }`}
                      >
                        <td className="p-4 text-slate-400 dark:text-slate-500 font-mono">#{u.id}</td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{u.nome}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                        
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              u.ativo
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
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                              isUserAdmin
                                ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-400'
                            }`}
                          >
                            <Shield size={12} />
                            {u.role?.nome || 'SEM ROLE'}
                          </span>
                        </td>

                        {/* Data de Criação */}
                        <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {formatarData(u.created_at)}
                        </td>

                        {/* Data de Último Login */}
                        <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {u.ultimo_login ? (
                            formatarData(u.ultimo_login)
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400/80 italic font-sans text-[10px]">Nunca acessou</span>
                          )}
                        </td>

                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setUsuarioEmEdicao(u);
                              setIsModalEdicaoOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="Editar Usuário"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={ehUsuarioLogado}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer disabled:opacity-30"
                            title="Ativar/Inativar"
                          >
                            <Power size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ModalNovoUsuario
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={carregarUsuarios}
        />

        <ModalEditarUsuario
          isOpen={isModalEdicaoOpen}
          onClose={() => {
            setIsModalEdicaoOpen(false);
            setUsuarioEmEdicao(null);
          }}
          usuario={usuarioEmEdicao}
          onSuccess={carregarUsuarios}
        />
      </div>
    </WithPermission>
  );
}