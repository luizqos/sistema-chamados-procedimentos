const router = require('express').Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gestão de usuários e atribuição de papéis (Roles)
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários cadastrados
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Luiz Silva
 *                   email:
 *                     type: string
 *                     example: admin@empresa.com
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-30T14:22:00.000Z
 *                   role:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: ADMIN
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado (requer perfil ADMIN)
 *       500:
 *         description: Erro interno no servidor
 *
 *   post:
 *     summary: Cadastra um novo usuário ou operador
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Oliveira
 *               email:
 *                 type: string
 *                 example: carlos.oliveira@empresa.com
 *               senha:
 *                 type: string
 *                 example: senhaForte123
 *               roleId:
 *                 type: integer
 *                 default: 2
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 nome:
 *                   type: string
 *                   example: Carlos Oliveira
 *                 email:
 *                   type: string
 *                   example: carlos.oliveira@empresa.com
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     nome:
 *                       type: string
 *                       example: OPERADOR
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados obrigatórios ausentes ou e-mail já cadastrado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado (requer perfil ADMIN)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', autenticar, autorizar(['ADMIN']), (req, res) => usuarioController.listar(req, res));
router.post('/', autenticar, autorizar(['ADMIN']), (req, res) => usuarioController.criar(req, res));

/**
 * @swagger
 * /api/usuarios/{id}/status:
 *   patch:
 *     summary: Alterna o status (ativo/inativo) de um usuário (Soft Delete)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ativo
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Status do usuário alterado com sucesso
 *       400:
 *         description: Tentativa de desativar a própria conta não permitida
 */
router.patch('/:id/status', autenticar, autorizar(['ADMIN']), (req, res) => usuarioController.alternarStatus(req, res));

module.exports = router;