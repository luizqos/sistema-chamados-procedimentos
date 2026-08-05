'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useProcedimentos } from '../src/hooks/useProcedimentos';
import Sidebar from '../src/components/Sidebar';
import ModalNovoProcedimento from '../src/components/ModalNovoProcedimento';
import PainelProcedimento from '../src/components/PainelProcedimento';
import EmptyState from '../src/components/EmptyState';
import { dialog } from '../src/utils/dialogs';

export default function Home() {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarProcedimentos({ busca, page: 1, limit: 15 }, true);
    }, 300);

    return () => clearTimeout(timer);
  }, [busca, carregarProcedimentos]);

  const handleCopiarTexto = (): void => {
    if (!selecionado) return;
    navigator.clipboard.writeText(selecionado.script_passo_a_passo);
    toast.success('Script copiado para a área de transferência!');
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
      />

      <main className="flex-1 p-8 overflow-y-auto bg-white">
        {selecionado ? (
          <PainelProcedimento 
            selecionado={selecionado}
            copiado={copiado}
            onCopiar={handleCopiarTexto}
            onDeletar={handleDeletar}
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