'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { UserCheck, X, Loader2, User, Mail, Lock, Shield } from 'lucide-react';
import { usuarioService } from '../../services/usuarioService';

export default function ModalEditarUsuario({ isOpen, onClose, usuario, onSuccess }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setSenha(''); // Senha em branco por padrão (só altera se preenchida)
      setRoleId(usuario.role?.id || 2);
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  // Regra: Se ultimo_login estiver preenchido, o e-mail não pode ser editado
  const podeEditarEmail = !usuario.ultimo_login;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dadosAtualizados = {
        nome,
        roleId: Number(roleId),
      };

      // Só envia o e-mail se ele estiver liberado para edição
      if (podeEditarEmail) {
        dadosAtualizados.email = email;
      }

      // Só envia a senha se o campo foi preenchido
      if (senha.trim() !== '') {
        dadosAtualizados.senha = senha;
      }

      await usuarioService.atualizar(usuario.id, dadosAtualizados);
      toast.success('Usuário atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck size={20} className="text-sky-500" />
            <h3 className="text-base font-bold">Editar Usuário</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Nome Completo</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              E-mail Corporativo
              {!podeEditarEmail && <span className="text-[10px] text-amber-500 ml-2 font-normal">(Bloqueado: já realizou login)</span>}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                disabled={!podeEditarEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-sky-500 ${!podeEditarEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Nova Senha (Opcional)</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="Deixe em branco para não alterar"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-sky-500 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Perfil de Acesso</label>
            <div className="relative">
              <Shield size={18} className="absolute left-3.5 top-3 text-slate-500" />
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value={1}>ADMIN</option>
                <option value={2}>OPERADOR</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Salvar Alterações
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}