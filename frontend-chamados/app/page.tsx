'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { useProcedimentos } from '../src/hooks/useProcedimentos';
import Sidebar from '../src/components/Sidebar';
import ModalNovoProcedimento from '../src/components/ModalNovoProcedimento';
import PainelProcedimento from '../src/components/PainelProcedimento';
import EmptyState from '../src/components/EmptyState';
import { dialog } from '../src/utils/dialogs';

export default function Home() {
  const router = useRouter();
  const { user, signed, loading: authLoading, logout } = useAuth();

  const [busca, setBusca] = useState<string>('');
  const [copiado, setCopiado] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  // Redireciona para /login se não houver usuário autenticado
  useEffect(() => {
    if (!authLoading && !signed) {
      router.push('/login');
    }
  }, [signed, authLoading, router]);

  // Carrega a lista de procedimentos somente após validar a autenticação
  useEffect(() => {
    if (signed) {
      const timer = setTimeout(() => {
        carregarProcedimentos({ busca, page: 1, limit: 15 }, true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [busca, carregarProcedimentos, signed]);

  const handleCopiarTexto = (): void => {
    if (!selecionado) return;
    navigator.clipboard.writeText(selecionado.script_passo_a_passo);
    setCopiado(true);
    toast.success('Script copiado para a área de transferência!');
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDeletar = async (id: number): Promise<void> => {
    const confirmado = await dialog.confirmarExclusao({
      titulo: 'Excluir Procedimento?',
      texto: 'Esta ação removerá o procedimento e todos os seus anexos do servidor.',
    });

    if (confirmado) {
      try {
        await excluirProcedimento(id);
        toast.success('Procedimento excluído com sucesso!');
        carregarProcedimentos({ busca, page: 1, limit: 15 }, true);
      } catch (err: unknown) {
        const mensagemErro = err instanceof Error ? err.message : 'Erro ao excluir procedimento';
        toast.error(mensagemErro);
      }
    }
  };

  // Tela de carregamento enquanto valida a sessão local
  if (authLoading || !signed) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-sky-600" />
          <span className="text-sm font-medium">Verificando autenticação...</span>
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
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
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

      <main className="flex-1 p-8 overflow-y-auto bg-white">
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