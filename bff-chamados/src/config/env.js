const dotenv = require('dotenv');
dotenv.config();

const requiredEnvs = ['DATABASE_URL', 'JWT_SECRET'];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`[FATAL] Variável de ambiente obrigatória não definida: ${env}`);
    process.exit(1);
  }
}

module.exports = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};