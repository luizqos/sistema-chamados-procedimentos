'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { X, Loader2, ShieldPlus } from 'lucide-react';

import { ssoRegrasService } from '../../services/ssoRegrasService';

export default function ModalNovaRegraSso({ isOpen, onClose, onSuccess }) {
  const tSso = useTranslations('Sso');
  const tCommon = useTranslations('Common');
  const tToastSSo = useTranslations('Toast.Sso');

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
      toast.success(tToastSSo('cadastroSucesso'));
      onSuccess();
      onClose();
      setValor('');
    } catch (err) {
      toast.error(err.response?.data?.error || `${tToastSSo('cadastroErro')}`);
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
            <ShieldPlus size={18} className="text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {tSso('modalTitulo')} 
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
              {tSso('acaoRegra')} 
            </label>
            <select
              value={acao}
              onChange={(e) => setAcao(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
            >
              <option value="BLOQUEAR">{tSso('bloquearAcesso')}</option>
              <option value="PERMITIR">{tSso('permitirAcesso')}</option>
            </select>
            {acao === 'PERMITIR' && (
              <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1 font-medium">
                {tSso('alertaPermitir')} 
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {tSso('tipoAlvo')} 
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
            >
              <option value="DOMINIO">{tSso('dominioInteiro')}</option>
              <option value="EMAIL">{tSso('emailEspecifico')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {tSso('valor')} ({tipo === 'DOMINIO' ? 'Ex: dominio.online' : 'Ex: admin@dominio.online'}) *
            </label>
            <input
              type="text"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={tipo === 'DOMINIO' ? 'dominio.online' : 'usuario@dominio.online'}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            />
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
              {tSso('salvarRegra')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}