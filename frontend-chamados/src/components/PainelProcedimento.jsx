'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Trash2, User, Calendar, Globe, Lock, Loader2, Pencil, Save, X, Share2, Info } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import toast from 'react-hot-toast';

import GaleriaAnexos from './GaleriaAnexos';
import ModalCompartilhamento from './modal/ModalCompartilhamento';
import BotaoIcone from './button/BotaoIcone';
import BotaoAcao from './button/BotaoAcao';
import { procedimentoService } from '@/src/services/procedimentoService';

export default function PainelProcedimento({ selecionado, copiado, onCopiar, onDeletar, user, onAtualizarProcedimento }) {
  const tProcedimento = useTranslations('Procedimento');
  const tToastCompartilhamento = useTranslations('Toast.Compartilhamento');
  const tCommon = useTranslations('Common');
  const tCompartilhamento = useTranslations('Compartilhamento');
  const format = useFormatter();

  // =========================================================================
  // DEBUG MODE: Mude para 'true' para visualizar a auditoria de permissões
  // =========================================================================
  const DEBUG_MODE = false;

  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);
  const [isPublico, setIsPublico] = useState(selecionado?.publico || false);
  const [carregandoPublico, setCarregandoPublico] = useState(false);

  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(selecionado?.titulo || '');
  const [descricao, setDescricao] = useState(selecionado?.descricao || '');
  const [scriptPassoAPasso, setScriptPassoAPasso] = useState(selecionado?.script_passo_a_passo || '');
  const [salvando, setSalvando] = useState(false);

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
  const isAdmin = roleNome?.toUpperCase() === 'ADMIN';
  
  const isCriador = selecionado?.usuario_id && user?.id 
    ? String(selecionado.usuario_id) === String(user.id) 
    : false;
  
  const temPermissaoEdicaoCompartilhada = selecionado?.permissoes?.some((p) => {
    const idUsuarioPermissao = p.usuarioId || p.usuario_id || p.usuario?.id;
    const nivelPermissao = p.nivel || p.permissao; 

    const isMesmoUsuario = String(idUsuarioPermissao) === String(user?.id);
    const isNivelEdicao = nivelPermissao?.toUpperCase() === 'EDITAR';

    return isMesmoUsuario && isNivelEdicao;
  });

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

          {/* O Switch agora exige permissão de compartilhamento (Admin ou Criador) */}
          {podeCompartilhar && !editando && (
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

        {/* ALERTA VISUAL DE DEBUG DAS PERMISSÕES (Ativado por constante) */}
        {DEBUG_MODE && (
          <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl text-xs text-sky-800 dark:text-sky-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Info size={18} /> 
              <span>Auditoria de Permissões (Modo Debug)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono bg-white/50 dark:bg-black/20 p-3 rounded-lg">
              <div><strong>Seu ID (Logado):</strong> {user?.id || 'Desconhecido'}</div>
              <div><strong>ID do Criador do Procedimento:</strong> {selecionado?.usuario_id || 'Desconhecido'}</div>
              <div><strong>Seu Perfil (Role):</strong> {roleNome || 'Desconhecido'}</div>
              <div><strong>O Botão de Editar foi Liberado?:</strong> <span className={podeEditar ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>{podeEditar ? 'SIM' : 'NÃO'}</span></div>
            </div>
            <div className="mt-2 pt-2 border-t border-sky-200/50 dark:border-sky-800/50">
              <strong>O que a API retornou no array `selecionado.permissoes`?</strong>
              <pre className="mt-2 p-3 bg-slate-900 text-green-400 rounded-lg overflow-x-auto font-mono text-[11px] leading-relaxed">
                {selecionado?.permissoes 
                  ? JSON.stringify(selecionado.permissoes, null, 2) 
                  : '❌ Array undefined ou inexistente no objeto. (O Backend não fez o JOIN/Include das permissões)'}
              </pre>
            </div>
          </div>
        )}
        {/* FIM DO ALERTA DE DEBUG */}

        {/* Cabeçalho do Procedimento com Botões Extraídos */}
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

          {/* Grupo de Ações Refatorado */}
          <div className="flex gap-1 shrink-0">
            {editando ? (
              <>
                <BotaoAcao 
                  label="Salvar" 
                  icon={Save} 
                  onClick={handleSalvarEdicao} 
                  loading={salvando} 
                  variant="primary" 
                />
                <BotaoAcao 
                  label="Cancelar" 
                  icon={X} 
                  onClick={handleCancelarEdicao} 
                  disabled={salvando} 
                  variant="secondary" 
                />
              </>
            ) : (
              <>
                <BotaoIcone 
                  icon={copiado ? Check : Copy} 
                  onClick={onCopiar} 
                  title={copiado ? tProcedimento('copiado') : tProcedimento('copiarScript')} 
                  active={copiado} 
                  color={copiado ? 'greenActive' : 'default'} 
                />
                {podeEditar && (
                  <BotaoIcone 
                    icon={Pencil} 
                    onClick={() => setEditando(true)} 
                    title="Editar Procedimento" 
                    color="sky" 
                  />
                )}
                {podeCompartilhar && (
                  <BotaoIcone 
                    icon={Share2} 
                    onClick={() => setModalCompartilharAberto(true)} 
                    title={tCommon('compartilhar') || 'Compartilhar'} 
                    color="emerald" 
                  />
                )}
                {podeExcluir && (
                  <BotaoIcone 
                    icon={Trash2} 
                    onClick={() => onDeletar(selecionado.id)} 
                    title={tCommon('excluir')} 
                    color="red" 
                  />
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

        {/* Galeria de Anexos */}
        <GaleriaAnexos 
          procedimentoId={selecionado.id}
          tituloProcedimento={selecionado.titulo}
          anexos={selecionado.anexos || []}
          podeEditar={podeEditar && editando}
          onAtualizarAnexos={(novosAnexos) => {
            if (onAtualizarProcedimento) {
              onAtualizarProcedimento({
                ...selecionado,
                anexos: novosAnexos
              });
            }
          }}
          onUploadConcluido={() => {
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