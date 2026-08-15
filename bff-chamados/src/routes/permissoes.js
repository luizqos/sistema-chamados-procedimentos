const express = require('express');
const router = express.Router();
const controller = require('../controllers/permissaoController');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/procedimentos/{id}/permissoes:
 *   get:
 *     summary: Lista as permissões de acesso a um procedimento
 *     tags: [Permissões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do procedimento
 *     responses:
 *       200:
 *         description: Lista de permissões retornada com sucesso
 *   post:
 *     summary: Concede ou atualiza a permissão de um usuário em um procedimento
 *     tags: [Permissões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do procedimento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - nivel
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               nivel:
 *                 type: string
 *                 enum: [VISUALIZAR, EDITAR]
 *     responses:
 *       201:
 *         description: Permissão salva com sucesso
 */
router.get('/procedimentos/:id/permissoes', autenticar, (req, res) => controller.listar(req, res));
router.post('/procedimentos/:id/permissoes', autenticar, (req, res) => controller.salvar(req, res));

/**
 * @openapi
 * /api/procedimentos/{id}/permissoes/{usuarioId}:
 *   delete:
 *     summary: Remove o acesso de um usuário ao procedimento
 *     tags: [Permissões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do procedimento
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Permissão removida com sucesso
 */
router.delete('/procedimentos/:id/permissoes/:usuarioId', autenticar, (req, res) => controller.deletar(req, res));

module.exports = router;