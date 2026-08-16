'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Trash2, User, Calendar, Globe, Lock, Loader2, Pencil, Save, X } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import toast from 'react-hot-toast';

import GaleriaAnexos from './GaleriaAnexos';
import BotaoCompartilhar from './button/BotaoCompartilhar';
import ModalCompartilhamento from './modal/ModalCompartilhamento';
import { procedimentoService } from '@/src/services/procedimentoService';

export default function PainelProcedimento({ selecionado, copiado, onCopiar, onDeletar, user, onAtualizarProcedimento }) {
  const tProcedimento = useTranslations('Procedimento');
  const tToastCompartilhamento = useTranslations('Toast.Compartilhamento');
  const tCommon = useTranslations('Common');
  const tCompartilhamento = useTranslations('Compartilhamento');
  const format = useFormatter();

  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);
  const [isPublico, setIsPublico] = useState(selecionado?.publico || false);
  const [carregandoPublico, setCarregandoPublico] = useState(false);

  // Estados para edição inline transparente
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(selecionado?.titulo || '');
  const [descricao, setDescricao] = useState(selecionado?.descricao || '');
  const [scriptPassoAPasso, setScriptPassoAPasso] = useState(selecionado?.script_passo_a_passo || '');
  const [salvando, setSalvando] = useState(false);

  // Sincroniza os estados locais APENAS quando trocar de procedimento na sidebar
  useEffect(() => {
    if (selecionado) {
      setTitulo(selecionado.titulo || '');
      setDescricao(selecionado.descricao || '');
      setScriptPassoAPasso(selecionado.script_passo_a_passo || '');
      setIsPublico(selecionado.publico || false);
      setEditando(false);
    }
  }, [selecionado?.id]);

  const roleNome = typeof user?.role === 'object' ? user?.role?.nome : user?.role;
  const isAdmin = roleNome === 'ADMIN';
  const isCriador = selecionado?.usuario_id && user?.id ? selecionado.usuario_id === user.id : false;
  
  const temPermissaoEdicaoCompartilhada = selecionado?.permissoes?.some(
    (p) => p.usuarioId === user?.id && p.nivel === 'EDITAR'
  );

  const podeExcluir = isAdmin || isCriador;
  const podeCompartilhar = isAdmin || isCriador;
  const podeEditar = isAdmin || isCriador || temPermissaoEdicaoCompartilhada;

  const nomeAutor =
    selecionado?.usuario?.nome ||
    selecionado?.criador?.nome ||
    (isCriador ? user?.nome : null) ||
    'Sistema';

  const dataCriacao = selecionado?.created_at
    ? format.dateTime(new Date(selecionado.created_at), {
      dateStyle: 'medium',
      timeZone: 'UTC'
    })
    : null;

  const handleTogglePublico = async (e) => {
    const novoValor = e.target.checked;
    setIsPublico(novoValor);
    setCarregandoPublico(true);

    try {
      const procedimentoAtualizado = await procedimentoService.atualizarProcedimento(selecionado.id, {
        ...selecionado,
        publico: novoValor
      });

      toast.success(novoValor ? tToastCompartilhamento('sucessoPublico') : tToastCompartilhamento('sucessoRestrito'));

      if (onAtualizarProcedimento) {
        onAtualizarProcedimento(procedimentoAtualizado);
      }
    } catch (err) {
      setIsPublico(!novoValor);
      toast.error(err.response?.data?.error || tToastCompartilhamento('erroPublico'));
    } finally {
      setCarregandoPublico(false);
    }
  };

  const handleSalvarEdicao = async () => {
    setSalvando(true);
    try {
      const procedimentoAtualizado = await procedimentoService.atualizarProcedimento(selecionado.id, {
        titulo,
        descricao,
        script_passo_a_passo: scriptPassoAPasso,
        publico: isPublico
      });

      toast.success('Procedimento atualizado com sucesso!');
      
      setTitulo(procedimentoAtualizado.titulo);
      setDescricao(procedimentoAtualizado.descricao);
      setScriptPassoAPasso(procedimentoAtualizado.script_passo_a_passo);
      setEditando(false);

      if (onAtualizarProcedimento) {
        onAtualizarProcedimento(procedimentoAtualizado);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao atualizar procedimento.');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setTitulo(selecionado.titulo || '');
    setDescricao(selecionado.descricao || '');
    setScriptPassoAPasso(selecionado.script_passo_a_passo || '');
    setEditando(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col justify-between min-h-full">
      <div>
        {/* Flag de Procedimento Público / Restrito no Topo */}
        <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            {isPublico ? <Globe size={16} className="text-sky-500" /> : <Lock size={16} className="text-amber-500" />}
            <span>
              {isPublico
                ? tCompartilhamento('avisoPublico')
                : tCompartilhamento('avisoRestrito')}
            </span>
          </div>

          {podeEditar && !editando && (
            <div className="flex items-center gap-2 shrink-0">
              {carregandoPublico && <Loader2 size={14} className="animate-spin text-sky-500" />}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublico}
                  onChange={handleTogglePublico}
                  disabled={carregandoPublico}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">{tCompartilhamento('publicoLabel')}</span>
              </label>
            </div>
          )}
        </div>

        {/* Cabeçalho do Procedimento */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="w-full space-y-1">
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={!editando}
              placeholder="Título do Procedimento"
              className={`w-full text-2xl font-bold bg-transparent text-slate-900 dark:text-slate-100 transition-all ${
                editando 
                  ? 'border-b border-sky-500/50 pb-1 focus:outline-none focus:border-sky-500 rounded-none' 
                  : 'border-none cursor-default'
              }`}
            />
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={!editando}
              placeholder="Adicionar uma descrição curta..."
              className={`w-full text-sm bg-transparent text-slate-600 dark:text-slate-400 transition-all ${
                editando 
                  ? 'border-b border-sky-500/50 pb-1 focus:outline-none focus:border-sky-500 rounded-none' 
                  : 'border-none cursor-default'
              }`}
            />
          </div>

          <div className="flex gap-2.5 shrink-0">
            {editando ? (
              <>
                <button
                  onClick={handleSalvarEdicao}
                  disabled={salvando}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {salvando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Salvar
                </button>
                <button
                  onClick={handleCancelarEdicao}
                  disabled={salvando}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition cursor-pointer shadow-sm"
                >
                  <X size={18} /> Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onCopiar}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition cursor-pointer ${copiado
                    ? 'bg-green-600 dark:bg-green-600'
                    : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                >
                  {copiado ? (
                    <>
                      <Check size={18} /> {tProcedimento('copiado')}
                    </>
                  ) : (
                    <>
                      <Copy size={18} /> {tProcedimento('copiarScript')}
                    </>
                  )}
                </button>

                {podeEditar && (
                  <button
                    onClick={() => setEditando(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-sky-500 dark:border-sky-500/50 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 font-semibold text-sm transition cursor-pointer"
                  >
                    <Pencil size={18} /> Editar
                  </button>
                )}

                {podeCompartilhar && (
                  <BotaoCompartilhar onClick={() => setModalCompartilharAberto(true)} />
                )}

                {podeExcluir && (
                  <button
                    onClick={() => onDeletar(selecionado.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-red-500 dark:border-red-500/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold text-sm transition cursor-pointer"
                    title={tCommon('excluir')}
                  >
                    <Trash2 size={18} /> {tCommon('excluir')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Script Passo a Passo */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {tProcedimento('passoAPasso')}
          </h3>
          
          {editando ? (
            <textarea
              value={scriptPassoAPasso}
              onChange={(e) => setScriptPassoAPasso(e.target.value)}
              placeholder="Digite o script em Markdown..."
              className="w-full h-[400px] overflow-y-auto custom-scrollbar whitespace-pre-wrap bg-slate-900 dark:bg-black text-slate-50 dark:text-slate-300 p-5 rounded-xl text-sm leading-relaxed font-mono border border-slate-800 dark:border-slate-800 focus:outline-none focus:ring-0 focus:border-transparent resize-none transition-colors"
            />
          ) : (
            <div className="h-[400px] overflow-y-auto custom-scrollbar whitespace-pre-wrap bg-slate-900 dark:bg-black text-slate-50 dark:text-slate-300 p-5 rounded-xl text-sm leading-relaxed font-mono border border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
              <ReactMarkdown>{scriptPassoAPasso}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Galeria de Anexos Integrada com UploadContext */}
        <GaleriaAnexos 
          procedimentoId={selecionado.id}
          tituloProcedimento={selecionado.titulo}
          anexos={selecionado.anexos || []}
          podeEditar={podeEditar && editando}
          onAtualizarAnexos={(novosAnexos) => {
            // Filtro local instantâneo para exclusões
            if (onAtualizarProcedimento) {
              onAtualizarProcedimento({
                ...selecionado,
                anexos: novosAnexos
              });
            }
          }}
          onUploadConcluido={() => {
            // Recarrega de forma silenciosa do servidor o procedimento para popular a nova mídia na tela
            if (onAtualizarProcedimento) {
              onAtualizarProcedimento({ id: selecionado.id });
            }
          }}
        />
      </div>

      {/* Rodapé Informativo (Criador e Data) */}
      <div className="mt-10 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors">
            <User size={14} />
          </div>
          <span>
            {tProcedimento('criadoPor')} <strong className="text-slate-800 dark:text-slate-300 font-semibold">{nomeAutor}</strong>
          </span>
        </div>
        {dataCriacao && (
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Calendar size={14} />
            <span>{dataCriacao}</span>
          </div>
        )}
      </div>

      {/* Modal de Compartilhamento */}
      <ModalCompartilhamento
        isOpen={modalCompartilharAberto}
        onClose={() => setModalCompartilharAberto(false)}
        procedimentoId={selecionado?.id}
        criadorId={selecionado?.usuario_id}
      />
    </div>
  );
}