const express = require('express');
const router = express.Router();
const ssoController = require('../controllers/ssoController');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sso:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da regra
 *           example: 1
 *         tipo:
 *           type: string
 *           enum: [DOMINIO, EMAIL]
 *           description: Aplicação da regra (domínio inteiro ou e-mail específico)
 *           example: "DOMINIO"
 *         valor:
 *           type: string
 *           description: O domínio ou e-mail alvo
 *           example: "finecon.online"
 *         acao:
 *           type: string
 *           enum: [PERMITIR, BLOQUEAR]
 *           description: Ação do sistema para este alvo
 *           example: "BLOQUEAR"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     SsoInput:
 *       type: object
 *       required:
 *         - tipo
 *         - valor
 *         - acao
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [DOMINIO, EMAIL]
 *           example: "DOMINIO"
 *         valor:
 *           type: string
 *           example: "finecon.online"
 *         acao:
 *           type: string
 *           enum: [PERMITIR, BLOQUEAR]
 *           example: "BLOQUEAR"
 * 
 * tags:
 *   - name: SSO
 *     description: Gestão de políticas de acesso via Microsoft SSO
 */

/**
 * @swagger
 * /api/sso:
 *   get:
 *     summary: Lista todas as regras de SSO
 *     description: Retorna a Blocklist e Allowlist cadastradas no sistema.
 *     tags: [SSO]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sso'
 *       500:
 *         description: Erro interno.
 */
router.get('/', autenticar, ssoController.listar);

/**
 * @swagger
 * /api/sso:
 *   post:
 *     summary: Cria uma nova regra de segurança
 *     description: Adiciona uma regra de PERMITIR ou BLOQUEAR. O sistema rejeita regras duplicadas para o mesmo alvo.
 *     tags: [SSO]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SsoInput'
 *     responses:
 *       201:
 *         description: Regra criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sso'
 *       400:
 *         description: Erro de validação ou regra já existente.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/', autenticar, ssoController.criar);

/**
 * @swagger
 * /api/sso/{id}:
 *   delete:
 *     summary: Remove uma regra
 *     tags: [SSO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da regra
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Regra excluída com sucesso.
 *       500:
 *         description: Erro ao deletar a regra.
 */
router.delete('/:id', autenticar, ssoController.deletar);

module.exports = router;