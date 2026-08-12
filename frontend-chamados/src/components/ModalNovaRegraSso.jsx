'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Loader2, ShieldPlus } from 'lucide-react';
import { ssoRegrasService } from '../services/ssoRegrasService';

export default function ModalNovaRegraSso({ isOpen, onClose, onSuccess }) {
  const [tipo, setTipo] = useState('DOMINIO');
  const [valor, setValor] = useState('');
  const [acao, setAcao] = useState('BLOQUEAR');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ssoRegrasService.criar({ tipo, valor: valor.trim(), acao });
      toast.success('Regra de segurança criada com sucesso!');
      onSuccess();
      onClose();
      setValor('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar regra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-800 shadow-2xl text-slate-100 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShieldPlus size={18} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">Nova Regra de SSO</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ação da Regra *</label>
            <select
              value={acao}
              onChange={(e) => setAcao(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            >
              <option value="BLOQUEAR">Bloquear Acesso</option>
              <option value="PERMITIR">Permitir Acesso (Ativa Allowlist)</option>
            </select>
            {acao === 'PERMITIR' && (
              <p className="text-[10px] text-amber-500 mt-1">Ao criar uma regra de "Permitir", todo o resto da internet será bloqueado.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo do Alvo *</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            >
              <option value="DOMINIO">Domínio Inteiro (@empresa.com)</option>
              <option value="EMAIL">E-mail Específico (usuario@empresa.com)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Valor ({tipo === 'DOMINIO' ? 'Ex: dominio.online' : 'Ex: admin@dominio.online'}) *
            </label>
            <input
              type="text"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={tipo === 'DOMINIO' ? 'dominio.online' : 'usuario@dominio.online'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />}
              Salvar Regra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}