const express = require('express');
const router = express.Router();
const procedimentoController = require('../controllers/procedimentoController');
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
router.get('/', autenticar, procedimentoController.listar);
router.post('/', autenticar, procedimentoController.criar);

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
router.get('/:id', autenticar, procedimentoController.obterPorId);
router.delete('/:id', autenticar, (req, res) => procedimentoController.deletar(req, res));

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
router.post('/:id/anexos', autenticar, upload.single('arquivo'), procedimentoController.adicionarAnexo);

/**
 * @openapi
 * /api/procedimentos/{id}:
 *   put:
 *     summary: Atualiza um procedimento existente (Título, Descrição, Script ou Status Público)
 *     tags: [Procedimentos]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               script_passo_a_passo:
 *                 type: string
 *               publico:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Procedimento atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Procedimento não encontrado
 */
router.put('/:id', autenticar, (req, res) => procedimentoController.atualizar(req, res));

/**
 * @swagger
 * /api/procedimentos/anexos/{anexoId}:
 *   delete:
 *     summary: Excluir um anexo de um procedimento
 *     description: Remove permanentemente um anexo do sistema. Requer autenticação e permissão de Administrador ou de criador do procedimento.
 *     tags:
 *       - Procedimentos - Anexos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anexoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único do anexo a ser excluído
 *     responses:
 *       204:
 *         description: Anexo excluído com sucesso (Nenhum conteúdo retornado)
 *       401:
 *         description: Não autorizado (Token inválido ou ausente)
 *       403:
 *         description: Acesso negado (Usuário sem permissão para excluir este anexo)
 *       404:
 *         description: Anexo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/anexos/:anexoId', autenticar, procedimentoController.excluirAnexo);

module.exports = router;