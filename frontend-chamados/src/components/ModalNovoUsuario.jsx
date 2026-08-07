'use client';

import React, { useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import toast from 'react-hot-toast';
import { X, Loader2, UserPlus } from 'lucide-react';

export default function ModalNovoUsuario({ isOpen, onClose, onSuccess }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [roleId, setRoleId] = useState(2); // 2 = OPERADOR por padrão
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await usuarioService.criar({
        nome,
        email,
        senha,
        roleId: Number(roleId),
      });

      toast.success('Usuário cadastrado com sucesso!');
      onSuccess();
      onClose();

      // Limpa formulário
      setNome('');
      setEmail('');
      setSenha('');
      setRoleId(2);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao cadastrar usuário.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-800 shadow-2xl text-slate-100 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">Cadastrar Novo Usuário</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Carlos Oliveira"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              E-mail Corporativo *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="carlos@empresa.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Senha Inicial *
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Perfil de Acesso (Role) *
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            >
              <option value={2}>OPERADOR</option>
              <option value={1}>ADMIN</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}