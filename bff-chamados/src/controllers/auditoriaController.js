const auditoriaService = require('../services/auditoriaService');

class AuditoriaController {
  async listar(req, res) {
    try {
      const { page = 1, limit = 15, busca = '' } = req.query;
      const resultado = await auditoriaService.listarLogs(Number(page), Number(limit), busca);
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar logs de auditoria.' });
    }
  }
}

module.exports = new AuditoriaController();