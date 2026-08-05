import { useState, useCallback } from 'react';
import { procedimentoService } from '../services/procedimentoService';

export function useProcedimentos() {
  const [procedimentos, setProcedimentos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const carregarProcedimentos = useCallback(async (params, isNewSearch = false) => {
    try {
      setLoading(true);
      const data = await procedimentoService.listar(params);

      if (isNewSearch) {
        setProcedimentos(data.items);
      } else {
        setProcedimentos(prev => [...prev, ...data.items]);
      }

      setHasMore(data.hasMore);
      setPage(params.page || 1);
    } catch (error) {
      console.error('Erro ao listar procedimentos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const obterDetalhes = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await procedimentoService.obterPorId(id);
      setSelecionado(data);
    } catch (error) {
      console.error('Erro ao obter detalhes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirProcedimento = useCallback(async (id) => {
    await procedimentoService.deletar(id);
    setSelecionado(null);
  }, []);

  return {
    procedimentos,
    selecionado,
    loading,
    hasMore,
    page,
    carregarProcedimentos,
    obterDetalhes,
    excluirProcedimento
  };
}