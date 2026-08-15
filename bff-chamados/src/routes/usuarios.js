const router = require('express').Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Endpoints para gestão de usuários e atribuição de papéis (Roles)
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
 *       400:
 *         description: Dados obrigatórios ausentes ou e-mail já cadastrado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado (requer perfil ADMIN)
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/', autenticar, autorizar(['ADMIN', 'OPERADOR']), (req, res) => usuarioController.listar(req, res));
router.post('/', autenticar, autorizar(['ADMIN']), (req, res) => usuarioController.criar(req, res));

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário existente
 *     description: Permite alterar nome, senha, status e perfil. O e-mail só pode ser alterado se o usuário nunca tiver feito login no sistema.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Atualizado
 *               email:
 *                 type: string
 *                 example: carlos.novo@empresa.com
 *               senha:
 *                 type: string
 *                 example: novaSenha123
 *               ativo:
 *                 type: boolean
 *                 example: true
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: E-mail não pode ser alterado após o primeiro login ou e-mail duplicado
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', autenticar, autorizar(['ADMIN']), (req, res) => usuarioController.atualizar(req, res));

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