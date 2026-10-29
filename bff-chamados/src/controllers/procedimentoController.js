const procedimentoService = require('../services/procedimentoService');

class ProcedimentoController {
  async listar(req, res) {
    try {
      const { busca, page = 1, limit = 15 } = req.query;
      const resultado = await procedimentoService.listarProcedimentos(
        { busca, page, limit },
        req.usuario
      );
      return res.json(resultado);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  async obterPorId(req, res) {
    try {
      const procedimento = await procedimentoService.obterProcedimentoPorId(req.params.id);
      return res.json(procedimento);
    } catch (error) {
      const status = error.statusCode || 404;
      return res.status(status).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      const novo = await procedimentoService.criarProcedimento(req.body, req.usuario);
      return res.status(201).json(novo);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      await procedimentoService.deletarProcedimento(req.params.id, req.usuario);
      return res.json({ message: 'Excluído com sucesso' });
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ error: error.message });
    }
  }

  async adicionarAnexo(req, res) {
    try {
      const anexo = await procedimentoService.adicionarAnexo(
        req.params.id,
        req.file,
        req.usuario
      );
      return res.status(201).json(anexo);
    } catch (error) {
      const status = error.statusCode || 400;
      return res.status(status).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const procedimentoAtualizado = await procedimentoService.atualizarProcedimento(
        id,
        req.body,
        req.usuario
      );
      return res.json(procedimentoAtualizado);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Erro ao atualizar procedimento.' });
    }
  }

  async excluirAnexo(req, res) {
    try {
      const { anexoId } = req.params;
      const usuarioLogado = req.usuario;
      await procedimentoService.excluirAnexo(anexoId, usuarioLogado);
      return res.status(204).send();
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = new ProcedimentoController();