const fs = require('fs');
const path = require('path');
const procedimentoRepository = require('../repositories/procedimentoRepository');
const permissaoRepository = require('../repositories/permissaoRepository');

class ProcedimentoService {
  async listarProcedimentos(filtros, usuarioLogado) {
    return await procedimentoRepository.listar({ ...filtros, usuarioLogado });
  }

  async obterProcedimentoPorId(id) {
    const procedimento = await procedimentoRepository.obterPorId(id);
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

    return await procedimentoRepository.criar(dadosComAutor);
  }

  async deletarProcedimento(id, usuarioLogado) {
    const idNumerico = Number(id);
    const procedimento = await procedimentoRepository.obterPorId(idNumerico);

    if (!procedimento) {
      const error = new Error('Procedimento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
    const isAdmin = roleNome?.toUpperCase() === 'ADMIN';
    const idCriador = procedimento.usuario_id || procedimento.usuarioId;
    const isCriador = idCriador && String(idCriador) === String(usuarioLogado?.id);

    if (!isAdmin && !isCriador) {
      const error = new Error('Acesso negado: Você não tem permissão para excluir este procedimento.');
      error.statusCode = 403;
      throw error;
    }

    return await procedimentoRepository.deletar(idNumerico);
  }

  async excluirProcedimento(id, usuarioLogado) {
    return this.deletarProcedimento(id, usuarioLogado);
  }

  async adicionarAnexo(procedimentoId, file, usuarioLogado) {
    if (!file) throw new Error('Nenhum arquivo enviado');

    const idNumerico = Number(procedimentoId);
    const procedimento = await procedimentoRepository.obterPorId(idNumerico);

    if (!procedimento) {
      throw new Error('Procedimento não encontrado.');
    }

    const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
    const isAdmin = roleNome?.toUpperCase() === 'ADMIN';
    const idCriador = procedimento.usuario_id || procedimento.usuarioId;
    const isCriador = idCriador && String(idCriador) === String(usuarioLogado?.id);

    let temPermissaoEdicao = false;
    if (!isAdmin && !isCriador) {
      const permissaoCompartilhada = await permissaoRepository.verificarPermissaoUsuario(idNumerico, usuarioLogado?.id);
      if (permissaoCompartilhada && permissaoCompartilhada.nivel?.toUpperCase() === 'EDITAR') {
        temPermissaoEdicao = true;
      }
    }

    if (!isAdmin && !isCriador && !temPermissaoEdicao) {
      try {
        const caminhoCompleto = path.join(__dirname, '../../uploads/', file.filename);
        if (fs.existsSync(caminhoCompleto)) fs.unlinkSync(caminhoCompleto);
      } catch (e) {}

      const error = new Error('Acesso negado para adicionar anexo neste procedimento.');
      error.statusCode = 403;
      throw error;
    }

    const tipo = file.mimetype.startsWith('image/') ? 'imagem' : 'video';
    const caminho_arquivo = `/uploads/${file.filename}`;

    return await procedimentoRepository.criarAnexo({
      procedimento_id: idNumerico,
      tipo,
      caminho_arquivo,
      nome_original: file.originalname,
      mime_type: file.mimetype,
      tamanho_bytes: file.size
    });
  }

  async atualizarProcedimento(id, dados, usuarioLogado) {
    const idNumerico = Number(id);
    const procedimento = await procedimentoRepository.obterPorId(idNumerico);

    if (!procedimento) {
      const error = new Error('Procedimento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
    const isAdmin = roleNome?.toUpperCase() === 'ADMIN';
    const idCriador = procedimento.usuario_id || procedimento.usuarioId;
    const isCriador = idCriador && String(idCriador) === String(usuarioLogado?.id);

    let temPermissaoEdicao = false;

    if (!isAdmin && !isCriador) {
      const permissaoCompartilhada = await permissaoRepository.verificarPermissaoUsuario(idNumerico, usuarioLogado?.id);
      if (permissaoCompartilhada && permissaoCompartilhada.nivel?.toUpperCase() === 'EDITAR') {
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

    return await procedimentoRepository.atualizar(idNumerico, dados);
  }

  async excluirAnexo(anexoId, usuarioLogado) {
    const anexo = await procedimentoRepository.obterAnexoPorId(Number(anexoId));
    if (!anexo) {
      const error = new Error('Anexo não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const procId = anexo.procedimento_id || anexo.procedimentoId;
    
    if (!procId) {
      throw new Error('Falha de mapeamento: ID do procedimento atrelado ao anexo não foi encontrado.');
    }

    const procedimento = await procedimentoRepository.obterPorId(procId);

    const roleNome = typeof usuarioLogado?.role === 'object' ? usuarioLogado?.role?.nome : usuarioLogado?.role;
    const isAdmin = roleNome?.toUpperCase() === 'ADMIN';
    
    const idCriador = procedimento?.usuario_id || procedimento?.usuarioId;
    const isCriador = idCriador && String(idCriador) === String(usuarioLogado?.id);

    let temPermissaoEdicao = false;

    if (!isAdmin && !isCriador) {
      const permissaoCompartilhada = await permissaoRepository.verificarPermissaoUsuario(procId, usuarioLogado?.id);
      if (permissaoCompartilhada && permissaoCompartilhada.nivel?.toUpperCase() === 'EDITAR') {
        temPermissaoEdicao = true;
      }
    }

    if (!isAdmin && !isCriador && !temPermissaoEdicao) {
      const error = new Error('Acesso negado para excluir este anexo.');
      error.statusCode = 403;
      throw error;
    }

    const filePath = anexo.caminho_arquivo || anexo.caminhoArquivo;
    
    if (filePath) {
      const caminhoCompleto = path.join(__dirname, '../../', filePath);
      if (fs.existsSync(caminhoCompleto)) {
        fs.unlinkSync(caminhoCompleto);
      }
    }

    return await procedimentoRepository.deletarAnexo(Number(anexoId));
  }
}

module.exports = new ProcedimentoService();