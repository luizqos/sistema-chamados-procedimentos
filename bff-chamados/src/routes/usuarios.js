const router = require('express').Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cadastra um novo usuário ou operador (Apenas ADMIN)
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
 *               role:
 *                 type: string
 *                 enum: [ADMIN, OPERADOR]
 *                 default: OPERADOR
 *                 example: OPERADOR
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
 *                   type: string
 *                   example: OPERADOR
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
router.post('/', autenticar, autorizar(['ADMIN']), (req, res) => usuarioController.criar(req, res));

module.exports = router;