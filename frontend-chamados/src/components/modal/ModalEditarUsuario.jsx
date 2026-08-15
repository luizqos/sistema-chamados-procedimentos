'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { UserCheck, X, Loader2, User, Mail, Lock, Shield } from 'lucide-react';
import { usuarioService } from '../../services/usuarioService';

export default function ModalEditarUsuario({ isOpen, onClose, usuario, onSuccess }) {
  const tUsuarios = useTranslations('Usuarios');
  const tCommon = useTranslations('Common');
  const tToastUser = useTranslations('Toast.Usuarios');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setSenha('');
      setRoleId(usuario.role?.id || 2);
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  const podeEditarEmail = !usuario.ultimo_login;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dadosAtualizados = {
        nome,
        roleId: Number(roleId),
      };

      if (podeEditarEmail) {
        dadosAtualizados.email = email;
      }

      if (senha.trim() !== '') {
        dadosAtualizados.senha = senha;
      }

      await usuarioService.atualizar(usuario.id, dadosAtualizados);
      toast.success(tToastUser('atualizadoSucesso'));
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || tToastUser('atualizacaoErro');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 transition-colors">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {tUsuarios('modalTituloEditar')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {tUsuarios('nomeCompleto')}
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos Oliveira"
                className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>{tUsuarios('emailCorporativo')}</span>
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                disabled={!podeEditarEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@empresa.com"
                className={`w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors ${
                  !podeEditarEmail ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {tUsuarios('senha')}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder={tUsuarios('senhaPlaceholderEdicao')}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {tUsuarios('perfilAcesso')}
            </label>
            <div className="relative">
              <Shield size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
              >
                <option value={2}>OPERADOR</option>
                <option value={1}>ADMIN</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {tCommon('cancelar')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {tUsuarios('salvarUsuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}