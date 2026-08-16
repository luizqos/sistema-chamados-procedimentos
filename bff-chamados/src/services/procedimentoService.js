const repository = require('../repositories/procedimentoRepository');
const fs = require('fs');
const path = require('path');

class ProcedimentoService {
  async listarProcedimentos(filtros, usuarioLogado) {
    return await repository.listar({ ...filtros, usuarioLogado });
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

  async atualizarProcedimento(id, dados, usuarioLogado) {
    const idNumerico = Number(id);
    const procedimento = await repository.obterPorId(idNumerico);

    if (!procedimento) {
      const error = new Error('Procedimento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
    const isAdmin = roleNome === 'ADMIN';
    const isCriador = procedimento.usuario_id && procedimento.usuario_id === usuarioLogado?.id;

    let temPermissaoEdicao = false;
    if (!isAdmin && !isCriador) {
      const permissaoCompartilhada = await repository.verificarPermissaoUsuario(idNumerico, usuarioLogado?.id);
      if (permissaoCompartilhada && permissaoCompartilhada.nivel === 'EDITAR') {
        temPermissaoEdicao = true;
      }
    }

    if (!isAdmin && !isCriador && !temPermissaoEdicao) {
      const error = new Error('Acesso negado: Você não tem permissão para editar este procedimento.');
      error.statusCode = 403;
      throw error;
    }

    if (dados.titulo !== undefined && !dados.titulo.trim()) {
      const error = new Error('O título é obrigatório.');
      error.statusCode = 400;
      throw error;
    }

    return await repository.atualizar(idNumerico, dados);
  }

  async excluirAnexo(anexoId, usuarioLogado) {
    const anexo = await repository.obterAnexoPorId(Number(anexoId));
    if (!anexo) {
      const error = new Error('Anexo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const procedimento = await repository.obterPorId(anexo.procedimento_id);
    const isAdmin = usuarioLogado?.role === 'ADMIN';
    const isCriador = procedimento?.usuario_id === usuarioLogado?.id;

    if (!isAdmin && !isCriador) {
      const error = new Error('Acesso negado para excluir este anexo.');
      error.statusCode = 403;
      throw error;
    }

    const fs = require('fs');
    const path = require('path');
    const caminhoCompleto = path.join(__dirname, '../../', anexo.caminho_arquivo);
    if (fs.existsSync(caminhoCompleto)) {
      fs.unlinkSync(caminhoCompleto);
    }

    return await repository.deletarAnexo(Number(anexoId));
  }
}

module.exports = new ProcedimentoService();