'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Share2, Trash2, UserPlus, X, Loader2, Search } from 'lucide-react';
import api from '../../services/api';
import { procedimentoPermissaoService } from '../../services/procedimentoPermissaoService';

export default function ModalCompartilhamento({ isOpen, onClose, procedimentoId, criadorId }) {
  const tCompartilhamento = useTranslations('Compartilhamento');
  const tToastCompartilhamento = useTranslations('Toast.Compartilhamento');
  const tCommon = useTranslations('Common');

  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);
  const [permissoesAtuais, setPermissoesAtuais] = useState([]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  const [nivelSelecionado, setNivelSelecionado] = useState('VISUALIZAR');
  const [termoBusca, setTermoBusca] = useState('');
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
        api.get('/api/usuarios'),
        procedimentoPermissaoService.listarPermissoes(procedimentoId)
      ]);

      console.log('resUsuarios', resUsuarios);
      

      const usuariosElegiveis = resUsuarios.data.dados.filter(u => {
        const isAdm = u.role?.nome === 'ADMIN' || u.roleId === 1;
        const isCriador = Number(u.id) === Number(criadorId);
        return !isAdm && !isCriador;
      });

      console.log('elegiveis', usuariosElegiveis);
      

      setUsuariosDisponiveis(usuariosElegiveis);
      setPermissoesAtuais(permissoes);
      setUsuariosSelecionados([]); 
      setTermoBusca('');
    } catch (err) {
      toast.error(tToastCompartilhamento('erroCarregar'));
    } finally {
      setCarregandoDados(false);
    }
  }

  const usuariosFiltrados = usuariosDisponiveis.filter(u => 
    u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    u.email.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleCheckboxChange = (usuarioId) => {
    if (usuariosSelecionados.includes(usuarioId)) {
      setUsuariosSelecionados(usuariosSelecionados.filter(id => id !== usuarioId));
    } else {
      setUsuariosSelecionados([...usuariosSelecionados, usuarioId]);
    }
  };

  const handleSelecionarTodos = () => {
    const idsFiltrados = usuariosFiltrados.map(u => u.id);
    const todosFiltradosSelecionados = idsFiltrados.every(id => usuariosSelecionados.includes(id));

    if (todosFiltradosSelecionados) {
      setUsuariosSelecionados(usuariosSelecionados.filter(id => !idsFiltrados.includes(id)));
    } else {
      const novaSelecao = Array.from(new Set([...usuariosSelecionados, ...idsFiltrados]));
      setUsuariosSelecionados(novaSelecao);
    }
  };

  const handleAdicionarPermissao = async (e) => {
    e.preventDefault();
    if (usuariosSelecionados.length === 0) {
      toast.error(tToastCompartilhamento('nenhumUsuario'));
      return;
    }

    setLoading(true);
    try {
      await procedimentoPermissaoService.salvarPermissaoEmLote(
        procedimentoId, 
        usuariosSelecionados.map(Number), 
        nivelSelecionado
      );
      toast.success(tToastCompartilhamento('sucessoSalvar'));
      setUsuariosSelecionados([]);
      carregarDados();
    } catch (err) {
      toast.error(err.response?.data?.error || tToastCompartilhamento('erroCompartilhar'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverPermissao = async (usuarioId) => {
    try {
      await procedimentoPermissaoService.removerPermissao(procedimentoId, usuarioId);
      toast.success(tToastCompartilhamento('sucessoRemover'));
      carregarDados();
    } catch (err) {
      toast.error(tToastCompartilhamento('erroRemover'));
    }
  };

  if (!isOpen) return null;

  const todosFiltradosSelecionados = usuariosFiltrados.length > 0 && usuariosFiltrados.every(u => usuariosSelecionados.includes(u.id));

  return (
    <div className="fixed inset-0 bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Share2 size={20} className="text-sky-500" />
            <h3 className="text-base font-bold">{tCompartilhamento('tituloModal')}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {carregandoDados ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="overflow-y-auto pr-1 space-y-6 flex-1 custom-scrollbar">
            
            {/* Formulário de Seleção e Busca */}
            <form onSubmit={handleAdicionarPermissao} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {tCompartilhamento('selecionarUsuarios')}
                </label>
                {usuariosFiltrados.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelecionarTodos}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    {todosFiltradosSelecionados ? tCompartilhamento('desmarcarTodos') : tCompartilhamento('selecionarTodos')}
                  </button>
                )}
              </div>

              {/* Caixa de Busca */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={tCompartilhamento('placeholderBusca')}
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Lista com Checkboxes Filtrada */}
              <div className="max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 space-y-1">
                {usuariosFiltrados.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">{tCompartilhamento('nenhumUsuario')}</p>
                ) : (
                  usuariosFiltrados.map(u => {
                    const isChecked = usuariosSelecionados.includes(u.id);
                    return (
                      <label
                        key={u.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs ${
                          isChecked 
                            ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(u.id)}
                            className="w-4 h-4 text-sky-600 rounded border-slate-300 dark:border-slate-700 focus:ring-sky-500 cursor-pointer"
                          />
                          <div>
                            <p className="font-semibold">{u.nome}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Nível de Acesso e Botão Salvar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 px-0.5">
                <select
                  value={nivelSelecionado}
                  onChange={(e) => setNivelSelecionado(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="VISUALIZAR">{tCompartilhamento('podeVisualizar')}</option>
                  <option value="EDITAR">{tCompartilhamento('podeEditar')}</option>
                </select>

                <button
                  type="submit"
                  disabled={loading || usuariosSelecionados.length === 0}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 transition shrink-0"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  {tCompartilhamento('adicionar')} ({usuariosSelecionados.length})
                </button>
              </div>
            </form>

            {/* Lista de Pessoas com Acesso Atual */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{tCompartilhamento('pessoasComAcesso')}</h4>
              {permissoesAtuais.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">{tCompartilhamento('apenasCriador')}</p>
              ) : (
                permissoesAtuais.map(p => (
                  <div key={p.usuario.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{p.usuario.nome}</p>
                      <p className="text-slate-400 text-[10px]">{p.usuario.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 font-bold text-[10px]">
                        {p.nivel === 'EDITAR' ? tCompartilhamento('editor') : tCompartilhamento('visualizador')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoverPermissao(p.usuario.id)}
                        className="text-slate-400 hover:text-red-500 transition cursor-pointer p-1"
                        title="Remover acesso"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Rodapé */}
        <div className="flex justify-end pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
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