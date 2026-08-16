const procedimentoService = require('../services/procedimentoService');

exports.listar = async (req, res) => {
  try {
    const { busca, page = 1, limit = 15 } = req.query;
    const resultado = await procedimentoService.listarProcedimentos({ busca, page, limit }, req.usuario);
    return res.json(resultado);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const procedimento = await procedimentoService.obterProcedimentoPorId(req.params.id);
    res.json(procedimento);
  } catch (error) {
    const status = error.statusCode || 404;
    res.status(status).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novo = await procedimentoService.criarProcedimento(req.body, req.usuario);
    res.status(201).json(novo);
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    await procedimentoService.deletarProcedimento(req.params.id, req.usuario);
    res.json({ message: 'Excluído com sucesso' });
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

exports.adicionarAnexo = async (req, res) => {
  try {
    const anexo = await procedimentoService.adicionarAnexo(req.params.id, req.file, req.usuario);
    res.status(201).json(anexo);
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const procedimentoAtualizado = await procedimentoService.atualizarProcedimento(id, req.body, req.usuario);
    return res.json(procedimentoAtualizado);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message || 'Erro ao atualizar procedimento.' });
  }
};

exports.excluirAnexo = async (req, res) => {
  try {
    const { anexoId } = req.params;
    const usuarioLogado = req.usuario;
    await procedimentoService.excluirAnexo(anexoId, usuarioLogado);
    return res.status(204).send();
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message });
  }
};