const express = require('express');
const router = express.Router();
const controller = require('../controllers/procedimentoController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/procedimentos:
 *   get:
 *     summary: Lista todos os procedimentos ou realiza busca por palavra-chave
 *     tags: [Procedimentos]
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Termo para pesquisa em título, descrição ou script
 *     responses:
 *       200:
 *         description: Lista de procedimentos retornada com sucesso
 *   post:
 *     summary: Cria um novo procedimento
 *     tags: [Procedimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - script_passo_a_passo
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               script_passo_a_passo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Procedimento criado
 */
router.get('/', autenticar, controller.listar);
router.post('/', autenticar, controller.criar);

/**
 * @openapi
 * /api/procedimentos/{id}:
 *   get:
 *     summary: Obtém os detalhes de um procedimento por ID
 *     tags: [Procedimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do procedimento e lista de anexos
 *       404:
 *         description: Procedimento não encontrado
 *   delete:
 *     summary: Exclui um procedimento e seus anexos do disco
 *     tags: [Procedimentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Procedimento excluído com sucesso
 */
router.get('/:id', autenticar, controller.obterPorId);
router.delete('/:id', autenticar, (req, res) => controller.deletar(req, res));

/**
 * @openapi
 * /api/procedimentos/{id}/anexos:
 *   post:
 *     summary: Realiza o upload de imagem ou vídeo para um procedimento (Máx 300MB)
 *     tags: [Anexos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Anexo enviado com sucesso
 */
router.post('/:id/anexos', autenticar, upload.single('arquivo'), controller.adicionarAnexo);

module.exports = router;