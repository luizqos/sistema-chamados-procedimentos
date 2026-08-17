const router = require('express').Router();
const auditoriaController = require('../controllers/auditoriaController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditoriaLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         acao:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE]
 *           example: "UPDATE"
 *         entidade:
 *           type: string
 *           example: "Procedimento"
 *         registro_id:
 *           type: string
 *           example: "12"
 *         dados_antigos:
 *           type: object
 *           nullable: true
 *         dados_novos:
 *           type: object
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-08-17T15:00:00.000Z"
 *         usuario:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 5
 *             nome:
 *               type: string
 *               example: "Luiz Silva"
 *             email:
 *               type: email
 *               example: "luiz@empresa.com"
 *
 * tags:
 *   - name: Auditoria
 *     description: Trilha de auditoria e logs de alterações do sistema
 * 
 * @swagger
 * /api/auditoria:
 *   get:
 *     summary: Lista os logs de auditoria paginados
 *     description: Retorna o histórico de ações (Criações, Atualizações e Deleções) realizadas no sistema. Requer perfil ADMIN.
 *     tags: [Auditoria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Quantidade de registros por página
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Termo de busca por entidade, ação ou ID do registro
 *     responses:
 *       200:
 *         description: Lista de logs retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditoriaLog'
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado (Requer perfil ADMIN)
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', autenticar, autorizar(['ADMIN']), (req, res) => auditoriaController.listar(req, res));

module.exports = router;