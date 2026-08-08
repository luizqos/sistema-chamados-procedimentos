'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WithPermission } from '../components/WithPermission';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../contexts/AuthContext';
import ModalNovoUsuario from '../components/ModalNovoUsuario';
import toast from 'react-hot-toast';
import {
  Users,
  Shield,
  Loader2,
  ArrowLeft,
  UserPlus,
  Power,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function GestaoUsuariosPage() {
  const { user: usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (err) {
      toast.error('Erro ao carregar lista de usuários.');
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (usuarioId, novaRoleId) => {
    try {
      await usuarioService.alterarRole(usuarioId, novaRoleId);
      toast.success('Perfil alterado com sucesso!');
      carregarUsuarios();
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao alterar perfil.';
      toast.error(msg);
    }
  };

  const handleToggleStatus = async (usuario) => {
    const novoStatus = !usuario.ativo;
    try {
      await usuarioService.alternarStatus(usuario.id, novoStatus);
      toast.success(`Usuário ${novoStatus ? 'ativado' : 'inativado'} com sucesso!`);
      carregarUsuarios();
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao alterar status.';
      toast.error(msg);
    }
  };

  return (
    <WithPermission role="ADMIN">
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition"
              title="Voltar para os chamados"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Gestão de Usuários</h1>
              <p className="text-xs text-slate-400">
                Gerencie perfis e atribua papéis de acesso ao sistema
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20"
          >
            <UserPlus size={16} /> Novo Usuário
          </button>
        </div>

        {/* Tabela de Usuários */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Nome</th>
                    <th className="p-4">E-mail</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Perfil Atual</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usuarios.map((u) => {
                    const ehUsuarioLogado = u.id === usuarioLogado?.id;
                    const isUserAdmin = u.role?.nome === 'ADMIN';

                    return (
                      <tr
                        key={u.id}
                        className={`transition ${
                          u.ativo
                            ? 'hover:bg-slate-800/30'
                            : 'bg-slate-950/40 opacity-60'
                        }`}
                      >
                        <td className="p-4 text-slate-500 font-mono">#{u.id}</td>
                        <td className="p-4 font-semibold text-slate-200">{u.nome}</td>
                        <td className="p-4 text-slate-400">{u.email}</td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              u.ativo
                                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                                : 'bg-red-950/60 border-red-500/30 text-red-400'
                            }`}
                          >
                            {u.ativo ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {u.ativo ? 'ATIVO' : 'INATIVO'}
                          </span>
                        </td>

                        {/* Perfil (Role Badge) */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                              isUserAdmin
                                ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                                : 'bg-slate-950 border-slate-800 text-sky-400'
                            }`}
                          >
                            <Shield size={12} />
                            {u.role?.nome || 'SEM ROLE'}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="p-4 text-right flex items-center justify-end gap-3">
                          <select
                            value={u.role?.id || ''}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={!u.ativo}
                            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <option value={1}>ADMIN</option>
                            <option value={2}>OPERADOR</option>
                          </select>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={ehUsuarioLogado}
                            title={
                              ehUsuarioLogado
                                ? 'Você não pode inativar sua própria conta'
                                : u.ativo
                                ? 'Inativar usuário'
                                : 'Reativar usuário'
                            }
                            className={`p-1.5 transition rounded-lg ${
                              u.ativo
                                ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800'
                                : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'
                            } disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:bg-transparent`}
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

        {/* Modal de Cadastro */}
        <ModalNovoUsuario
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={carregarUsuarios}
        />
      </div>
    </WithPermission>
  );
}