const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verifica a saúde da aplicação e conexão com o banco de dados
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Aplicação e banco de dados operando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: string
 *                   example: 120s
 *                 timestamp:
 *                   type: string
 *                   example: 2026-08-04T17:15:00.000Z
 *                 database:
 *                   type: string
 *                   example: healthy
 *       500:
 *         description: Falha na conexão com o banco de dados ou erro interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 database:
 *                   type: string
 *                   example: unhealthy
 *                 details:
 *                   type: string
 */
router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      database: 'healthy'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'unhealthy',
      details: error.message
    });
  }
});

module.exports = router;