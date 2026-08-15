const express = require('express');
const router = express.Router();
const controller = require('../controllers/permissaoController');
const authMiddleware = require('../middlewares/auth');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/procedimentoPermissoes/{procedimentoId}/permissoes:
 *   get:
 *     summary: Lista as permissões de acesso a um procedimento
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: procedimentoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do procedimento
 *     responses:
 *       200:
 *         description: Lista de permissões retornada com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *   post:
 *     summary: Concede ou atualiza permissões em lote para um procedimento
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: procedimentoId
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
 *               - usuariosIds
 *               - nivel
 *             properties:
 *               usuariosIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 5]
 *               nivel:
 *                 type: string
 *                 enum: [VISUALIZAR, EDITAR]
 *                 example: VISUALIZAR
 *     responses:
 *       201:
 *         description: Permissões salvas com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 */
router.get('/:procedimentoId/permissoes', autenticar, (req, res) => controller.listar(req, res));
router.post('/:procedimentoId/permissoes', autenticar, (req, res) => controller.salvarLote(req, res));

/**
 * @openapi
 * /api/procedimentoPermissoes/{procedimentoId}/permissoes/{usuarioId}:
 *   delete:
 *     summary: Remove o acesso de um usuário ao procedimento
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: procedimentoId
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
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Registro não encontrado
 */
router.delete('/:procedimentoId/permissoes/:usuarioId', autenticar, (req, res) => controller.deletar(req, res));

module.exports = router;