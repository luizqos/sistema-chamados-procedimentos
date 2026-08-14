'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useProcedimentos } from '../hooks/useProcedimentos';
import Sidebar from '../components/Sidebar';
import ModalNovoProcedimento from '../components/modal/ModalNovoProcedimento';
import PainelProcedimento from '../components/PainelProcedimento';
import EmptyState from '../components/EmptyState';
import { dialog } from '../utils/dialogs';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const router = useRouter();
  const { user, signed, loading: authLoading, logout } = useAuth();
  const [busca, setBusca] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tCommon = useTranslations('Common');
  const tToastProcedimento = useTranslations('Toast.Procedimento');
  const {
    procedimentos,
    selecionado,
    loading,
    hasMore,
    page,
    carregarProcedimentos,
    obterDetalhes,
    excluirProcedimento
  } = useProcedimentos();

  useEffect(() => {
    if (!authLoading && !signed) {
      router.push('/login');
    }
  }, [signed, authLoading, router]);

  useEffect(() => {
    if (signed) {
      const timer = setTimeout(() => {
        carregarProcedimentos({ busca, page: 1, limit: 15 }, true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [busca, carregarProcedimentos, signed]);

  const handleCopiarTexto = () => {
    if (!selecionado) return;
    navigator.clipboard.writeText(selecionado.script_passo_a_passo);
    setCopiado(true);
    toast.success(tToastProcedimento('copiado'));
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDeletar = async (id) => {
    const confirmado = await dialog.confirmarExclusao({
      titulo: tCommon('tituloExclusao'),
      texto: tCommon('textoExclusao'),
      textoBotaoConfirmar: tCommon('simExcluir'),
      textoBotaoCancelar: tCommon('cancelar'),
    });

    if (confirmado) {
      try {
        await excluirProcedimento(id);
        toast.success(tToastProcedimento('sucessoExclusao'));
        carregarProcedimentos({ busca, page: 1, limit: 15 }, true);
      } catch (err) {
        const mensagemErro = err?.message || `${tToastProcedimento('erroExclusao')}`;
        toast.error(mensagemErro);
      }
    }
  };

  if (authLoading || !signed) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-sky-600 dark:text-sky-500" />
          <span className="text-sm font-medium">{tCommon('verificandoAutenticacao')}</span>
        </div>
      </div>
    );
  }

  const procedimentoComAutor = selecionado
    ? {
      ...selecionado,
      usuario: selecionado.usuario || procedimentos.find((p) => p.id === selecionado.id)?.usuario,
    }
    : null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-200">
      <Sidebar
        busca={busca}
        setBusca={setBusca}
        procedimentos={procedimentos}
        selecionado={selecionado}
        onSelect={obterDetalhes}
        onOpenModal={() => setIsModalOpen(true)}
        hasMore={hasMore}
        loadingMore={loading}
        onLoadMore={() => carregarProcedimentos({ busca, page: page + 1, limit: 15 })}
        user={user}
        onLogout={logout}
      />
      <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-950 transition-colors duration-200">
        {procedimentoComAutor ? (
          <PainelProcedimento
            selecionado={procedimentoComAutor}
            copiado={copiado}
            onCopiar={handleCopiarTexto}
            onDeletar={handleDeletar}
            user={user}
          />
        ) : (
          <EmptyState />
        )}
      </main>

      <ModalNovoProcedimento
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => carregarProcedimentos({ busca, page: 1, limit: 15 }, true)}
      />
    </div>
  );
}