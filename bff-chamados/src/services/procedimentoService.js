const repository = require('../repositories/procedimentoRepository');
const fs = require('fs');
const path = require('path');

class ProcedimentoService {
  async listarProcedimentos(busca) {
    return await repository.listar(busca);
  }

  async obterProcedimentoPorId(id) {
    const procedimento = await repository.obterPorId(id);
    if (!procedimento) throw new Error('Procedimento não encontrado');
    return procedimento;
  }

  async criarProcedimento(dados, usuarioLogado) {
    if (!dados.titulo || !dados.script_passo_a_passo) {
      const error = new Error('Título e script passo a passo são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const dadosComAutor = {
      ...dados,
      usuario_id: usuarioLogado?.id || null,
    };

    return await repository.criar(dadosComAutor);
  }

  async deletarProcedimento(id, usuarioLogado) {
    const idNumerico = Number(id);

    const procedimento = await repository.obterPorId(idNumerico);

    if (!procedimento) {
      const error = new Error('Procedimento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = usuarioLogado?.role === 'ADMIN';
    const isCriador = procedimento.usuario_id && procedimento.usuario_id === usuarioLogado?.id;

    if (!isAdmin && !isCriador) {
      const error = new Error('Acesso negado: Você não tem permissão para excluir este procedimento.');
      error.statusCode = 403;
      throw error;
    }

    return await repository.deletar(idNumerico);
  }

  async excluirProcedimento(id, usuarioLogado) {
    const procedimento = await procedimentoRepository.buscarPorId(id);

    if (!procedimento) {
      const error = new Error('Procedimento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = usuarioLogado.role === 'ADMIN';
    const isCriador = procedimento.usuario_id && procedimento.usuario_id === usuarioLogado.id;

    if (!isAdmin && !isCriador) {
      const error = new Error('Acesso negado: Você não tem permissão para excluir este procedimento.');
      error.statusCode = 403;
      throw error;
    }

    return await procedimentoRepository.excluir(id);
  }

  async adicionarAnexo(procedimentoId, file) {
    if (!file) throw new Error('Nenhum arquivo enviado');

    const tipo = file.mimetype.startsWith('image/') ? 'imagem' : 'video';
    const caminho_arquivo = `/uploads/${file.filename}`;

    return await repository.criarAnexo({
      procedimento_id: Number(procedimentoId),
      tipo,
      caminho_arquivo,
      nome_original: file.originalname,
      mime_type: file.mimetype,
      tamanho_bytes: file.size
    });
  }
}

module.exports = new ProcedimentoService();