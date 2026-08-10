const router = require('express').Router();
const authController = require('../controllers/authController');
const ssoController = require('../controllers/ssoController');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticação de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil retornado com sucesso
 *       401:
 *         description: Token ausente ou inválido
 */
router.get('/me', autenticar, (req, res) => authController.me(req, res));

router.get('/setup-status', (req, res) => authController.verificarSetup(req, res));
router.post('/setup-inicial', (req, res) => authController.setupInicial(req, res));
router.post('/sso/microsoft', (req, res) => ssoController.loginMicrosoft(req, res));

module.exports = router;