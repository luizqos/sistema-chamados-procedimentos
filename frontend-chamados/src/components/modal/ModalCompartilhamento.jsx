'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Share2, Trash2, UserPlus, X, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { procedimentoPermissaoService } from '../../services/procedimentoPermissaoService';

export default function ModalCompartilhamento({ isOpen, onClose, procedimentoId }) {
  const tCommon = useTranslations('Common');

  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);
  const [permissoesAtuais, setPermissoesAtuais] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [nivelSelecionado, setNivelSelecionado] = useState('VISUALIZAR');
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);

  useEffect(() => {
    if (isOpen && procedimentoId) {
      carregarDados();
    }
  }, [isOpen, procedimentoId]);

  async function carregarDados() {
    setCarregandoDados(true);
    try {
      const [resUsuarios, permissoes] = await Promise.all([
        api.get('/usuarios'),
        procedimentoPermissaoService.listarPermissoes(procedimentoId)
      ]);
      setUsuariosDisponiveis(resUsuarios.data);
      setPermissoesAtuais(permissoes);
    } catch (err) {
      toast.error('Erro ao carregar dados de compartilhamento.');
    } finally {
      setCarregandoDados(false);
    }
  }

  const handleAdicionarPermissao = async (e) => {
    e.preventDefault();
    if (!usuarioSelecionado) return;

    setLoading(true);
    try {
      await procedimentoPermissaoService.salvarPermissao(
        procedimentoId, 
        usuarioSelecionado, 
        nivelSelecionado
      );
      toast.success('Permissão salva com sucesso!');
      setUsuarioSelecionado('');
      carregarDados();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao compartilhar procedimento.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverPermissao = async (usuarioId) => {
    try {
      await procedimentoPermissaoService.removerPermissao(procedimentoId, usuarioId);
      toast.success('Acesso removido.');
      carregarDados();
    } catch (err) {
      toast.error('Erro ao remover permissão.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-sky-500" />
            <h3 className="text-base font-bold">Compartilhar Procedimento</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        {carregandoDados ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-sky-500" />
          </div>
        ) : (
          <>
            <form onSubmit={handleAdicionarPermissao} className="flex flex-col sm:flex-row gap-2 mb-6">
              <select
                value={usuarioSelecionado}
                onChange={(e) => setUsuarioSelecionado(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">Selecione um usuário...</option>
                {usuariosDisponiveis.map(u => (
                  <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
                ))}
              </select>

              <select
                value={nivelSelecionado}
                onChange={(e) => setNivelSelecionado(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="VISUALIZAR">Pode Visualizar</option>
                <option value="EDITAR">Pode Editar</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Adicionar
              </button>
            </form>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pessoas com acesso</h4>
              {permissoesAtuais.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">Apenas o criador e administradores possuem acesso irrestrito.</p>
              ) : (
                permissoesAtuais.map(p => (
                  <div key={p.usuario.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{p.usuario.nome}</p>
                      <p className="text-slate-400 text-[10px]">{p.usuario.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 font-bold text-[10px]">
                        {p.nivel === 'EDITAR' ? 'Editor' : 'Visualizador'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoverPermissao(p.usuario.id)}
                        className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                        title="Remover acesso"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <div className="flex justify-end pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {tCommon('voltar')}
          </button>
        </div>

      </div>
    </div>
  );
}