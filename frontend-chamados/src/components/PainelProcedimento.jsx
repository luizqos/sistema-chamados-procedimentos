'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Trash2, User, Calendar } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';

import GaleriaAnexos from './GaleriaAnexos';
import BotaoCompartilhar from './button/BotaoCompartilhar';
import ModalCompartilhamento from './modal/ModalCompartilhamento';

export default function PainelProcedimento({ selecionado, copiado, onCopiar, onDeletar, user }) {
  const tProcedimento = useTranslations('Procedimento');
  const tCommon = useTranslations('Common');
  const format = useFormatter();

  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);

  const roleNome = typeof user?.role === 'object' ? user?.role?.nome : user?.role;
  const isAdmin = roleNome === 'ADMIN';
  const isCriador = selecionado?.usuario_id && user?.id ? selecionado.usuario_id === user.id : false;
  const podeExcluir = isAdmin || isCriador;
  const podeCompartilhar = isAdmin || isCriador; // Apenas admin ou criador podem gerenciar compartilhamentos

  const nomeAutor =
    selecionado?.usuario?.nome ||
    selecionado?.criador?.nome ||
    (isCriador ? user?.nome : null) ||
    'Sistema';

  const dataCriacao = selecionado?.created_at
    ? format.dateTime(new Date(selecionado.created_at), { dateStyle: 'medium' })
    : null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col justify-between min-h-full">
      <div>
        {/* Cabeçalho do Procedimento */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
              {selecionado.titulo}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
              {selecionado.descricao}
            </p>
          </div>
          
          <div className="flex gap-2.5 shrink-0">
            {/* Botão Copiar Script */}
            <button
              onClick={onCopiar}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition cursor-pointer ${
                copiado 
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

            {/* Botão Compartilhar (Se Autorizado) */}
            {podeCompartilhar && (
              <BotaoCompartilhar onClick={() => setModalCompartilharAberto(true)} />
            )}
            
            {/* Botão Excluir (Se Autorizado) */}
            {podeExcluir && (
              <button
                onClick={() => onDeletar(selecionado.id)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-red-500 dark:border-red-500/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold text-sm transition cursor-pointer"
                title={tCommon('excluir')}
              >
                <Trash2 size={18} /> {tCommon('excluir')}
              </button>
            )}
          </div>
        </div>

        {/* Script Passo a Passo em Markdown */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {tProcedimento('passoAPasso')}
          </h3>
          <div className="h-[400px] overflow-y-auto custom-scrollbar whitespace-pre-wrap bg-slate-900 dark:bg-black text-slate-50 dark:text-slate-300 p-5 rounded-xl text-sm leading-relaxed font-mono border border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
            <ReactMarkdown>{selecionado.script_passo_a_passo}</ReactMarkdown>
          </div>
        </div>

        {/* Galeria de Anexos */}
        <GaleriaAnexos anexos={selecionado.anexos} />
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
      />
    </div>
  );
}