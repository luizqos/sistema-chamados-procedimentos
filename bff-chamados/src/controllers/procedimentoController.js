const service = require('../services/procedimentoService');

exports.listar = async (req, res) => {
  try {
    const { busca, page = 1, limit = 15 } = req.query;
    const resultado = await service.listarProcedimentos({ busca, page, limit });
    res.json(resultado);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const procedimento = await service.obterProcedimentoPorId(req.params.id);
    res.json(procedimento);
  } catch (error) {
    const status = error.statusCode || 404;
    res.status(status).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novo = await service.criarProcedimento(req.body, req.usuario);
    res.status(201).json(novo);
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    await service.deletarProcedimento(req.params.id, req.usuario);
    res.json({ message: 'Excluído com sucesso' });
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

exports.adicionarAnexo = async (req, res) => {
  try {
    const anexo = await service.adicionarAnexo(req.params.id, req.file);
    res.status(201).json(anexo);
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({ error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const procedimentoAtualizado = await service.atualizarProcedimento(id, req.body, req.usuario);
    return res.json(procedimentoAtualizado);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message || 'Erro ao atualizar procedimento.' });
  }
};