const service = require('../services/procedimentoService');

exports.listar = async (req, res) => {
  try {
    const { busca, page = 1, limit = 15 } = req.query;
    const resultado = await service.listarProcedimentos({ busca, page, limit });
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.obterPorId = async (req, res) => {
  try {
    const procedimento = await service.obterProcedimentoPorId(req.params.id);
    res.json(procedimento);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  try {
    const novo = await service.criarProcedimento(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    await service.deletarProcedimento(req.params.id);
    res.json({ message: 'Excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adicionarAnexo = async (req, res) => {
  try {
    const anexo = await service.adicionarAnexo(req.params.id, req.file);
    res.status(201).json(anexo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};